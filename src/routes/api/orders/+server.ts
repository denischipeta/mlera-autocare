import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import {
	orders,
	orderItems,
	products,
	stockMovements
} from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';

type OrderItemInput = {
	productId: string;
	quantity: number;
};

export async function POST({ request }) {
	try {
		const body = await request.json();

		const customerName = String(body.customerName ?? '').trim();
		const customerPhone = String(body.customerPhone ?? '').trim();
		const customerLocation = body.customerLocation
			? String(body.customerLocation).trim()
			: null;
		const fulfillment = String(body.fulfillment ?? '').trim().toUpperCase();
		const items = Array.isArray(body.items) ? body.items : [];

		if (!customerName || !customerPhone) {
			return json(
				{ error: 'Customer name and phone number are required.' },
				{ status: 400 }
			);
		}

		if (!['PICKUP', 'DELIVERY'].includes(fulfillment)) {
			return json(
				{ error: 'Fulfillment must be PICKUP or DELIVERY.' },
				{ status: 400 }
			);
		}

		if (fulfillment === 'DELIVERY' && !customerLocation) {
			return json(
				{ error: 'Delivery address is required for delivery orders.' },
				{ status: 400 }
			);
		}

		if (items.length === 0) {
			return json(
				{ error: 'At least one product is required.' },
				{ status: 400 }
			);
		}

		const normalizedItems: OrderItemInput[] = items.map((item: OrderItemInput) => ({
			productId: String(item.productId ?? '').trim(),
			quantity: Number(item.quantity)
		}));

		for (const item of normalizedItems) {
			if (!item.productId || !Number.isInteger(item.quantity) || item.quantity <= 0) {
				return json(
					{ error: 'Each order item must have a valid product and quantity.' },
					{ status: 400 }
				);
			}
		}

		const orderReference = `MLR-${Date.now()}`;

		const result = await db.transaction(async (tx) => {
			let subtotal = 0;

			const verifiedItems: Array<{
				productId: string;
				productName: string;
				quantity: number;
				unitPrice: number;
				total: number;
				previousQuantity: number;
				newQuantity: number;
			}> = [];

			for (const item of normalizedItems) {
				const [product] = await tx
					.select()
					.from(products)
					.where(eq(products.id, item.productId))
					.limit(1);

				if (!product) {
					throw new Error(`Product ${item.productId} was not found.`);
				}

				if (!product.active) {
					throw new Error(`${product.name} is not available.`);
				}

				if (product.stockQuantity < item.quantity) {
					throw new Error(
						`Insufficient stock for ${product.name}. Available: ${product.stockQuantity}.`
					);
				}

				if (!product.sellingPrice) {
					throw new Error(`${product.name} does not have a selling price.`);
				}

				const unitPrice = Number(product.sellingPrice);
				const total = unitPrice * item.quantity;
				const previousQuantity = product.stockQuantity;
				const newQuantity = previousQuantity - item.quantity;

				subtotal += total;

				verifiedItems.push({
					productId: product.id,
					productName: product.name,
					quantity: item.quantity,
					unitPrice,
					total,
					previousQuantity,
					newQuantity
				});
			}

			const [order] = await tx
				.insert(orders)
				.values({
					orderNumber: orderReference,
					customerName,
					customerPhone,
					customerLocation,
					fulfillment,
					status: 'PENDING',
					subtotal: subtotal.toFixed(2),
					total: subtotal.toFixed(2)
				})
				.returning();

			for (const item of verifiedItems) {
				await tx.insert(orderItems).values({
					orderId: order.id,
					productId: item.productId,
					productName: item.productName,
					quantity: item.quantity,
					unitPrice: item.unitPrice.toFixed(2),
					total: item.total.toFixed(2)
				});

				await tx
					.update(products)
					.set({
						stockQuantity: sql`${products.stockQuantity} - ${item.quantity}`,
						updatedAt: new Date()
					})
					.where(eq(products.id, item.productId));

				await tx.insert(stockMovements).values({
					productId: item.productId,
					movementType: 'SALE',
					quantity: item.quantity,
					previousQuantity: item.previousQuantity,
					newQuantity: item.newQuantity,
					reason: `Sale ${orderReference}`,
					reference: orderReference
				});
			}

			return {
				order,
				items: verifiedItems
			};
		});

		return json(
			{
				success: true,
				orderReference,
				orderId: result.order.id,
				subtotal: result.order.subtotal,
				total: result.order.total,
				items: result.items
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Failed to create order:', error);

		return json(
			{
				error:
					error instanceof Error
						? error.message
						: 'Failed to create order.'
			},
			{ status: 500 }
		);
	}
}
