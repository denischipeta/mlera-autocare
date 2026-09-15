import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import dns from 'dns';

const { Pool } = pg;

const connectionUrl = new URL(DATABASE_URL);

const addresses = await dns.promises.resolve4(connectionUrl.hostname);

if (addresses.length === 0) {
	throw new Error(`Unable to resolve database hostname: ${connectionUrl.hostname}`);
}

const pool = new Pool({
	host: addresses[0],
	port: Number(connectionUrl.port) || 5432,
	database: connectionUrl.pathname.slice(1),
	user: decodeURIComponent(connectionUrl.username),
	password: decodeURIComponent(connectionUrl.password),
	ssl: {
		servername: connectionUrl.hostname,
		rejectUnauthorized: true
	}
});

export const db = drizzle(pool);
