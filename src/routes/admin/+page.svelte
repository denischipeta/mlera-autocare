```svelte
<script lang="ts">

	import { onMount } from 'svelte';
	import {
		Package,
		Boxes,
		Tags,
		AlertTriangle,
		Plus,
		FileText,
		ArrowUpRight,

	} from 'lucide-svelte';

	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
import AdminFooter from '$lib/components/admin/AdminFooter.svelte';

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
	<AdminHeader
	pageTitle="Admin Dashboard"
	pageLabel="Mlera Stores"
/>

	<!-- MAIN -->
	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
		<!-- PAGE INTRO -->
		<div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
			<div>
				<div class="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
					<span>Dashboard</span>
					<span class="text-zinc-300">/</span>
					<span class="text-red-600">Overview</span>
				</div>

				<div class="mt-3">
					<p class="text-sm font-bold uppercase tracking-[0.18em] text-red-600">
						Inventory Management
					</p>

					<h2 class="mt-2 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
						Store Overview
					</h2>

					<p class="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
						Manage products, inventory, categories and product images
						from one central administration dashboard.
					</p>
				</div>
			</div>

			<a
				href="/admin/products/new"
				class="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:-translate-y-0.5 hover:bg-red-500 hover:shadow-xl hover:shadow-red-600/20 sm:w-auto"
			>
				<Plus size={18} strokeWidth={2.5} />
				Add Product
				<ArrowUpRight
					size={16}
					class="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
				/>
			</a>
		</div>


		<!-- STAT CARDS -->
		<div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			<!-- PRODUCTS -->
			<div
				class="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
			>
				<div class="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-red-50"></div>

				<div class="relative flex items-center justify-between">
					<div class="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
						<Package size={22} />
					</div>

					<span class="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-400">
						Products
					</span>
				</div>

				<div class="relative mt-6">
					<p class="text-3xl font-black tracking-tight text-zinc-950">
						{loading ? '—' : totalProducts}
					</p>

					<p class="mt-1.5 text-sm font-medium text-zinc-500">
						Active products
					</p>
				</div>

				<div class="relative mt-5 h-1 overflow-hidden rounded-full bg-zinc-100">
					<div class="h-full w-1/2 rounded-full bg-red-600"></div>
				</div>
			</div>

			<!-- INVENTORY -->
			<div
				class="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
			>
				<div class="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-zinc-100"></div>

				<div class="relative flex items-center justify-between">
					<div class="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
						<Boxes size={22} />
					</div>

					<span class="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-400">
						Inventory
					</span>
				</div>

				<div class="relative mt-6">
					<p class="text-3xl font-black tracking-tight text-zinc-950">
						{loading ? '—' : totalUnits}
					</p>

					<p class="mt-1.5 text-sm font-medium text-zinc-500">
						Units currently in stock
					</p>
				</div>

				<div class="relative mt-5 h-1 overflow-hidden rounded-full bg-zinc-100">
					<div class="h-full w-1/2 rounded-full bg-zinc-700"></div>
				</div>
			</div>

			<!-- LOW STOCK -->
			<div
				class="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
			>
				<div class="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-amber-50"></div>

				<div class="relative flex items-center justify-between">
					<div class="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
						<AlertTriangle size={22} />
					</div>

					<span class="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-400">
						Attention
					</span>
				</div>

				<div class="relative mt-6">
					<p class="text-3xl font-black tracking-tight text-zinc-950">
						{loading ? '—' : lowStockProducts}
					</p>

					<p class="mt-1.5 text-sm font-medium text-zinc-500">
						Products at reorder level
					</p>
				</div>

				<div class="relative mt-5 h-1 overflow-hidden rounded-full bg-zinc-100">
					<div class="h-full w-1/3 rounded-full bg-amber-500"></div>
				</div>
			</div>

			<!-- CATEGORIES -->
			<div
				class="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
			>
				<div class="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-zinc-100"></div>

				<div class="relative flex items-center justify-between">
					<div class="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
						<Tags size={22} />
					</div>

					<span class="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-400">
						Catalogue
					</span>
				</div>

				<div class="relative mt-6">
					<p class="text-3xl font-black tracking-tight text-zinc-950">
						{loading ? '—' : totalCategories}
					</p>

					<p class="mt-1.5 text-sm font-medium text-zinc-500">
						Active categories
					</p>
				</div>

				<div class="relative mt-5 h-1 overflow-hidden rounded-full bg-zinc-100">
					<div class="h-full w-2/5 rounded-full bg-zinc-700"></div>
				</div>
			</div>
		</div>

		<!-- ERROR -->
		{#if error}
			<div
				class="mt-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700"
			>
				<AlertTriangle size={19} />
				<span>{error}</span>
			</div>
		{/if}

		<!-- MANAGEMENT SECTION -->
		<section class="mt-12">
			<div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
				<div>
					<p class="text-xs font-black uppercase tracking-[0.2em] text-red-600">
						Admin Tools
					</p>

					<h3 class="mt-1.5 text-2xl font-black tracking-tight text-zinc-950">
						Management
					</h3>

					<p class="mt-1 text-sm text-zinc-500">
						Access the main areas of your store administration.
					</p>
				</div>

				<div class="hidden text-xs font-semibold text-zinc-400 sm:block">
					Mlera Stores Administration
				</div>
			</div>

			<div class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<!-- PRODUCTS -->
				<a
					href="/admin/products"
					class="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
				>
					<div class="flex items-start justify-between">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 transition duration-200 group-hover:bg-red-600 group-hover:text-white"
						>
							<Package size={27} />
						</div>

						<div
							class="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-100 text-zinc-300 transition group-hover:border-red-100 group-hover:text-red-600"
						>
							<ArrowUpRight size={15} />
						</div>
					</div>

					<h4 class="mt-6 text-lg font-black text-zinc-950">
						Products
					</h4>

					<p class="mt-2 text-sm leading-6 text-zinc-500">
						Add, edit and manage products in the store catalogue.
					</p>

					<div class="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-600">
						Manage Products
						<span class="transition-transform group-hover:translate-x-1">→</span>
					</div>

					<div class="absolute bottom-0 left-0 h-1 w-0 bg-red-600 transition-all duration-300 group-hover:w-full"></div>
				</a>

				<!-- INVENTORY -->
				<a
					href="/admin/inventory"
					class="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
				>
					<div class="flex items-start justify-between">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 transition duration-200 group-hover:bg-red-600 group-hover:text-white"
						>
							<Boxes size={27} />
						</div>

						<div
							class="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-100 text-zinc-300 transition group-hover:border-red-100 group-hover:text-red-600"
						>
							<ArrowUpRight size={15} />
						</div>
					</div>

					<h4 class="mt-6 text-lg font-black text-zinc-950">
						Inventory
					</h4>

					<p class="mt-2 text-sm leading-6 text-zinc-500">
						Monitor stock levels and identify products that need
						reordering.
					</p>

					<div class="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-600">
						Manage Inventory
						<span class="transition-transform group-hover:translate-x-1">→</span>
					</div>

					<div class="absolute bottom-0 left-0 h-1 w-0 bg-red-600 transition-all duration-300 group-hover:w-full"></div>
				</a>

				<!-- CATEGORIES -->
				<a
					href="/admin/categories"
					class="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
				>
					<div class="flex items-start justify-between">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 transition duration-200 group-hover:bg-red-600 group-hover:text-white"
						>
							<Tags size={27} />
						</div>

						<div
							class="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-100 text-zinc-300 transition group-hover:border-red-100 group-hover:text-red-600"
						>
							<ArrowUpRight size={15} />
						</div>
					</div>

					<h4 class="mt-6 text-lg font-black text-zinc-950">
						Categories
					</h4>

					<p class="mt-2 text-sm leading-6 text-zinc-500">
						Organise products into categories used by the customer
						shop.
					</p>

					<div class="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-600">
						Manage Categories
						<span class="transition-transform group-hover:translate-x-1">→</span>
					</div>

					<div class="absolute bottom-0 left-0 h-1 w-0 bg-red-600 transition-all duration-300 group-hover:w-full"></div>
				</a>

				<!-- REPORTS -->
				<a
					href="/admin/reports"
					class="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
				>
					<div class="flex items-start justify-between">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 transition duration-200 group-hover:bg-red-600 group-hover:text-white"
						>
							<FileText size={27} />
						</div>

						<div
							class="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-100 text-zinc-300 transition group-hover:border-red-100 group-hover:text-red-600"
						>
							<ArrowUpRight size={15} />
						</div>
					</div>

					<h4 class="mt-6 text-lg font-black text-zinc-950">
						Reports
					</h4>

					<p class="mt-2 text-sm leading-6 text-zinc-500">
						View inventory reports, stock values, category
						performance and products requiring attention.
					</p>

					<div class="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-600">
						View Reports
						<span class="transition-transform group-hover:translate-x-1">→</span>
					</div>

					<div class="absolute bottom-0 left-0 h-1 w-0 bg-red-600 transition-all duration-300 group-hover:w-full"></div>
				</a>
			</div>
		</section>

		<!-- FOOTER -->
		<AdminFooter />
	</main>
</div>
```