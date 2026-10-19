<script lang="ts">
	import storeHero from '$lib/assets/images/autocare/store-hero.jpeg';
	import { onMount } from 'svelte';
	import jsPDF from 'jspdf';

	import {
		ArrowLeft,
		ArrowRight,
		Check,
		Minus,
		Plus,
		Search,
		ShoppingCart,
		SlidersHorizontal,
		Trash2,
		X,
		MessageCircle,
		Mail,
		Package,
		Truck,
		Store,
		ShieldCheck
	} from 'lucide-svelte';

	type Product = {
		id: string;
		sku: string;
		name: string;
		categoryId: string | null;
		categoryName: string | null;
		description: string | null;
		costPrice: string | null;
		sellingPrice: string | null;
		stockQuantity: number;
		reorderLevel: number;
		imageUrl: string | null;
		active: boolean;
		createdAt: string;
		updatedAt: string;
	};

	type CartItem = Product & {
		cartQuantity: number;
	};

	/* =========================================================
	   PRODUCT DETAILS
	========================================================= */

	let selectedProduct: Product | null = null;
	let productDetailsOpen = false;

	function openProductDetails(product: Product) {
		selectedProduct = product;
		productDetailsOpen = true;
	}

	function closeProductDetails() {
		productDetailsOpen = false;
		selectedProduct = null;
	}

	/* =========================================================
	   PRODUCTS FROM DATABASE
	========================================================= */

	let products: Product[] = [];
	let loadingProducts = true;
	let productsError = '';

	onMount(async () => {
		try {
			const [productsResponse, categoriesResponse] = await Promise.all([
				fetch('/api/products'),
				fetch('/api/categories')
			]);

			if (!productsResponse.ok) {
				throw new Error(
					`Failed to load products: ${productsResponse.status}`
				);
			}

			if (!categoriesResponse.ok) {
				throw new Error(
					`Failed to load categories: ${categoriesResponse.status}`
				);
			}

			const productsData = await productsResponse.json();
			const categoriesData = await categoriesResponse.json();

			console.log('PRODUCTS FROM DATABASE:', productsData);
			console.log('NUMBER OF PRODUCTS:', productsData.length);

			console.log('CATEGORIES FROM DATABASE:', categoriesData);
			console.log('NUMBER OF CATEGORIES:', categoriesData.length);

			products = productsData;
			categories = categoriesData;
		} catch (error) {
			console.error('Failed to load shop data:', error);
			productsError = 'Unable to load shop data. Please try again.';
			categoriesError = 'Unable to load categories.';
		} finally {
			loadingProducts = false;
			loadingCategories = false;
		}
	});

	/* =========================================================
	   CATEGORIES FROM DATABASE
	========================================================= */

	type Category = {
		id: string;
		name: string;
		description: string | null;
		createdAt: string;
		updatedAt: string;
	};

	let categories: Category[] = [];
	let loadingCategories = true;
	let categoriesError = '';

	async function loadCategories() {
		loadingCategories = true;
		categoriesError = '';

		try {
			const response = await fetch('/api/categories');

			if (!response.ok) {
				throw new Error(
					`Failed to load categories: ${response.status}`
				);
			}

			const data = await response.json();

			console.log('CATEGORIES FROM DATABASE:', data);

			categories = data;
		} catch (error) {
			console.error('Failed to load categories:', error);
			categoriesError = 'Unable to load categories.';
		} finally {
			loadingCategories = false;
		}
	}

	let selectedCategory = 'All Products';
	let searchQuery = '';

	/* =========================================================
	   CART
	========================================================= */

	let cart: CartItem[] = [];
	let cartOpen = false;

	/* =========================================================
	   CHECKOUT
	========================================================= */

	let checkoutOpen = false;
	let customerName = '';
	let customerPhone = '';
	let customerEmail = '';
	let customerLocation = '';
	let orderNotes = '';
	let fulfillment = 'Pickup';
	let orderSent = false;
	let orderReference = '';

	/* =========================================================
	   FILTER PRODUCTS
	========================================================= */

	$: filteredProducts = products.filter((product) => {
		if (!product.active) return false;
		const matchesCategory =
			selectedCategory === 'All Products' ||
			product.categoryName === selectedCategory;

		const searchableText = [
			product.name,
			product.sku,
			product.categoryName,
			product.description
		]
			.filter(Boolean)
			.join(' ')
			.toLowerCase();

		const searchTerms = searchQuery
			.trim()
			.toLowerCase()
			.split(/\s+/)
			.filter(Boolean);

		const matchesSearch =
			searchTerms.length === 0 ||
			searchTerms.every((term) =>
				searchableText.includes(term)
			);

		return matchesCategory && matchesSearch;
	});


	/* =========================================================
	   CART TOTALS
	========================================================= */

	$: cartCount = cart.reduce(
		(total, item) => total + item.cartQuantity,
		0
	);

	$: cartSubtotal = cart.reduce((total, item) => {
		const price = Number(item.sellingPrice ?? 0);

		return total + price * item.cartQuantity;
	}, 0);

	$: hasUnavailablePrices = cart.some(
		(item) => Number(item.sellingPrice ?? 0) <= 0
	);

	/* =========================================================
	   FORMATTING
	========================================================= */

	function formatPrice(price: number) {
		if (price <= 0) return 'Price on request';

		return `MK ${new Intl.NumberFormat('en-MW').format(price)}`;
	}

	function formatTotal(price: number) {
		return `MK ${new Intl.NumberFormat('en-MW').format(price)}`;
	}

	/* =========================================================
	   STOCK STATUS
	========================================================= */

	function getStockStatus(product: Product) {
		if (product.stockQuantity <= 0) {
			return {
				label: 'Out of Stock',
				className: 'bg-zinc-900 text-white'
			};
		}

		if (product.stockQuantity <= product.reorderLevel) {
			return {
				label: 'Low Stock',
				className:
					'bg-red-50 text-red-700 ring-1 ring-red-200'
			};
		}

		return {
			label: 'In Stock',
			className:
				'bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200'
		};
	}

	/* =========================================================
	   ADD TO CART
	========================================================= */

	function addToCart(product: Product) {
		if (product.stockQuantity <= 0) return;

		const existing = cart.find(
			(item) => item.id === product.id
		);

		if (existing) {
			if (existing.cartQuantity < product.stockQuantity) {
				existing.cartQuantity += 1;
				cart = [...cart];
			}
		} else {
			cart = [
				...cart,
				{
					...product,
					cartQuantity: 1
				}
			];
		}
	}

	/* =========================================================
	   CART QUANTITY
	========================================================= */

	function increaseQuantity(item: CartItem) {
		if (item.cartQuantity >= item.stockQuantity) return;

		item.cartQuantity += 1;
		cart = [...cart];
	}

	function decreaseQuantity(item: CartItem) {
		if (item.cartQuantity <= 1) {
			removeFromCart(item.id);
			return;
		}

		item.cartQuantity -= 1;
		cart = [...cart];
	}

	function removeFromCart(productId: string) {
		cart = cart.filter(
			(item) => item.id !== productId
		);
	}

	function clearCart() {
		cart = [];
	}

	/* =========================================================
	   CHECKOUT
	========================================================= */

	function openCheckout() {
		if (cart.length === 0) return;

		checkoutOpen = true;
		cartOpen = false;
		orderSent = false;
	}

	function closeCheckout() {
		checkoutOpen = false;
	}

	function generateOrderReference() {
		const timestamp = Date.now().toString().slice(-6);

		return `MLERA-${timestamp}`;
	}

	/* =========================================================
	   ORDER MESSAGE
	========================================================= */

	function createOrderMessage() {
		const reference =
			orderReference || generateOrderReference();

		const lines = cart.map((item) => {
			const price = Number(item.sellingPrice ?? 0);
			const total = price * item.cartQuantity;

			const priceText =
				price > 0
					? `${formatTotal(price)} x ${item.cartQuantity} = ${formatTotal(total)}`
					: `Price on request x ${item.cartQuantity}`;

			return `• ${item.name} — ${priceText}`;
		});

		const message = [
			`*MLERA STORES ORDER*`,
			``,
			`Order Reference: ${reference}`,
			`Fulfilment: ${fulfillment}`,
			``,
			`*Customer Details*`,
			`Name: ${customerName || 'Not provided'}`,
			`Phone: ${customerPhone || 'Not provided'}`,
			`Email: ${customerEmail || 'Not provided'}`,
			`Location: ${customerLocation || 'Not provided'}`,
			``,
			`*Products*`,
			...lines,
			``,
			`*Known Subtotal:* ${formatTotal(cartSubtotal)}`,
			hasUnavailablePrices
				? `Some product prices are not yet listed. Please confirm the final price.`
				: '',
			orderNotes ? `` : '',
			orderNotes
				? `*Notes:* ${orderNotes}`
				: '',
			``,
			`Thank you — Mlera Stores.`
		]
			.filter(Boolean)
			.join('\n');

		return message;
	}

	/* =========================================================
	   DOWNLOAD INVOICE
	========================================================= */

	function downloadInvoice() {
		if (cart.length === 0) return;

		const doc = new jsPDF();

		const reference =
			orderReference || generateOrderReference();

		orderReference = reference;

		const today = new Date().toLocaleDateString('en-GB');

		doc.setFontSize(22);
		doc.setFont('helvetica', 'bold');

		doc.text('MLERA STORES', 20, 25);

		doc.setFontSize(10);
		doc.setFont('helvetica', 'normal');

		doc.text(
			'Automotive Parts, Lubricants & Accessories',
			20,
			32
		);

		doc.text(
			'WhatsApp: +265 997 245 335',
			20,
			39
		);

		doc.text(
			'Email: storesmlera@gmail.com',
			20,
			46
		);

		doc.setFontSize(18);
		doc.setFont('helvetica', 'bold');

		doc.text('INVOICE', 150, 25);

		doc.setFontSize(10);
		doc.setFont('helvetica', 'normal');

		doc.text(
			`Invoice No: ${reference}`,
			150,
			34
		);

		doc.text(
			`Date: ${today}`,
			150,
			41
		);

		doc.setFontSize(12);
		doc.setFont('helvetica', 'bold');

		doc.text(
			'Customer Details',
			20,
			62
		);

		doc.setFontSize(10);
		doc.setFont('helvetica', 'normal');

		doc.text(
			`Name: ${customerName || 'Not provided'}`,
			20,
			70
		);

		doc.text(
			`Phone: ${customerPhone || 'Not provided'}`,
			20,
			77
		);

		doc.text(
			`Email: ${customerEmail || 'Not provided'}`,
			20,
			84
		);

		doc.text(
			`Location: ${customerLocation || 'Not provided'}`,
			20,
			91
		);

		doc.text(
			`Fulfilment: ${fulfillment}`,
			20,
			98
		);

		let y = 112;

		doc.setFillColor(240, 240, 240);

		doc.rect(
			20,
			y - 7,
			170,
			10,
			'F'
		);

		doc.setFont('helvetica', 'bold');

		doc.text('Product', 22, y);
		doc.text('Qty', 120, y);
		doc.text('Unit Price', 135, y);
		doc.text('Total', 170, y);

		y += 10;

		doc.setFont('helvetica', 'normal');

		for (const item of cart) {
			const price = Number(
				item.sellingPrice ?? 0
			);

			const total =
				price * item.cartQuantity;

			const productName =
				item.name.length > 45
					? `${item.name.substring(0, 42)}...`
					: item.name;

			const unitPrice =
				price > 0
					? `MK ${new Intl.NumberFormat('en-MW').format(price)}`
					: 'On request';

			const lineTotal =
				price > 0
					? `MK ${new Intl.NumberFormat('en-MW').format(total)}`
					: 'On request';

			doc.text(
				productName,
				22,
				y
			);

			doc.text(
				String(item.cartQuantity),
				122,
				y
			);

			doc.text(
				unitPrice,
				135,
				y
			);

			doc.text(
				lineTotal,
				170,
				y
			);

			y += 8;

			if (y > 270) {
				doc.addPage();
				y = 20;
			}
		}

		y += 8;

		doc.line(
			20,
			y,
			190,
			y
		);

		y += 10;

		doc.setFont(
			'helvetica',
			'bold'
		);

		doc.text(
			'Known Subtotal:',
			125,
			y
		);

		doc.text(
			formatTotal(cartSubtotal),
			170,
			y
		);

		if (hasUnavailablePrices) {
			y += 12;

			doc.setFont(
				'helvetica',
				'normal'
			);

			doc.setFontSize(9);

			doc.text(
				'Note: Some products do not yet have a listed selling price.',
				20,
				y
			);

			doc.text(
				'Please confirm the final price with Mlera Stores.',
				20,
				y + 6
			);
		}

		if (orderNotes.trim()) {
			y += 20;

			doc.setFontSize(10);

			doc.setFont(
				'helvetica',
				'bold'
			);

			doc.text(
				'Order Notes',
				20,
				y
			);

			doc.setFont(
				'helvetica',
				'normal'
			);

			const noteLines =
				doc.splitTextToSize(
					orderNotes,
					170
				);

			doc.text(
				noteLines,
				20,
				y + 7
			);
		}

		doc.setFontSize(9);

		doc.setFont(
			'helvetica',
			'normal'
		);

		doc.text(
			'Thank you for shopping with Mlera Stores.',
			20,
			285
		);

		doc.text(
			'Please contact us to confirm availability, pricing and fulfilment.',
			20,
			291
		);

		doc.save(
			`Mlera-Stores-Invoice-${reference}.pdf`
		);
	}

	/* =========================================================
	   SEND WHATSAPP ORDER
	========================================================= */

	function sendWhatsApp() {
		if (
			!customerName.trim() ||
			!customerPhone.trim()
		) {
			alert(
				'Please enter the customer name and phone number.'
			);

			return;
		}

		orderReference =
			generateOrderReference();

		const message =
			createOrderMessage();

		const encodedMessage =
			encodeURIComponent(message);

		window.open(
			`https://wa.me/265997245335?text=${encodedMessage}`,
			'_blank'
		);

		orderSent = true;
	}

	/* =========================================================
	   SEND EMAIL ORDER
	========================================================= */

	function sendEmail() {
		if (
			!customerName.trim() ||
			!customerPhone.trim()
		) {
			alert(
				'Please enter the customer name and phone number.'
			);

			return;
		}

		orderReference =
			generateOrderReference();

		const subject =
			`Mlera Stores Order ${orderReference}`;

		const body =
			createOrderMessage();

		window.location.href =
			`mailto:storesmlera@gmail.com?subject=${encodeURIComponent(subject)}` +
			`&body=${encodeURIComponent(body)}`;

		orderSent = true;
	}

	/* =========================================================
	   NAVIGATION
	========================================================= */

	function continueShopping() {
		cartOpen = false;
		checkoutOpen = false;
	}

	function clearFilters() {
		searchQuery = '';
		selectedCategory = 'All Products';
	}
