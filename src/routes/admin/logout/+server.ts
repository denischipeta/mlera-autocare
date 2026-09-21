import { json } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import crypto from 'crypto';
import { db } from '$lib/server/db';
import { SESSION_COOKIE } from '$lib/server/auth';

export async function POST({ cookies }) {
	try {
		const sessionToken = cookies.get(SESSION_COOKIE);

		if (sessionToken) {
			const tokenHash = crypto
				.createHash('sha256')
				.update(sessionToken)
				.digest('hex');

			await db.execute(sql`
				DELETE FROM admin_sessions
				WHERE token_hash = ${tokenHash}
			`);
		}

		cookies.delete(SESSION_COOKIE, {
			path: '/'
		});

		return json({
			success: true,
			message: 'Logout successful.'
		});
	} catch (error) {
		console.error('Admin logout failed:', error);

		// Clear the browser cookie even if the database operation fails.
		cookies.delete(SESSION_COOKIE, {
			path: '/'
		});

		return json(
			{
				success: false,
				message: 'Unable to complete logout.'
			},
			{ status: 500 }
		);
	}
}