import { json } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import crypto from 'crypto';
import { db } from '$lib/server/db';
import { verifyPassword, createSessionToken, SESSION_COOKIE } from '$lib/server/auth';

export async function POST({ request, cookies }) {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return json(
				{
					success: false,
					message: 'Email and password are required.'
				},
				{ status: 400 }
			);
		}

		const normalizedEmail = email.trim().toLowerCase();

		const result = await db.execute(sql`
			SELECT id, email, full_name, role, active, password_hash
			FROM admin_users
			WHERE email = ${normalizedEmail}
			LIMIT 1
		`);

		if (result.rows.length === 0) {
			return json(
				{
					success: false,
					message: 'Invalid email or password.'
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
			password_hash: string;
		};

		if (!admin.active) {
			return json(
				{
					success: false,
					message: 'This administrator account is inactive.'
				},
				{ status: 403 }
			);
		}

		if (!verifyPassword(password, admin.password_hash)) {
			return json(
				{
					success: false,
					message: 'Invalid email or password.'
				},
				{ status: 401 }
			);
		}

		const sessionToken = createSessionToken();

		const tokenHash = crypto
			.createHash('sha256')
			.update(sessionToken)
			.digest('hex');

		const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 8);

		await db.execute(sql`
			INSERT INTO admin_sessions (
				admin_user_id,
				token_hash,
				expires_at
			)
			VALUES (
				${admin.id},
				${tokenHash},
				${expiresAt}
			)
		`);

		cookies.set(SESSION_COOKIE, sessionToken, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			expires: expiresAt
		});

		return json({
			success: true,
			message: 'Login successful.',
			admin: {
				id: admin.id,
				email: admin.email,
				fullName: admin.full_name,
				role: admin.role
			}
		});
	} catch (error) {
		console.error('Admin login failed:', error);

		return json(
			{
				success: false,
				message: 'An unexpected error occurred while signing in.'
			},
			{ status: 500 }
		);
	}
}