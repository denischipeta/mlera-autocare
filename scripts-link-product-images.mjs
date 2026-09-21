const BASE_URL = 'http://localhost:5173';

const IMAGE_DIRS = {
	'Hardware & Consumables': '/home/denis/Documents/Products/Hardware and consumables',
	'Safety & Workwear': '/home/denis/Documents/Products/Safty & Workwear',
	'Tools & Workshop': '/home/denis/Documents/Products/Tools & workshop',
	'Electrical & Auto Parts': '/home/denis/Documents/Products/Electrical & Auto Parts',
	'Lubricants': '/home/denis/Documents/Products/Lubricants',
	'Car Care': '/home/denis/Documents/Products/Car Care'
};

const products = [
	// Safety & Workwear
	{ sku: 'SAFETY-BOOTS', file: 'Safety Boots.png' },
	{ sku: 'WORK-SUITS', file: 'Work Suits.jpeg' },
	{ sku: 'SAFETY-TRIANGLES', file: 'Triangles.png' },

	// Hardware & Consumables
	{ sku: 'Q20-BOND-BLUE-DEVIL', file: 'Q20 Bond Blue Devil.png' },
	{ sku: 'REINZOSIL', file: 'Reinzosil.jpg' },
	{ sku: 'PRATLY-QUICKSET-CLEAR', file: 'Pratly Quickset Clear.png' },
	{ sku: 'SILICONE-260ML', file: 'Silicone 260ml.jpg' },
	{ sku: 'SILICONE-WINDOWS-300ML', file: 'Silicone Windows 300ml.jpg' },
	{ sku: 'GUNGUM', file: 'GunGum.png' },
	{ sku: 'SPRAY-PAINT-GLUEDEVIL', file: 'Spray Paint GlueDevil.jpg' },

	// Tools & Workshop
	{ sku: 'JACK-6-TONS', file: '6 Tons Jack.jpg' },
	{ sku: 'RATCHET-TIE', file: 'Ratchet Tie.jpg' },
	{ sku: 'SCISSOR-JACK', file: 'Scissor Jack.jpg' },
	{ sku: 'SPARK-PLUG-WRENCHES', file: 'Spark Plug Wrenches.jpg' },
	{ sku: 'TOOLBOX-TORK-CRAFT', file: 'Toolbox.jpg' },

	// Electrical & Auto Parts
	{ sku: 'WIPERS-BOSCH', file: 'Wipers Bosch.jpg' },

	// Lubricants
	{ sku: 'CASTROL-2T', file: 'CASTROL ACTIV 2T .jpg' },

		// Car Care
	{ sku: 'WASH-WAX-2L', file: 'Wash Wax 2L.jpg' },
	{ sku: 'WASH-WAX-5L', file: 'Wash Wax 5L.jpg' },
	{ sku: 'SHEEN-200ML', file: 'Sheen 200ml.jpg' },
	{ sku: 'SHEEN-300ML', file: 'Sheen.jpg' },
	{ sku: 'SHEEN-750ML', file: 'Sheen 750ml.jpg' },
	{ sku: 'LEATHER-CARE-400ML', file: 'Leather Care 400ml.jpg' },
];

async function getProducts() {
	const response = await fetch(BASE_URL + '/api/products');

	if (!response.ok) {
		throw new Error(
			'Failed to fetch products: HTTP ' + response.status
		);
	}

	return response.json();
}

async function uploadImage(filePath) {
	const { File } = await import('node:buffer');
	const { readFile } = await import('node:fs/promises');

	const buffer = await readFile(filePath);
	const filename = filePath.split('/').pop();

	let mimeType = 'application/octet-stream';

	if (
		filename.toLowerCase().endsWith('.jpg') ||
		filename.toLowerCase().endsWith('.jpeg')
	) {
		mimeType = 'image/jpeg';
	} else if (filename.toLowerCase().endsWith('.png')) {
		mimeType = 'image/png';
	} else if (filename.toLowerCase().endsWith('.webp')) {
		mimeType = 'image/webp';
	}

	const formData = new FormData();

	formData.append(
		'file',
		new File([buffer], filename, { type: mimeType })
	);

	const response = await fetch(BASE_URL + '/api/uploads', {
		method: 'POST',
		body: formData
	});

	const result = await response.json();

	if (!response.ok || !result.url) {
		throw new Error(
			result.error || 'Upload failed: HTTP ' + response.status
		);
	}

	return result.url;
}

async function updateProduct(product, imageUrl) {
	const payload = {
		sku: product.sku,
		name: product.name,
		categoryId: product.categoryId,
		description: product.description,
		costPrice: product.costPrice,
		sellingPrice: product.sellingPrice,
		stockQuantity: product.stockQuantity,
		reorderLevel: product.reorderLevel,
		imageUrl: imageUrl,
		active: product.active
	};

	const response = await fetch(
		BASE_URL + '/api/products/' + product.id,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		}
	);

	const result = await response.json();

	if (!response.ok) {
		throw new Error(
			result.error || 'Update failed: HTTP ' + response.status
		);
	}

	return result;
}

async function main() {
	console.log('');
	console.log('==============================================');
	console.log(' MLERA STORES - PRODUCT IMAGE LINKER');
	console.log('==============================================');
	console.log('');

	const allProducts = await getProducts();

	let success = 0;
	let skipped = 0;
	let failed = 0;

	for (const item of products) {
		console.log('Processing: ' + item.sku);

		const product = allProducts.find(
			(p) => p.sku === item.sku
		);

		if (!product) {
			console.log('  ❌ Product not found');
			console.log('');
			failed++;
			continue;
		}

		if (product.imageUrl) {
			console.log(
				'  ⏭️  Already has image: ' + product.imageUrl
			);
			console.log('');
			skipped++;
			continue;
		}

		let categoryDirectory;
		if (product.categoryName === 'Safety & Workwear') {
	categoryDirectory = IMAGE_DIRS['Safety & Workwear'];
} else if (product.categoryName === 'Tools & Workshop') {
	categoryDirectory = IMAGE_DIRS['Tools & Workshop'];
} else if (product.categoryName === 'Electrical & Auto Parts') {
	categoryDirectory = IMAGE_DIRS['Electrical & Auto Parts'];
} else if (product.categoryName === 'Lubricants') {
	categoryDirectory = IMAGE_DIRS['Lubricants'];
} else if (product.categoryName === 'Car Care') {
	categoryDirectory = IMAGE_DIRS['Car Care'];
} else {
	categoryDirectory = IMAGE_DIRS['Hardware & Consumables'];
}

		const filePath = categoryDirectory + '/' + item.file;

		try {
			console.log('  Uploading: ' + item.file);

			const imageUrl = await uploadImage(filePath);

			console.log('  Uploaded: ' + imageUrl);
			console.log('  Updating product...');

			await updateProduct(product, imageUrl);

			console.log('  ✅ Successfully linked image');
			console.log('');

			success++;
		} catch (error) {
			console.log(
				'  ❌ ' + (error instanceof Error ? error.message : String(error))
			);
			console.log('');

			failed++;
		}
	}

	console.log('==============================================');
	console.log(' COMPLETE');
	console.log('==============================================');
	console.log('Uploaded & linked : ' + success);
	console.log('Skipped           : ' + skipped);
	console.log('Failed            : ' + failed);
	console.log('');
}

main().catch((error) => {
	console.error('');
	console.error('❌ SCRIPT FAILED');
	console.error(
		error instanceof Error ? error.message : String(error)
	);
	process.exit(1);
});
