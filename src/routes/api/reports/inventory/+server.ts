import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { categories, products } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
	try {
		const productRows = await db
			.select({
				id: products.id,
				sku: products.sku,
				name: products.name,
				categoryId: products.categoryId,
				categoryName: categories.name,
				costPrice: products.costPrice,
				sellingPrice: products.sellingPrice,
				stockQuantity: products.stockQuantity,
				reorderLevel: products.reorderLevel,
				active: products.active
			})
			.from(products)
			.leftJoin(categories, eq(products.categoryId, categories.id));

		const activeProducts = productRows.filter((product) => product.active);

		const totalStockUnits = activeProducts.reduce(
			(total, product) => total + product.stockQuantity,
			0
		);

		const inventoryCostValue = activeProducts.reduce(
			(total, product) =>
				total +
				Number(product.costPrice ?? 0) * product.stockQuantity,
			0
		);

		const potentialSalesValue = activeProducts.reduce(
			(total, product) =>
				total +
				Number(product.sellingPrice ?? 0) * product.stockQuantity,
			0
		);

		const lowStockProducts = activeProducts.filter(
			(product) =>
				product.stockQuantity > 0 &&
				product.stockQuantity <= product.reorderLevel
		);

		const outOfStockProducts = activeProducts.filter(
			(product) => product.stockQuantity <= 0
		);

		const categoryMap = new Map<
			string,
			{
				categoryId: string | null;
				categoryName: string;
				productCount: number;
				stockUnits: number;
				inventoryValue: number;
				potentialSalesValue: number;
			}
		>();

		for (const product of activeProducts) {
			const categoryKey = product.categoryId ?? 'uncategorized';
			const categoryName = product.categoryName ?? 'Uncategorized';

			if (!categoryMap.has(categoryKey)) {
				categoryMap.set(categoryKey, {
					categoryId: product.categoryId,
					categoryName,
					productCount: 0,
					stockUnits: 0,
					inventoryValue: 0,
					potentialSalesValue: 0
				});
			}

			const category = categoryMap.get(categoryKey)!;

			category.productCount += 1;
			category.stockUnits += product.stockQuantity;
			category.inventoryValue +=
				Number(product.costPrice ?? 0) * product.stockQuantity;
			category.potentialSalesValue +=
				Number(product.sellingPrice ?? 0) * product.stockQuantity;
		}

		const productsReport = activeProducts.map((product) => {
			const stock = product.stockQuantity;

			let status = 'In Stock';

			if (stock <= 0) {
				status = 'Out of Stock';
			} else if (stock <= product.reorderLevel) {
				status = 'Low Stock';
			}

			return {
				id: product.id,
				sku: product.sku,
				name: product.name,
				categoryName: product.categoryName ?? 'Uncategorized',
				costPrice: Number(product.costPrice ?? 0),
				sellingPrice: Number(product.sellingPrice ?? 0),
				stockQuantity: stock,
				reorderLevel: product.reorderLevel,
				stockValue:
					Number(product.costPrice ?? 0) * stock,
				potentialSalesValue:
					Number(product.sellingPrice ?? 0) * stock,
				status
			};
		});

		return json({
			summary: {
				totalProducts: activeProducts.length,
				totalStockUnits,
				inventoryCostValue,
				potentialSalesValue,
				lowStockCount: lowStockProducts.length,
				outOfStockCount: outOfStockProducts.length
			},
			categories: Array.from(categoryMap.values()).sort((a, b) =>
				a.categoryName.localeCompare(b.categoryName)
			),
			products: productsReport.sort((a, b) =>
				a.name.localeCompare(b.name)
			)
		});
	} catch (error) {
		console.error('Failed to generate inventory report:', error);

		return json(
			{
				error: 'Failed to generate inventory report.'
			},
			{ status: 500 }
		);
	}
}
