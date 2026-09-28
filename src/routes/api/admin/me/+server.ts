import { json } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import crypto from 'crypto';
import { db } from '$lib/server/db';
import { SESSION_COOKIE } from '$lib/server/auth';

export async function GET({ cookies }) {
	try {
		const sessionToken = cookies.get(SESSION_COOKIE);

		if (!sessionToken) {
			return json(
				{
					success: false,
					message: 'Not authenticated.'
				},
				{ status: 401 }
			);
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
			LIMIT 1
		`);

		if (result.rows.length === 0) {
			return json(
				{
					success: false,
					message: 'Session is invalid.'
				},
				{ status: 401 }
			);
		}

		const admin = result.rows[0] as {
			id: string;
			email: string;
			full_name: string;
			role: string;
			active: boolean;
			expires_at: Date | string;
		};

		const expiresAt = new Date(admin.expires_at);

		if (expiresAt <= new Date()) {
			await db.execute(sql`
				DELETE FROM admin_sessions
				WHERE token_hash = ${tokenHash}
			`);

			cookies.delete(SESSION_COOKIE, {
				path: '/'
			});

			return json(
				{
					success: false,
					message: 'Session has expired.'
				},
				{ status: 401 }
			);
		}

		if (!admin.active) {
			return json(
				{
					success: false,
					message: 'Administrator account is inactive.'
				},
				{ status: 403 }
			);
		}

		return json({
			success: true,
			admin: {
				id: admin.id,
				email: admin.email,
				fullName: admin.full_name,
				role: admin.role
			}
		});
	} catch (error) {
		console.error('Current admin lookup failed:', error);

		return json(
			{
				success: false,
				message: 'Unable to verify administrator session.'
			},
			{ status: 500 }
		);
	}
}
