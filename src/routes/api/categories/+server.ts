import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { categories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
	const result = await db.select().from(categories);

	return json(result);
}

export async function POST({ request }) {
	try {
		const body = await request.json();

		const name = String(body.name ?? '').trim();
		const description = String(body.description ?? '').trim();

		if (!name) {
			return json(
				{ error: 'Category name is required.' },
				{ status: 400 }
			);
		}

		if (name.length > 100) {
			return json(
				{ error: 'Category name must not exceed 100 characters.' },
				{ status: 400 }
			);
		}

		const existing = await db.select().from(categories);

		const duplicate = existing.some(
			(category) =>
				category.name.trim().toLowerCase() === name.toLowerCase()
		);

		if (duplicate) {
			return json(
				{ error: 'A category with this name already exists.' },
				{ status: 409 }
			);
		}

		const [createdCategory] = await db
			.insert(categories)
			.values({
				name,
				description: description || null
			})
			.returning();

		return json(createdCategory, { status: 201 });
	} catch (error) {
		console.error('Failed to create category:', error);

		return json(
			{ error: 'Failed to create category.' },
			{ status: 500 }
		);
	}
}

export async function PUT({ request }) {
	try {
		const body = await request.json();

		const id = String(body.id ?? '').trim();
		const name = String(body.name ?? '').trim();
		const description = String(body.description ?? '').trim();

		if (!id) {
			return json(
				{ error: 'Category ID is required.' },
				{ status: 400 }
			);
		}

		if (!name) {
			return json(
				{ error: 'Category name is required.' },
				{ status: 400 }
			);
		}

		if (name.length > 100) {
			return json(
				{ error: 'Category name must not exceed 100 characters.' },
				{ status: 400 }
			);
		}

		const existing = await db
			.select()
			.from(categories);

		const duplicate = existing.some(
			(category) =>
				category.id !== id &&
				category.name.trim().toLowerCase() === name.toLowerCase()
		);

		if (duplicate) {
			return json(
				{ error: 'A category with this name already exists.' },
				{ status: 409 }
			);
		}

		const [updatedCategory] = await db
			.update(categories)
			.set({
				name,
				description: description || null,
				updatedAt: new Date()
			})
			.where(eq(categories.id, id))
			.returning();

		if (!updatedCategory) {
			return json(
				{ error: 'Category not found.' },
				{ status: 404 }
			);
		}

		return json(updatedCategory);
	} catch (error) {
		console.error('Failed to update category:', error);

		return json(
			{ error: 'Failed to update category.' },
			{ status: 500 }
		);
	}
}