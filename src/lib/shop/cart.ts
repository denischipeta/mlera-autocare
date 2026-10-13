export const CART_KEY = 'mlera-cart';

export function loadCart<T = unknown>(): T[] {
	if (typeof localStorage === 'undefined') return [];
	try {
		const raw = localStorage.getItem(CART_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export function saveCart(cart: unknown[]) {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(CART_KEY, JSON.stringify(cart));
	} catch {
		// storage blocked or full; cart still works for this visit
	}
}
