import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { categories, products } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET({ params }) {
	try {
		const productId = params.id;

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
			.leftJoin(categories, eq(products.categoryId, categories.id))
			.where(eq(products.id, productId))
			.limit(1);

		if (result.length === 0) {
			return json(
				{ error: 'Product not found.' },
				{ status: 404 }
			);
		}

		return json(result[0]);
	} catch (error) {
		console.error('Failed to fetch product:', error);

		return json(
			{ error: 'Failed to fetch product.' },
			{ status: 500 }
		);
	}
}

export async function PUT({ params, request }) {
	try {
		const productId = params.id;
		const body = await request.json();

		const sku = String(body.sku ?? '').trim().toUpperCase();
		const name = String(body.name ?? '').trim();
		const categoryId = body.categoryId
			? String(body.categoryId)
			: null;

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
				{
					error:
						'Stock quantity must be a valid non-negative integer.'
				},
				{ status: 400 }
			);
		}

		if (!Number.isInteger(reorderLevel) || reorderLevel < 0) {
			return json(
				{
					error:
						'Reorder level must be a valid non-negative integer.'
				},
				{ status: 400 }
			);
		}

		const existingProduct = await db
			.select({
				id: products.id
			})
			.from(products)
			.where(eq(products.id, productId))
			.limit(1);

		if (existingProduct.length === 0) {
			return json(
				{ error: 'Product not found.' },
				{ status: 404 }
			);
		}

		const duplicateSku = await db
			.select({
				id: products.id
			})
			.from(products)
			.where(eq(products.sku, sku))
			.limit(1);

		if (
			duplicateSku.length > 0 &&
			duplicateSku[0].id !== productId
		) {
			return json(
				{ error: `SKU "${sku}" already exists.` },
				{ status: 409 }
			);
		}

		const category = await db
			.select({
				id: categories.id
			})
			.from(categories)
			.where(eq(categories.id, categoryId))
			.limit(1);

		if (category.length === 0) {
			return json(
				{ error: 'Selected category does not exist.' },
				{ status: 400 }
			);
		}

		const [updatedProduct] = await db
			.update(products)
			.set({
				sku,
				name,
				categoryId,
				description,
				costPrice,
				sellingPrice,
				stockQuantity,
				reorderLevel,
				imageUrl,
				active,
				updatedAt: new Date()
			})
			.where(eq(products.id, productId))
			.returning();

		return json(updatedProduct);
	} catch (error) {
		console.error('Failed to update product:', error);

		return json(
			{ error: 'Failed to update product.' },
			{ status: 500 }
		);
	}
}
