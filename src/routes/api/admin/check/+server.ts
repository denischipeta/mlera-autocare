import { json } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import { db } from '$lib/server/db';

export async function GET() {
	try {
		const result = await db.execute(
			sql`SELECT id, email, full_name, role, active FROM admin_users`
		);

		return json({
			success: true,
			count: result.rows.length,
			admins: result.rows
		});
	} catch (error) {
		console.error('Admin users check failed:', error);

		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : String(error)
			},
			{ status: 500 }
		);
	}
}