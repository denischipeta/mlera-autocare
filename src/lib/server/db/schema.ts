import {
	boolean,
	index,
	integer,
	numeric,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar
} from 'drizzle-orm/pg-core';

export const categories = pgTable(
	'categories',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		name: varchar('name', { length: 100 }).notNull().unique(),
		description: text('description'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	}
);

export const products = pgTable(
	'products',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		sku: varchar('sku', { length: 100 }).notNull().unique(),
		name: varchar('name', { length: 255 }).notNull(),
		categoryId: uuid('category_id'),
		description: text('description'),
		costPrice: numeric('cost_price', { precision: 12, scale: 2 }),
		sellingPrice: numeric('selling_price', { precision: 12, scale: 2 }),
		stockQuantity: integer('stock_quantity').default(0).notNull(),
		reorderLevel: integer('reorder_level').default(5).notNull(),
		imageUrl: text('image_url'),
		active: boolean('active').default(true).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		index('idx_products_active').on(table.active),
		index('idx_products_category').on(table.categoryId),
		index('idx_products_name').on(table.name),
		index('idx_products_stock').on(table.stockQuantity)
	]
);

export const orders = pgTable(
	'orders',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		orderNumber: varchar('order_number', { length: 100 }).notNull().unique(),
		customerName: varchar('customer_name', { length: 255 }).notNull(),
		customerPhone: varchar('customer_phone', { length: 100 }).notNull(),
		customerLocation: text('customer_location'),
		fulfillment: varchar('fulfillment', { length: 20 }).notNull(),
		status: varchar('status', { length: 20 }).notNull(),
		subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
		total: numeric('total', { precision: 12, scale: 2 }).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	}
);

export const orderItems = pgTable(
	'order_items',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		orderId: uuid('order_id').notNull(),
		productId: uuid('product_id').notNull(),
		productName: varchar('product_name', { length: 255 }).notNull(),
		quantity: integer('quantity').notNull(),
		unitPrice: numeric('unit_price', { precision: 12, scale: 2 }),
		total: numeric('total', { precision: 12, scale: 2 })
	}
);

export const stockMovements = pgTable(
	'stock_movements',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		productId: uuid('product_id').notNull(),
		movementType: varchar('movement_type', { length: 30 }).notNull(),
		quantity: integer('quantity').notNull(),
		previousQuantity: integer('previous_quantity').notNull(),
		newQuantity: integer('new_quantity').notNull(),
		reason: text('reason'),
		reference: varchar('reference', { length: 100 }),
		createdBy: uuid('created_by'),
		createdAt: timestamp('created_at').defaultNow().notNull()
	}
);

export const adminUsers = pgTable(
	'admin_users',
	{
		id: uuid('id').defaultRandom().primaryKey(),

		email: varchar('email', { length: 255 }).notNull().unique(),

		passwordHash: text('password_hash').notNull(),

		fullName: varchar('full_name', { length: 255 }).notNull(),

		role: varchar('role', { length: 30 }).default('ADMIN').notNull(),

		active: boolean('active').default(true).notNull(),

		createdAt: timestamp('created_at').defaultNow().notNull(),

		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		index('idx_admin_users_active').on(table.active),
		index('idx_admin_users_email').on(table.email)
	]
);


export const adminSessions = pgTable(
	'admin_sessions',
	{
		id: uuid('id').defaultRandom().primaryKey(),

		adminUserId: uuid('admin_user_id')
			.notNull()
			.references(() => adminUsers.id, { onDelete: 'cascade' }),

		tokenHash: text('token_hash').notNull().unique(),

		expiresAt: timestamp('expires_at').notNull(),

		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [
		index('idx_admin_sessions_admin_user').on(table.adminUserId),
		index('idx_admin_sessions_token_hash').on(table.tokenHash),
		index('idx_admin_sessions_expires_at').on(table.expiresAt)
	]
);