import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export async function GET() {
	try {
		await db.execute('SELECT 1');

		return json({
			success: true,
			message: 'Database connection successful'
		});
	} catch (error) {
		console.error('Database test failed:', error);

		return json(
			{
				success: false,
				message: 'Database connection failed'
			},
			{ status: 500 }
		);
	}
}
