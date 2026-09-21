import crypto from 'crypto';

const SESSION_COOKIE = 'mlera_admin_session';

export function verifyPassword(password: string, storedHash: string): boolean {
	const [salt, key] = storedHash.split(':');

	if (!salt || !key) {
		return false;
	}

	const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');

	return crypto.timingSafeEqual(
		Buffer.from(key, 'hex'),
		Buffer.from(derivedKey, 'hex')
	);
}

export function createSessionToken(): string {
	return crypto.randomBytes(32).toString('hex');
}

export { SESSION_COOKIE };