</script>

<svelte:head>
	<title>Mlera Stores | Automotive Parts & Accessories</title>

	<meta
		name="description"
		content="Shop automotive lubricants, spare parts, filters, accessories, safety wear and workshop products from Mlera Stores."
	/>

	<meta
		name="theme-color"
		content="#000000"
	/>
</svelte:head>

<!-- =========================================================
     HEADER
========================================================= -->

<header
	class="sticky top-0 z-50 border-b border-white/10 bg-black/90 text-white shadow-lg backdrop-blur-xl"
>
	<div
		class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6"
	>
		<a
			href="/shop"
			class="flex items-center gap-2"
		>
			<div>
				<div
					class="text-lg font-black tracking-tight sm:text-xl"
				>
					<span class="text-white">MLERA</span>
					<span class="text-red-500">
						STORES
					</span>
				</div>

				<p
					class="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400 sm:block"
				>
					Automotive & Workshop
				</p>
			</div>
		</a>

		<div class="flex items-center gap-2">
			<a
				href="/"
				class="hidden items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:border-red-500/40 hover:bg-white/5 hover:text-white sm:inline-flex"
			>
				<ArrowLeft size={16} />
				AutoCare
			</a>

			<button
				type="button"
				on:click={() => (cartOpen = true)}
				class="relative flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500"
				aria-label="Open shopping cart"
			>
				<ShoppingCart size={20} />

				{#if cartCount > 0}
					<span
						class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-black text-red-600 ring-2 ring-black"
					>
						{cartCount}
					</span>
				{/if}
			</button>
		</div>
	</div>
</header>

<!-- =========================================================
     HERO
========================================================= -->

<section
	class="relative overflow-hidden bg-black px-6 pb-20 pt-28 sm:pb-24 sm:pt-32"
>
	<div class="absolute inset-0">
		<img
			src={storeHero}
			alt=""
			width="1600"
			height="900"
			class="h-full w-full object-cover"
		/>

		<div
			class="absolute inset-0 bg-black/65"
		></div>

		<div
			class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-red-950/30"
		></div>

		<div
			class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent"
		></div>
	</div>

	<div
		class="relative z-10 mx-auto flex min-h-[500px] max-w-7xl items-center"
	>
		<div class="max-w-3xl">
			<p
				class="text-sm font-bold uppercase tracking-[0.25em] text-red-500"
			>
				Mlera Stores
			</p>

			<h1
				class="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl"
			>
				Quality Parts.
				<span class="text-red-500">
					Quality Care.
				</span>
			</h1>

			<p
				class="mt-6 max-w-2xl text-base leading-7 text-gray-200 sm:text-lg sm:leading-8"
			>
				Shop automotive lubricants, spare parts,
				filters, accessories, safety wear and
				workshop products.
			</p>

			<div class="mt-8 flex flex-wrap gap-3">
				<a
					href="#products"
					class="inline-flex items-center rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500"
				>
					Shop Products
				</a>

				<a
					href="/"
					class="inline-flex items-center rounded-xl border border-white/20 bg-black/30 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:border-red-500/50 hover:bg-black/50"
				>
					Back to AutoCare
				</a>
			</div>
		</div>
	</div>
</section>

<!-- =========================================================
     PRODUCTS
========================================================= -->

<section
	id="products"
	class="bg-white px-4 py-16 sm:px-6 lg:py-20"
>
	<div class="mx-auto max-w-7xl">

		<!-- SECTION HEADER -->

		<div
			class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
		>
			<div>
				<p
					class="text-sm font-bold uppercase tracking-[0.2em] text-red-600"
				>
					Mlera Stores
				</p>

				<h2
					class="mt-2 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl"
				>
					Shop Our Products
				</h2>

				<p
					class="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base"
				>
					Browse products from our current inventory.
					Click any product to view more details.
				</p>
			</div>

			<div
				class="flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-600"
			>
				<Package size={17} />

				{#if loadingProducts}
					Loading products...
				{:else}
					{filteredProducts.length} products
				{/if}
			</div>
		</div>

		<!-- SEARCH -->

		<div
			class="mt-8 flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 lg:flex-row"
		>
			<div class="relative flex-1">
				<Search
					size={19}
					class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
				/>

				<input
					type="search"
					bind:value={searchQuery}
					placeholder="Search products, SKU or category..."
					class="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
				/>
			</div>

			<button
				type="button"
				on:click={clearFilters}
				class="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-bold text-zinc-700 transition hover:border-red-200 hover:text-red-600"
			>
				<SlidersHorizontal size={17} />
				Clear Filters
			</button>
		</div>

		<!-- CATEGORY FILTERS -->

		<div class="mt-6">
			<div
				class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
			>
				{#each categories as category}
					<button
						type="button"
						on:click={() =>
							(selectedCategory = category.name)}
						class={`rounded-xl border px-3 py-3 text-xs font-bold transition sm:text-sm ${
							selectedCategory === category.name
								? 'border-red-600 bg-red-600 text-white shadow-lg shadow-red-600/20'
								: 'border-zinc-200 bg-white text-zinc-700 hover:border-red-200 hover:text-red-600'
						}`}
					>
						{category.name}
					</button>
				{/each}
			</div>
		</div>

		<!-- ERROR -->

		{#if productsError}
			<div
				class="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700"
			>
				{productsError}
			</div>
		{/if}

		<!-- LOADING -->

		{#if loadingProducts}
			<div
				class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
			>
				{#each Array(8) as _}
					<div
						class="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
					>
						<div
							class="aspect-square animate-pulse bg-zinc-100"
						></div>

						<div class="space-y-3 p-5">
							<div
								class="h-3 w-20 animate-pulse rounded bg-zinc-100"
							></div>

							<div
								class="h-5 w-3/4 animate-pulse rounded bg-zinc-100"
							></div>

							<div
								class="h-4 w-1/2 animate-pulse rounded bg-zinc-100"
							></div>

							<div
								class="h-10 w-full animate-pulse rounded-xl bg-zinc-100"
							></div>
						</div>
					</div>
				{/each}
			</div>

		{:else if filteredProducts.length === 0}

			<!-- EMPTY -->

			<div
				class="mt-10 rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-16 text-center"
			>
				<div
					class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-zinc-400 shadow-sm"
				>
					<Search size={28} />
				</div>

				<h3
					class="mt-5 text-xl font-black text-zinc-900"
				>
					No products found
				</h3>

				<p
					class="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500"
				>
					Try another search term or select a
					different category.
				</p>

				<button
					type="button"
					on:click={clearFilters}
					class="mt-6 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500"
				>
					Clear Filters
				</button>
			</div>

		{:else}

			<!-- PRODUCT GRID -->

			<div
				class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
			>
				{#each filteredProducts as product}
					{@const stockStatus =
						getStockStatus(product)}

					<div
						role="button"
						tabindex="0"
						class="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-2xl"
						on:click={() =>
							openProductDetails(product)}
						on:keydown={(event) => {
							if (
								event.key === 'Enter' ||
								event.key === ' '
							) {
								event.preventDefault();
								openProductDetails(product);
							}
						}}
					>
						<!-- PRODUCT IMAGE -->

						<div
							class="relative aspect-square overflow-hidden bg-zinc-100"
						>
							{#if product.imageUrl}
								<img
									src={product.imageUrl}
									alt={product.name}
									width="600"
									height="600"
									loading="lazy"
									class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
								/>
							{:else}
								<div
									class="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-400"
								>
									<Package size={52} />

									<span
										class="mt-3 text-[10px] font-bold uppercase tracking-wider"
									>
										Image coming soon
									</span>
								</div>
							{/if}

							<div
								class={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-[10px] font-bold shadow-sm ${stockStatus.className}`}
							>
								{stockStatus.label}
							</div>
						</div>

						<!-- PRODUCT INFORMATION -->

						<div
							class="flex flex-1 flex-col p-5"
						>
							{#if product.categoryName}
								<p
									class="text-[10px] font-bold uppercase tracking-wider text-red-600"
								>
									{product.categoryName}
								</p>
							{/if}

							<h3
								class="mt-2 line-clamp-2 min-h-[48px] text-base font-black leading-6 text-zinc-900"
							>
								{product.name}
							</h3>

							<p
								class="mt-1 text-[10px] font-semibold text-zinc-400"
							>
								SKU: {product.sku}
							</p>

							<p
								class="mt-4 text-lg font-black text-zinc-950"
							>
								{formatPrice(
									Number(
										product.sellingPrice ?? 0
									)
								)}
							</p>

							<div
								class="mt-3 flex items-center justify-between text-xs"
							>
								<span class="text-zinc-500">
									{#if product.stockQuantity > 0}
										{product.stockQuantity}
										available
									{:else}
										Unavailable
									{/if}
								</span>

								<span
									class="font-semibold text-red-600"
								>
									View details
									<ArrowRight
										size={13}
										class="ml-1 inline"
									/>
								</span>
							</div>

							<button
								type="button"
								disabled={
									product.stockQuantity <= 0
								}
								on:click|stopPropagation={() =>
									addToCart(product)}
								class={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
									product.stockQuantity <= 0
										? 'cursor-not-allowed bg-zinc-100 text-zinc-400'
										: 'bg-red-600 text-white shadow-lg shadow-red-600/10 hover:bg-red-500'
								}`}
							>
								<ShoppingCart size={17} />

								{product.stockQuantity <= 0
									? 'Out of Stock'
									: 'Add to Cart'}
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- =========================================================
     PRODUCT DETAILS MODAL
========================================================= -->

{#if productDetailsOpen && selectedProduct}
	<div
		class="fixed inset-0 z-[55] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm sm:py-10"
		on:click={closeProductDetails}
		role="presentation"
	>
		<div
			class="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
			on:click|stopPropagation
			role="dialog"
			aria-modal="true"
			aria-labelledby="product-details-title"
		>
			<!-- MODAL HEADER -->

			<div
				class="flex items-center justify-between border-b border-zinc-200 bg-zinc-950 px-5 py-4 text-white sm:px-6"
			>
				<div>
					<p
						class="text-xs font-bold uppercase tracking-widest text-red-500"
					>
						Product Details
					</p>

					<p
						class="mt-1 text-sm text-gray-400"
					>
						Mlera Stores
					</p>
				</div>

				<button
					type="button"
					on:click={closeProductDetails}
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-gray-400 transition hover:bg-white/10 hover:text-white"
					aria-label="Close product details"
				>
					<X size={20} />
				</button>
			</div>

			<!-- MODAL CONTENT -->

			<div class="grid md:grid-cols-2">

				<!-- PRODUCT IMAGE -->

				<div
					class="relative flex min-h-[280px] items-center justify-center bg-zinc-100 p-6 sm:min-h-[360px]"
				>
					{#if selectedProduct.imageUrl}
						<img
							src={selectedProduct.imageUrl}
							alt={selectedProduct.name}
							width="600"
							height="600"
							class="h-full max-h-[420px] w-full rounded-2xl object-cover shadow-sm"
						/>
					{:else}
						<div
							class="flex aspect-square w-full max-w-[420px] flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-400"
						>
							<Package size={64} />

							<span
								class="mt-4 text-xs font-bold uppercase tracking-wider"
							>
								Image coming soon
							</span>
						</div>
					{/if}

				

					<div
						class={`absolute left-9 top-9 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${getStockStatus(selectedProduct).className}`}
					>
						{getStockStatus(selectedProduct).label}
					</div>
				</div>

				<!-- PRODUCT DETAILS -->

				<div
					class="flex flex-col p-6 sm:p-8"
				>
					{#if selectedProduct.categoryName}
						<p
							class="text-xs font-bold uppercase tracking-wider text-red-600"
						>
							{selectedProduct.categoryName}
						</p>
					{/if}

					<h2
						id="product-details-title"
						class="mt-2 text-2xl font-black leading-tight text-zinc-900 sm:text-3xl"
					>
						{selectedProduct.name}
					</h2>

					<p
						class="mt-2 text-xs font-semibold text-zinc-400"
					>
						SKU: {selectedProduct.sku}
					</p>

					<!-- DESCRIPTION -->

					<div class="mt-6">
						<h3
							class="text-sm font-bold uppercase tracking-wider text-zinc-900"
						>
							Product Description
						</h3>

						{#if selectedProduct.description}
							<p
								class="mt-3 text-sm leading-7 text-zinc-600"
							>
								{selectedProduct.description}
							</p>
						{:else}
							<p
								class="mt-3 rounded-xl bg-zinc-50 p-4 text-sm leading-6 text-zinc-500"
							>
								More information about this
								product will be provided by
								Mlera Stores.
							</p>
						{/if}
					</div>

					<!-- PRICE & STOCK -->

					<div
						class="mt-6 grid grid-cols-2 gap-3"
					>
						<div
							class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
						>
							<p
								class="text-xs font-medium text-zinc-400"
							>
								Selling Price
							</p>

							<p
								class="mt-1 text-lg font-black text-zinc-950"
							>
								{formatPrice(
									Number(
										selectedProduct.sellingPrice ??
											0
									)
								)}
							</p>
						</div>

						<div
							class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
						>
							<p
								class="text-xs font-medium text-zinc-400"
							>
								Availability
							</p>

							<p
								class="mt-1 text-lg font-black text-zinc-950"
							>
								{selectedProduct.stockQuantity >
								0
									? `${selectedProduct.stockQuantity} available`
									: 'Out of stock'}
							</p>
						</div>
					</div>

					<!-- ACTIONS -->

					<div
						class="mt-auto pt-7"
					>
						<button
							type="button"
							on:click={() => {
								addToCart(
									selectedProduct!
								);

								closeProductDetails();
							}}
							disabled={
								selectedProduct.stockQuantity <=
								0
							}
							class={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 font-bold transition ${
								selectedProduct.stockQuantity <=
								0
									? 'cursor-not-allowed bg-zinc-200 text-zinc-400'
									: 'bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-500'
							}`}
						>
							<ShoppingCart
								size={18}
							/>

							{selectedProduct.stockQuantity <=
							0
								? 'Out of Stock'
								: 'Add to Cart'}
						</button>

						<button
							type="button"
							on:click={
								closeProductDetails
							}
							class="mt-3 w-full rounded-xl border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
						>
							Continue Shopping
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- =========================================================
     CART DRAWER
========================================================= -->

{#if cartOpen}
	<div
		class="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
		on:click={() => (cartOpen = false)}
		role="presentation"
	>
		<aside
			class="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl"
			on:click|stopPropagation
			role="dialog"
			aria-modal="true"
			aria-label="Shopping cart"
		>
			<!-- CART HEADER -->

			<div
				class="flex items-center justify-between border-b border-zinc-200 bg-zinc-950 px-5 py-5 text-white"
			>
				<div>
					<p
						class="text-xs font-bold uppercase tracking-widest text-red-500"
					>
						Your Cart
					</p>

					<h2
						class="mt-1 text-xl font-black"
					>
						Shopping Cart
					</h2>
				</div>

				<button
					type="button"
					on:click={() =>
						(cartOpen = false)}
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-gray-400 transition hover:bg-white/10 hover:text-white"
					aria-label="Close cart"
				>
					<X size={20} />
				</button>
			</div>

			<!-- CART CONTENT -->

			{#if cart.length === 0}

				<div
					class="flex flex-1 flex-col items-center justify-center px-6 text-center"
				>
					<div
						class="flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-100 text-zinc-400"
					>
						<ShoppingCart
							size={36}
						/>
					</div>

					<h3
						class="mt-5 text-xl font-black text-zinc-900"
					>
						Your cart is empty
					</h3>

					<p
						class="mt-2 max-w-sm text-sm leading-6 text-zinc-500"
					>
						Add products to your cart before
						checking out.
					</p>

					<button
						type="button"
						on:click={continueShopping}
						class="mt-6 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-500"
					>
						Start Shopping
					</button>
				</div>

			{:else}

				<!-- ITEMS -->

				<div
					class="flex-1 space-y-4 overflow-y-auto p-5"
				>
					{#each cart as item}
						<div
							class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
						>
							<div
								class="flex gap-4"
							>
								<div
									class="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-200"
								>
									{#if item.imageUrl}
										<img
											src={item.imageUrl}
											alt={item.name}
											width="160"
											height="160"
											class="h-full w-full object-cover"
										/>
									{:else}
										<div
											class="flex h-full w-full items-center justify-center text-zinc-400"
										>
											<Package
												size={28}
											/>
										</div>
									{/if}
								</div>

								<div
									class="min-w-0 flex-1"
								>
									<p
										class="text-sm font-black text-zinc-900"
									>
										{item.name}
									</p>

									<p
										class="mt-1 text-xs text-zinc-400"
									>
										SKU:
										{item.sku}
									</p>

									<p
										class="mt-2 text-sm font-bold text-zinc-950"
									>
										{formatPrice(
											Number(
												item.sellingPrice ??
													0
											)
										)}
									</p>
								</div>

								<button
									type="button"
									on:click={() =>
										removeFromCart(
											item.id
										)}
									class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-red-50 hover:text-red-600"
									aria-label={`Remove ${item.name}`}
								>
									<Trash2
										size={17}
									/>
								</button>
							</div>

							<div
								class="mt-4 flex items-center justify-between"
							>
								<div
									class="flex items-center overflow-hidden rounded-xl border border-zinc-200 bg-white"
								>
									<button
										type="button"
										on:click={() =>
											decreaseQuantity(
												item
											)}
										class="flex h-9 w-9 items-center justify-center text-zinc-600 transition hover:bg-zinc-100"
										aria-label="Decrease quantity"
									>
										<Minus
											size={15}
										/>
									</button>

									<span
										class="flex h-9 min-w-10 items-center justify-center border-x border-zinc-200 px-2 text-sm font-bold text-zinc-900"
									>
										{item.cartQuantity}
									</span>

									<button
										type="button"
										on:click={() =>
											increaseQuantity(
												item
											)}
										disabled={
											item.cartQuantity >=
											item.stockQuantity
										}
										class="flex h-9 w-9 items-center justify-center text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-300"
										aria-label="Increase quantity"
									>
										<Plus
											size={15}
										/>
									</button>
								</div>

								<p
									class="text-sm font-black text-zinc-950"
								>
									{Number(
										item.sellingPrice ??
											0
									) > 0
										? formatTotal(
												Number(
													item.sellingPrice
												) *
													item.cartQuantity
											)
										: 'On request'}
								</p>
							</div>
						</div>
					{/each}
				</div>

				<!-- CART FOOTER -->

				<div
					class="border-t border-zinc-200 bg-white p-5"
				>
					<div
						class="flex items-center justify-between"
					>
						<span
							class="text-sm font-semibold text-zinc-500"
						>
							Known Subtotal
						</span>

						<span
							class="text-xl font-black text-zinc-950"
						>
							{formatTotal(
								cartSubtotal
							)}
						</span>
					</div>

					{#if hasUnavailablePrices}
						<div
							class="mt-3 rounded-xl bg-red-50 p-3 text-xs leading-5 text-red-700"
						>
							Some products in your cart
							do not have a listed price.
							The final price will be confirmed
							by Mlera Stores.
						</div>
					{/if}

					<button
						type="button"
						on:click={openCheckout}
						class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500"
					>
						Proceed to Checkout
						<ArrowRight
							size={17}
						/>
					</button>

					<button
						type="button"
						on:click={clearCart}
						class="mt-2 w-full rounded-xl px-5 py-3 text-xs font-bold text-zinc-500 transition hover:bg-zinc-50 hover:text-red-600"
					>
						Clear Cart
					</button>
				</div>
			{/if}
		</aside>
	</div>
{/if}

<!-- =========================================================
     CHECKOUT MODAL
========================================================= -->

{#if checkoutOpen}
	<div
		class="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm sm:py-10"
		on:click={closeCheckout}
		role="presentation"
	>
		<div
			class="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
			on:click|stopPropagation
			role="dialog"
			aria-modal="true"
			aria-labelledby="checkout-title"
		>
			<!-- CHECKOUT HEADER -->

			<div
				class="flex items-center justify-between bg-zinc-950 px-5 py-5 text-white sm:px-7"
			>
				<div>
					<p
						class="text-xs font-bold uppercase tracking-widest text-red-500"
					>
						Mlera Stores
					</p>

					<h2
						id="checkout-title"
						class="mt-1 text-2xl font-black"
					>
						Checkout
					</h2>
				</div>

				<button
					type="button"
					on:click={closeCheckout}
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-gray-400 transition hover:bg-white/10 hover:text-white"
					aria-label="Close checkout"
				>
					<X size={20} />
				</button>
			</div>

			<div
				class="max-h-[75vh] overflow-y-auto p-5 sm:p-7"
			>
				<!-- CUSTOMER DETAILS -->

				<div>
					<h3
						class="text-sm font-black uppercase tracking-wider text-zinc-900"
					>
						Customer Details
					</h3>

					<div
						class="mt-4 grid gap-4 sm:grid-cols-2"
					>
						<div>
							<label
								for="customer-name"
								class="mb-2 block text-xs font-bold text-zinc-600"
							>
								Full Name *
							</label>

							<input
								id="customer-name"
								type="text"
								bind:value={customerName}
								placeholder="Your name"
								class="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
							/>
						</div>

						<div>
							<label
								for="customer-phone"
								class="mb-2 block text-xs font-bold text-zinc-600"
							>
								Phone Number *
							</label>

							<input
								id="customer-phone"
								type="tel"
								bind:value={customerPhone}
								placeholder="+265..."
								class="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
							/>
						</div>

						<div>
							<label
								for="customer-email"
								class="mb-2 block text-xs font-bold text-zinc-600"
							>
								Email
							</label>

							<input
								id="customer-email"
								type="email"
								bind:value={customerEmail}
								placeholder="you@example.com"
								class="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
							/>
						</div>

						<div>
							<label
								for="customer-location"
								class="mb-2 block text-xs font-bold text-zinc-600"
							>
								Location
							</label>

							<input
								id="customer-location"
								type="text"
								bind:value={customerLocation}
								placeholder="Area / Town"
								class="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
							/>
						</div>
					</div>
				</div>

				<!-- FULFILMENT -->

				<div class="mt-7">
					<h3
						class="text-sm font-black uppercase tracking-wider text-zinc-900"
					>
						Fulfilment
					</h3>

					<div
						class="mt-4 grid grid-cols-2 gap-3"
					>
						<button
							type="button"
							on:click={() =>
								(fulfillment = 'Pickup')}
							class={`rounded-2xl border p-4 text-left transition ${
								fulfillment === 'Pickup'
									? 'border-red-600 bg-red-50 ring-1 ring-red-600'
									: 'border-zinc-200 bg-white hover:border-red-200'
							}`}
						>
							<Store
								size={20}
								class={
									fulfillment ===
									'Pickup'
										? 'text-red-600'
										: 'text-zinc-500'
								}
							/>

							<p
								class="mt-2 text-sm font-black text-zinc-900"
							>
								Pickup
							</p>

							<p
								class="mt-1 text-xs text-zinc-500"
							>
								Collect your order
							</p>
						</button>

						<button
							type="button"
							on:click={() =>
								(fulfillment = 'Delivery')}
							class={`rounded-2xl border p-4 text-left transition ${
								fulfillment ===
								'Delivery'
									? 'border-red-600 bg-red-50 ring-1 ring-red-600'
									: 'border-zinc-200 bg-white hover:border-red-200'
							}`}
						>
							<Truck
								size={20}
								class={
									fulfillment ===
									'Delivery'
										? 'text-red-600'
										: 'text-zinc-500'
								}
							/>

							<p
								class="mt-2 text-sm font-black text-zinc-900"
							>
								Delivery
							</p>

							<p
								class="mt-1 text-xs text-zinc-500"
							>
								Arrange delivery
							</p>
						</button>
					</div>
				</div>

				<!-- NOTES -->

				<div class="mt-7">
					<label
						for="order-notes"
						class="mb-2 block text-xs font-bold text-zinc-600"
					>
						Order Notes
					</label>

					<textarea
						id="order-notes"
						bind:value={orderNotes}
						rows="3"
						placeholder="Anything we should know about your order?"
						class="w-full resize-none rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
					></textarea>
				</div>

				<!-- ORDER SUMMARY -->

				<div
					class="mt-7 rounded-2xl bg-zinc-50 p-5"
				>
					<div
						class="flex items-center justify-between"
					>
						<h3
							class="text-sm font-black text-zinc-900"
						>
							Order Summary
						</h3>

						<span
							class="text-xs font-bold text-zinc-500"
						>
							{cartCount} items
						</span>
					</div>

					<div
						class="mt-4 space-y-3"
					>
						{#each cart as item}
							<div
								class="flex items-start justify-between gap-4 text-sm"
							>
								<div>
									<p
										class="font-semibold text-zinc-800"
									>
										{item.name}
									</p>

									<p
										class="text-xs text-zinc-500"
									>
										Qty:
										{item.cartQuantity}
									</p>
								</div>

								<p
									class="shrink-0 font-bold text-zinc-900"
								>
									{Number(
										item.sellingPrice ??
											0
									) > 0
										? formatTotal(
												Number(
													item.sellingPrice
												) *
													item.cartQuantity
											)
										: 'On request'}
								</p>
							</div>
						{/each}
					</div>

					<div
						class="mt-5 border-t border-zinc-200 pt-4"
					>
						<div
							class="flex items-center justify-between"
						>
							<span
								class="text-sm font-semibold text-zinc-500"
							>
								Known Subtotal
							</span>

							<span
								class="text-xl font-black text-zinc-950"
							>
								{formatTotal(
									cartSubtotal
								)}
							</span>
						</div>
					</div>

					{#if hasUnavailablePrices}
						<div
							class="mt-4 flex gap-3 rounded-xl border border-red-100 bg-red-50 p-4"
						>
							<ShieldCheck
								size={18}
								class="mt-0.5 shrink-0 text-red-600"
							/>

							<p
								class="text-xs leading-5 text-red-700"
							>
								Some products have no listed
								selling price yet. Mlera Stores
								will confirm the final price
								before fulfilment.
							</p>
						</div>
					{/if}
				</div>

				<!-- ACTIONS -->

				<div class="mt-7 space-y-3">
					<button
						type="button"
						on:click={sendWhatsApp}
						class="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-500"
					>
						<MessageCircle
							size={19}
						/>
						Order via WhatsApp
					</button>

					<button
						type="button"
						on:click={sendEmail}
						class="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-4 text-sm font-bold text-zinc-800 transition hover:border-red-200 hover:text-red-600"
					>
						<Mail size={19} />
						Order via Email
					</button>

					<button
						type="button"
						on:click={downloadInvoice}
						class="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-4 text-sm font-bold text-white transition hover:bg-zinc-800"
					>
						<Package size={18} />
						Download Invoice
					</button>
				</div>

				{#if orderSent}
					<div
						class="mt-5 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800"
					>
						<div
							class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-white"
						>
							<Check
								size={17}
							/>
						</div>

						<div>
							<p
								class="text-sm font-black"
							>
								Order prepared successfully
							</p>

							<p
								class="mt-1 text-xs leading-5"
							>
								Your order reference is
								<strong>
									{orderReference}
								</strong>.
								Please complete the WhatsApp
								or email step if it has not
								already opened.
							</p>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<!-- =========================================================
     FOOTER
========================================================= -->

<footer
	class="border-t border-zinc-800 bg-zinc-950 px-6 py-12 text-white"
>
	<div
		class="mx-auto max-w-7xl"
	>
		<div
			class="grid gap-10 md:grid-cols-3"
		>
			<div>
				<div
					class="text-xl font-black"
				>
					<span class="text-white">
						MLERA
					</span>
					<span class="text-red-500">
						STORES
					</span>
				</div>

				<p
					class="mt-3 max-w-sm text-sm leading-6 text-gray-400"
				>
					Automotive parts, lubricants,
					accessories, workshop products and
					safety wear.
				</p>
			</div>

			<div>
				<h3
					class="text-sm font-black uppercase tracking-wider text-white"
				>
					Contact
				</h3>

				<div
					class="mt-4 space-y-3 text-sm text-gray-400"
				>
					<p>
						WhatsApp:
						<span class="text-gray-200">
							+265 997 245 335
						</span>
					</p>

					<p>
						Email:
						<span class="text-gray-200">
							storesmlera@gmail.com
						</span>
					</p>
				</div>
			</div>

			<div>
				<h3
					class="text-sm font-black uppercase tracking-wider text-white"
				>
					Quick Links
				</h3>

				<div
					class="mt-4 flex flex-col items-start gap-3 text-sm"
				>
					<a
						href="/"
						class="text-gray-400 transition hover:text-red-500"
					>
						Mlera AutoCare
					</a>

					<a
						href="#products"
						class="text-gray-400 transition hover:text-red-500"
					>
						Shop Products
					</a>

					<button
						type="button"
						on:click={() =>
							(cartOpen = true)}
						class="text-gray-400 transition hover:text-red-500"
					>
						Shopping Cart
					</button>
				</div>
			</div>
		</div>

		<div
			class="mt-10 border-t border-zinc-800 pt-6 text-center text-xs text-gray-500"
		>
			© {new Date().getFullYear()}
			Mlera Stores. All rights reserved.
		</div>
	</div>
</footer>