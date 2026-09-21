import { redirect, json } from '@sveltejs/kit';
import crypto from 'crypto';
import { sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { SESSION_COOKIE } from '$lib/server/auth';

export async function handle({ event, resolve }) {
	const pathname = event.url.pathname;

	const isAdminPage =
		pathname === '/admin' || pathname.startsWith('/admin/');

	const isAdminApi = pathname.startsWith('/api/admin/');

const isPublicRoute =
	pathname === '/admin/login' ||
	pathname === '/api/admin/login' ||
	pathname === '/api/admin/logout';
	
	if (!isAdminPage && !isAdminApi) {
		return resolve(event);
	}

	if (isPublicRoute) {
		return resolve(event);
	}

	const sessionToken = event.cookies.get(SESSION_COOKIE);

	if (!sessionToken) {
		if (isAdminApi) {
			return json(
				{
					success: false,
					message: 'Authentication required.'
				},
				{ status: 401 }
			);
		}

		throw redirect(303, '/admin/login');
	}

	const tokenHash = crypto
		.createHash('sha256')
		.update(sessionToken)
		.digest('hex');

	const result = await db.execute(sql`
		SELECT
			au.id,
			au.email,
			au.full_name,
			au.role,
			au.active,
			s.expires_at
		FROM admin_sessions s
		INNER JOIN admin_users au
			ON au.id = s.admin_user_id
		WHERE s.token_hash = ${tokenHash}
			AND s.expires_at > NOW()
			AND au.active = true
		LIMIT 1
	`);

	if (result.rows.length === 0) {
		event.cookies.delete(SESSION_COOKIE, {
			path: '/'
		});

		if (isAdminApi) {
			return json(
				{
					success: false,
					message: 'Session expired or invalid.'
				},
				{ status: 401 }
			);
		}

		throw redirect(303, '/admin/login');
	}

	return resolve(event);
}
