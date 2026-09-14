import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { categories, products } from '../src/lib/server/db/schema';

dotenv.config({ path: '.env.local' });

const { Pool } = pg;

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

const db = drizzle(pool);
const productData = [
	// Oils & Lubricants
	{
		sku: 'CASTROL-GTX-15W',
		name: 'Castrol Oil GTX 15W',
		category: 'Oils & Lubricants',
		quantity: 17,
		price: null
	},
	{
		sku: 'CASTROL-GTX-20W',
		name: 'Castrol Oil GTX 20W',
		category: 'Oils & Lubricants',
		quantity: 7,
		price: null
	},
	{
		sku: 'CASTROL-ATF',
		name: 'Castrol ATF',
		category: 'Oils & Lubricants',
		quantity: 5,
		price: null
	},
	{
		sku: 'CASTROL-80W90-500ML',
		name: 'Castrol 80W90 (500ml)',
		category: 'Oils & Lubricants',
		quantity: 6,
		price: null
	},
	{
		sku: 'CASTROL-2T',
		name: 'Castrol 2T',
		category: 'Oils & Lubricants',
		quantity: 4,
		price: null
	},
	{
		sku: 'CASTROL-GREASE',
		name: 'Castrol Grease',
		category: 'Oils & Lubricants',
		quantity: 6,
		price: null
	},
	{
		sku: 'Q8',
		name: 'Q8',
		category: 'Oils & Lubricants',
		quantity: 24,
		price: null
	},
	{
		sku: 'Q20-LUBRICANT-300G',
		name: 'Q20 Lubricant 300g',
		category: 'Oils & Lubricants',
		quantity: 6,
		price: null
	},
	{
		sku: 'Q20-LUBRICANT-360G',
		name: 'Q20 Lubricant 360g',
		category: 'Oils & Lubricants',
		quantity: 3,
		price: null
	},
	{
		sku: 'FLUIDMAT-CVT-MV',
		name: 'FluidMat CVT MV',
		category: 'Oils & Lubricants',
		quantity: 14,
		price: 38000
	},

	// Filters
	{
		sku: 'FILTERS-GENERAL',
		name: 'Filters',
		category: 'Filters',
		quantity: 29,
		price: null
	},

	// Fluids & Engine Care
	{
		sku: 'ENGINE-FLASH',
		name: 'Engine Flash',
		category: 'Fluids & Engine Care',
		quantity: 23,
		price: null
	},
	{
		sku: 'RADIATOR-FLASH',
		name: 'Radiator Flash',
		category: 'Fluids & Engine Care',
		quantity: 24,
		price: 11500
	},
	{
		sku: 'BRAKE-FLUID-NOVAS',
		name: 'Brake Fluid Novas',
		category: 'Fluids & Engine Care',
		quantity: 12,
		price: null
	},
	{
		sku: 'BRAKE-FLUID-TOYOTA',
		name: 'Brake Fluid Toyota',
		category: 'Fluids & Engine Care',
		quantity: 12,
		price: null
	},
	{
		sku: 'BRAKE-FLUID-SHELL-20W50',
		name: 'Brake Fluid Shell 20W 50',
		category: 'Fluids & Engine Care',
		quantity: 11,
		price: null
	},
	{
		sku: 'COOLANT-MIDAS',
		name: 'Coolant Midas',
		category: 'Fluids & Engine Care',
		quantity: 22,
		price: null
	},
	{
		sku: 'DIESEL-TREATMENT',
		name: 'Diesel Treatment',
		category: 'Fluids & Engine Care',
		quantity: 3,
		price: 27500
	},
	{
		sku: 'START-UP-350ML',
		name: 'Start Up 350ml',
		category: 'Fluids & Engine Care',
		quantity: 9,
		price: 18000
	},
	{
		sku: 'CARB-CLEANER-285ML',
		name: 'Carb Cleaner 285ml',
		category: 'Fluids & Engine Care',
		quantity: 5,
		price: 14500
	},

	// Electrical & Auto Parts
	{
		sku: 'WIPERS-BOSCH',
		name: 'Wipers Bosch',
		category: 'Electrical & Auto Parts',
		quantity: 14,
		price: null
	},

	// Car Care
	{
		sku: 'WASH-WAX-2L',
		name: 'Wash Wax 2L',
		category: 'Car Care',
		quantity: 3,
		price: null
	},
	{
		sku: 'WASH-WAX-5L',
		name: 'Wash Wax 5L',
		category: 'Car Care',
		quantity: 3,
		price: null
	},
	{
		sku: 'SHEEN-200ML',
		name: 'Sheen 200ml',
		category: 'Car Care',
		quantity: 8,
		price: null
	},
	{
		sku: 'SHEEN-300ML',
		name: 'Sheen 300ml',
		category: 'Car Care',
		quantity: 1,
		price: null
	},
	{
		sku: 'SHEEN-750ML',
		name: 'Sheen 750ml',
		category: 'Car Care',
		quantity: 12,
		price: null
	},
	{
		sku: 'LEATHER-CARE-400ML',
		name: 'Leather Care 400ml',
		category: 'Car Care',
		quantity: 3,
		price: null
	},

	// Tools & Workshop
	{
		sku: 'JACK-6-TONS',
		name: '6 Tons Jack',
		category: 'Tools & Workshop',
		quantity: 2,
		price: null
	},
	{
		sku: 'SCISSOR-JACK',
		name: 'Scissor Jack',
		category: 'Tools & Workshop',
		quantity: 1,
		price: null
	},
	{
		sku: 'TOOLBOX-TORK-CRAFT',
		name: 'Toolbox (Tork Craft)',
		category: 'Tools & Workshop',
		quantity: 2,
		price: null
	},
	{
		sku: 'SPARK-PLUG-WRENCHES',
		name: 'Spark Plug Wrenches',
		category: 'Tools & Workshop',
		quantity: 7,
		price: 12000
	},
	{
		sku: 'RATCHET-TIE',
		name: 'Ratchet Tie',
		category: 'Tools & Workshop',
		quantity: 4,
		price: 65000
	},

	// Safety & Workwear
	{
		sku: 'SAFETY-BOOTS',
		name: 'Safety Boots (all)',
		category: 'Safety & Workwear',
		quantity: 25,
		price: null
	},
	{
		sku: 'WORK-SUITS',
		name: 'Work Suits',
		category: 'Safety & Workwear',
		quantity: 46,
		price: null
	},
	{
		sku: 'SAFETY-TRIANGLES',
		name: 'Triangles',
		category: 'Safety & Workwear',
		quantity: 7,
		price: null
	},

	// Hardware & Consumables
	{
		sku: 'CASCAT-MAKER',
		name: 'Cascat Maker',
		category: 'Hardware & Consumables',
		quantity: 13,
		price: null
	},
	{
		sku: 'Q-BOND',
		name: 'Q Bond',
		category: 'Hardware & Consumables',
		quantity: 6,
		price: 12500
	},
	{
		sku: 'Q20-BOND-BLUE-DEVIL',
		name: 'Q20 Bond Blue Devil',
		category: 'Hardware & Consumables',
		quantity: 3,
		price: 11500
	},
	{
		sku: 'REINZOSIL',
		name: 'Reinzosil',
		category: 'Hardware & Consumables',
		quantity: 6,
		price: null
	},
	{
		sku: 'PRATLY-QUICKSET-CLEAR',
		name: 'Pratly Quickset Clear',
		category: 'Hardware & Consumables',
		quantity: 5,
		price: null
	},
	{
		sku: 'SPRAY-PAINT-GLUEDEVIL',
		name: 'Spray Paint GlueDevil',
		category: 'Hardware & Consumables',
		quantity: 46,
		price: null
	},
	{
		sku: 'SILICONE-260ML',
		name: 'Silicone 260ml',
		category: 'Hardware & Consumables',
		quantity: 28,
		price: 95000
	},
	{
		sku: 'SILICONE-WINDOWS-300ML',
		name: 'Silicone Windows 300ml',
		category: 'Hardware & Consumables',
		quantity: 7,
		price: null
	},
	{
		sku: 'GUNGUM',
		name: 'GunGum',
		category: 'Hardware & Consumables',
		quantity: 8,
		price: 10000
	}
];

async function seed() {
	console.log('Starting product seed...\n');

	const categoryRows = await db.select().from(categories);

	const categoryMap = new Map(
		categoryRows.map((category) => [category.name, category.id])
	);

	for (const product of productData) {
		const categoryId = categoryMap.get(product.category);

		if (!categoryId) {
			throw new Error(`Category not found: ${product.category}`);
		}

		await db
			.insert(products)
			.values({
				sku: product.sku,
				name: product.name,
				categoryId,
				description: null,
				costPrice: null,
				sellingPrice: product.price?.toString() ?? null,
				stockQuantity: product.quantity,
				reorderLevel: 5,
				imageUrl: null,
				active: true
			})
			.onConflictDoNothing({
				target: products.sku
			});

		console.log(
			`✓ ${product.name} | Qty: ${product.quantity} | Price: ${
				product.price ? `MWK ${product.price.toLocaleString()}` : 'Not set'
			}`
		);
	}

	console.log(`\n✓ Seed completed: ${productData.length} products processed.`);
}

seed()
	.catch((error) => {
		console.error('\n✗ Seed failed:');
		console.error(error);
		process.exit(1);
	})
	.finally(() => {
		process.exit(0);
	});
