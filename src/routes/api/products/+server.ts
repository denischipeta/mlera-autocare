import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { categories, products } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
	const result = await db
		.select({
			id: products.id,
			sku: products.sku,
			name: products.name,
			categoryId: products.categoryId,
			categoryName: categories.name,
			description: products.description,
			costPrice: products.costPrice,
			sellingPrice: products.sellingPrice,
			stockQuantity: products.stockQuantity,
			reorderLevel: products.reorderLevel,
			imageUrl: products.imageUrl,
			active: products.active,
			createdAt: products.createdAt,
			updatedAt: products.updatedAt
		})
		.from(products)
		.leftJoin(categories, eq(products.categoryId, categories.id));

	return json(result);
}

export async function POST({ request }) {
	try {
		const body = await request.json();

		const sku = String(body.sku ?? '').trim();
		const name = String(body.name ?? '').trim();
		const categoryId = body.categoryId ? String(body.categoryId) : null;
		const description = body.description
			? String(body.description).trim()
			: null;
		const costPrice =
			body.costPrice === '' || body.costPrice == null
				? null
				: String(body.costPrice);
		const sellingPrice =
			body.sellingPrice === '' || body.sellingPrice == null
				? null
				: String(body.sellingPrice);
		const stockQuantity = Number(body.stockQuantity ?? 0);
		const reorderLevel = Number(body.reorderLevel ?? 5);
		const imageUrl = body.imageUrl
			? String(body.imageUrl).trim()
			: null;
		const active = body.active !== false;

		if (!sku) {
			return json(
				{ error: 'SKU is required.' },
				{ status: 400 }
			);
		}

		if (!name) {
			return json(
				{ error: 'Product name is required.' },
				{ status: 400 }
			);
		}

		if (!categoryId) {
			return json(
				{ error: 'Category is required.' },
				{ status: 400 }
			);
		}

		if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
			return json(
				{ error: 'Stock quantity must be a valid non-negative integer.' },
				{ status: 400 }
			);
		}

		if (!Number.isInteger(reorderLevel) || reorderLevel < 0) {
			return json(
				{ error: 'Reorder level must be a valid non-negative integer.' },
				{ status: 400 }
			);
		}

		const existingSku = await db
			.select({ id: products.id })
			.from(products)
			.where(eq(products.sku, sku))
			.limit(1);

		if (existingSku.length > 0) {
			return json(
				{ error: `SKU "${sku}" already exists.` },
				{ status: 409 }
			);
		}

		const category = await db
			.select({ id: categories.id })
			.from(categories)
			.where(eq(categories.id, categoryId))
			.limit(1);

		if (category.length === 0) {
			return json(
				{ error: 'Selected category does not exist.' },
				{ status: 400 }
			);
		}

		const [createdProduct] = await db
			.insert(products)
			.values({
				sku,
				name,
				categoryId,
				description,
				costPrice,
				sellingPrice,
				stockQuantity,
				reorderLevel,
				imageUrl,
				active
			})
			.returning();

		return json(createdProduct, { status: 201 });
	} catch (error) {
		console.error('Failed to create product:', error);

		return json(
			{ error: 'Failed to create product.' },
			{ status: 500 }
		);
	}
}
