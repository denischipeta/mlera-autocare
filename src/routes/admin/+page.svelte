<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Package,
		Boxes,
		Tags,
		AlertTriangle,
		ArrowLeft,
		Plus,
		FileText
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

	let products: Product[] = [];
	let loading = true;
	let error = '';

	onMount(async () => {
		try {
			const response = await fetch('/api/products');

			if (!response.ok) {
				throw new Error(`Failed to load products: ${response.status}`);
			}

			products = await response.json();
		} catch (err) {
			console.error('Failed to load admin statistics:', err);
			error = 'Unable to load inventory statistics.';
		} finally {
			loading = false;
		}
	});

	$: activeProducts = products.filter((product) => product.active);

	$: totalProducts = activeProducts.length;

	$: totalUnits = activeProducts.reduce(
		(total, product) => total + product.stockQuantity,
		0
	);

	$: lowStockProducts = activeProducts.filter(
		(product) =>
			product.stockQuantity > 0 &&
			product.stockQuantity <= product.reorderLevel
	).length;

	$: totalCategories = new Set(
		activeProducts
			.map((product) => product.categoryName)
			.filter(Boolean)
	).size;
</script>

<svelte:head>
	<title>Mlera Stores | Admin Dashboard</title>

	<meta
		name="description"
		content="Mlera Stores inventory administration dashboard."
	/>
</svelte:head>

<div class="min-h-screen bg-zinc-100 text-zinc-900">
	<!-- HEADER -->
	<header class="border-b border-zinc-800 bg-black text-white">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
			<div>
				<p class="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
					Mlera Stores
				</p>

				<h1 class="mt-1 text-2xl font-black">
					Admin Dashboard
				</h1>
			</div>

			<a
				href="/shop"
				class="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:border-red-500/50 hover:bg-white/10"
			>
				<ArrowLeft size={17} />
				Back to Shop
			</a>
		</div>
	</header>

	<!-- MAIN -->
	<main class="mx-auto max-w-7xl px-6 py-10">
		<!-- PAGE INTRO -->
		<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
			<div>
				<p class="text-sm font-bold uppercase tracking-wider text-red-600">
					Inventory Management
				</p>

				<h2 class="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
					Store Overview
				</h2>

				<p class="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
					Manage products, inventory, categories and product images
					from one place.
				</p>
			</div>

			<a
				href="/admin/products/new"
				class="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500"
			>
				<Plus size={18} />
				Add Product
			</a>
		</div>

		<!-- STAT CARDS -->
		<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<!-- PRODUCTS -->
			<div class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
				<div class="flex items-center justify-between">
					<div class="rounded-xl bg-red-50 p-3 text-red-600">
						<Package size={22} />
					</div>

					<span class="text-xs font-bold uppercase tracking-wider text-zinc-400">
						Products
					</span>
				</div>

				<p class="mt-5 text-3xl font-black">
					{loading ? '—' : totalProducts}
				</p>

				<p class="mt-1 text-sm text-zinc-500">
					Total products
				</p>
			</div>

			<!-- INVENTORY -->
			<div class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
				<div class="flex items-center justify-between">
					<div class="rounded-xl bg-zinc-100 p-3 text-zinc-700">
						<Boxes size={22} />
					</div>

					<span class="text-xs font-bold uppercase tracking-wider text-zinc-400">
						Inventory
					</span>
				</div>

				<p class="mt-5 text-3xl font-black">
					{loading ? '—' : totalUnits}
				</p>

				<p class="mt-1 text-sm text-zinc-500">
					Units in stock
				</p>
			</div>

			<!-- LOW STOCK -->
			<div class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
				<div class="flex items-center justify-between">
					<div class="rounded-xl bg-amber-50 p-3 text-amber-600">
						<AlertTriangle size={22} />
					</div>

					<span class="text-xs font-bold uppercase tracking-wider text-zinc-400">
						Attention
					</span>
				</div>

				<p class="mt-5 text-3xl font-black">
					{loading ? '—' : lowStockProducts}
				</p>

				<p class="mt-1 text-sm text-zinc-500">
					Low-stock products
				</p>
			</div>

			<!-- CATEGORIES -->
			<div class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
				<div class="flex items-center justify-between">
					<div class="rounded-xl bg-zinc-100 p-3 text-zinc-700">
						<Tags size={22} />
					</div>

					<span class="text-xs font-bold uppercase tracking-wider text-zinc-400">
						Catalogue
					</span>
				</div>

				<p class="mt-5 text-3xl font-black">
					{loading ? '—' : totalCategories}
				</p>

				<p class="mt-1 text-sm text-zinc-500">
					Categories
				</p>
			</div>
		</div>

		<!-- ERROR -->
		{#if error}
			<div
				class="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700"
			>
				{error}
			</div>
		{/if}

		<!-- MANAGEMENT CARDS -->
		<section class="mt-10">
			<div class="flex items-end justify-between gap-4">
				<div>
					<p class="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
						Admin Tools
					</p>

					<h3 class="mt-1 text-xl font-black">
						Management
					</h3>
				</div>
			</div>

			<div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<!-- PRODUCTS -->
				<a
					href="/admin/products"
					class="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
				>
					<div
						class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white"
					>
						<Package size={28} />
					</div>

					<h4 class="mt-5 text-lg font-black">
						Products
					</h4>

					<p class="mt-2 text-sm leading-6 text-zinc-500">
						Add, edit and manage products in the store catalogue.
					</p>

					<div
						class="mt-5 text-xs font-bold uppercase tracking-wider text-red-600"
					>
						Manage Products →
					</div>
				</a>

				<!-- INVENTORY -->
				<a
					href="/admin/inventory"
					class="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
				>
					<div
						class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white"
					>
						<Boxes size={28} />
					</div>

					<h4 class="mt-5 text-lg font-black">
						Inventory
					</h4>

					<p class="mt-2 text-sm leading-6 text-zinc-500">
						Monitor stock levels and identify products that need
						reordering.
					</p>

					<div
						class="mt-5 text-xs font-bold uppercase tracking-wider text-red-600"
					>
						Manage Inventory →
					</div>
				</a>

				<!-- CATEGORIES -->
				<a
					href="/admin/categories"
					class="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
				>
					<div
						class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white"
					>
						<Tags size={28} />
					</div>

					<h4 class="mt-5 text-lg font-black">
						Categories
					</h4>

					<p class="mt-2 text-sm leading-6 text-zinc-500">
						Organise products into categories used by the customer
						shop.
					</p>

					<div
						class="mt-5 text-xs font-bold uppercase tracking-wider text-red-600"
					>
						Manage Categories →
					</div>
				</a>

				<!-- REPORTS -->
				<a
					href="/admin/reports"
					class="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
				>
					<div
						class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white"
					>
						<FileText size={28} />
					</div>

					<h4 class="mt-5 text-lg font-black">
						Reports
					</h4>

					<p class="mt-2 text-sm leading-6 text-zinc-500">
						View inventory reports, stock values, category
						performance and products requiring attention.
					</p>

					<div
						class="mt-5 text-xs font-bold uppercase tracking-wider text-red-600"
					>
						View Reports →
					</div>
				</a>
			</div>
		</section>
	</main>
</div>