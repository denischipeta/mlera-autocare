import { json } from '@sveltejs/kit';
import { DATABASE_URL } from '$env/static/private';
import pg from 'pg';

const { Pool } = pg;

export async function GET() {
	const pool = new Pool({
		connectionString: DATABASE_URL
	});

	try {
		const result = await pool.query(
			'SELECT current_database() AS database, current_user AS user'
		);

		return json(result.rows[0]);
	} catch (error) {
		console.error('PG CONNECTION ERROR:', error);

		return json(
			{
				error: error instanceof Error ? error.message : String(error)
			},
			{ status: 500 }
		);
	} finally {
		await pool.end();
	}
}
