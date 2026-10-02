<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Activity,
		AlertTriangle,
		ArrowUpRight,
		Boxes,
		FileText,
		Package,
		Plus,
		Settings2,
		Tags
	} from 'lucide-svelte';

	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
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

	let sidebarCollapsed = false;
	let sidebarMobileOpen = false;

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

	$: outOfStockProducts = activeProducts.filter(
		(product) => product.stockQuantity <= 0
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
	<AdminSidebar
	bind:collapsed={sidebarCollapsed}
	bind:mobileOpen={sidebarMobileOpen}
/>

<div
	class:lg:ml-20={sidebarCollapsed}
	class:lg:ml-64={!sidebarCollapsed}
	class="min-h-screen transition-all duration-300"
>
		<AdminHeader
		pageTitle="Admin Dashboard"
		pageLabel="Mlera Stores"
	/>

		<div class="px-4 pt-4 sm:px-6 lg:hidden">
			<button
				type="button"
				on:click={() => (sidebarMobileOpen = true)}
				class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
			>
				<span class="text-lg leading-none">☰</span>
				Menu
			</button>
		</div>


	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
		<!-- PAGE INTRO -->
		<section>
			<div
				class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
			>
				<div class="min-w-0">
					<div
						class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]"
					>
						<span class="text-zinc-400">Dashboard</span>
						<span class="text-zinc-300">/</span>
						<span class="text-red-600">Overview</span>
					</div>

					<h2
						class="mt-3 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl"
					>
						Store Overview
					</h2>

					<p
						class="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base"
					>
						Monitor your catalogue, stock levels and store operations
						from one central dashboard.
					</p>
				</div>

				<a
					href="/admin/products/new"
					class="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-red-500 hover:shadow-xl hover:shadow-red-600/20 sm:w-auto"
				>
					<Plus size={18} strokeWidth={2.5} />

					<span>Add Product</span>

					<ArrowUpRight
						size={16}
						class="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
					/>
				</a>
			</div>
		</section>

		<!-- KPI CARDS -->
		<section class="mt-8">
			<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<!-- PRODUCTS -->
				<div
					class="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
				>
					<div class="flex items-start justify-between">
						<div
							class="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600"
						>
							<Package size={21} strokeWidth={2.2} />
						</div>

						<span
							class="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-600"
						>
							Catalogue
						</span>
					</div>

					<div class="mt-5">
						<p class="text-3xl font-black tracking-tight text-zinc-950">
							{loading ? '—' : totalProducts}
						</p>

						<p class="mt-1 text-sm font-medium text-zinc-500">
							Active products
						</p>
					</div>

					<a
						href="/admin/products"
						class="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 transition hover:text-red-600"
					>
						View products
						<ArrowUpRight size={14} />
					</a>
				</div>

				<!-- INVENTORY -->
				<div
					class="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
				>
					<div class="flex items-start justify-between">
						<div
							class="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700"
						>
							<Boxes size={21} strokeWidth={2.2} />
						</div>

						<span
							class="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500"
						>
							Stock
						</span>
					</div>

					<div class="mt-5">
						<p class="text-3xl font-black tracking-tight text-zinc-950">
							{loading ? '—' : totalUnits}
						</p>

						<p class="mt-1 text-sm font-medium text-zinc-500">
							Units currently in stock
						</p>
					</div>

					<a
						href="/admin/inventory"
						class="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 transition hover:text-red-600"
					>
						View inventory
						<ArrowUpRight size={14} />
					</a>
				</div>

				<!-- LOW STOCK -->
				<div
					class={`group rounded-2xl border bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
						lowStockProducts > 0
							? 'border-amber-200'
							: 'border-zinc-200'
					}`}
				>
					<div class="flex items-start justify-between">
						<div
							class={`flex h-11 w-11 items-center justify-center rounded-xl ${
								lowStockProducts > 0
									? 'bg-amber-50 text-amber-600'
									: 'bg-zinc-100 text-zinc-600'
							}`}
						>
							<AlertTriangle size={21} strokeWidth={2.2} />
						</div>

						<span
							class={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
								lowStockProducts > 0
									? 'bg-amber-50 text-amber-700'
									: 'bg-emerald-50 text-emerald-700'
							}`}
						>
							{lowStockProducts > 0 ? 'Attention' : 'Healthy'}
						</span>
					</div>

					<div class="mt-5">
						<p class="text-3xl font-black tracking-tight text-zinc-950">
							{loading ? '—' : lowStockProducts}
						</p>

						<p class="mt-1 text-sm font-medium text-zinc-500">
							Products at reorder level
						</p>
					</div>

					<a
						href="/admin/inventory"
						class="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 transition hover:text-red-600"
					>
						Review stock
						<ArrowUpRight size={14} />
					</a>
				</div>

				<!-- CATEGORIES -->
				<div
					class="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
				>
					<div class="flex items-start justify-between">
						<div
							class="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700"
						>
							<Tags size={21} strokeWidth={2.2} />
						</div>

						<span
							class="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500"
						>
							Catalogue
						</span>
					</div>

					<div class="mt-5">
						<p class="text-3xl font-black tracking-tight text-zinc-950">
							{loading ? '—' : totalCategories}
						</p>

						<p class="mt-1 text-sm font-medium text-zinc-500">
							Active categories
						</p>
					</div>

					<a
						href="/admin/categories"
						class="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 transition hover:text-red-600"
					>
						Manage categories
						<ArrowUpRight size={14} />
					</a>
				</div>
			</div>
		</section>

		<!-- INVENTORY HEALTH + QUICK ACTIONS -->
		<section class="mt-8 grid gap-5 lg:grid-cols-3">
			<!-- INVENTORY HEALTH -->
			<div
				class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-2"
			>
				<div
					class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
				>
					<div>
						<div class="flex items-center gap-2">
							<div
								class="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700"
							>
								<Activity size={18} />
							</div>

							<h3 class="text-base font-black text-zinc-950">
								Inventory Health
							</h3>
						</div>

						<p class="mt-2 text-sm text-zinc-500">
							A quick view of products requiring attention.
						</p>
					</div>

					<a
						href="/admin/inventory"
						class="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-500"
					>
						Open inventory
						<ArrowUpRight size={14} />
					</a>
				</div>

				<div class="mt-6 grid gap-3 sm:grid-cols-2">
					<!-- LOW STOCK -->
					<div
						class="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/60 p-4"
					>
						<div class="flex items-center gap-3">
							<div
								class="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700"
							>
								<AlertTriangle size={17} />
							</div>

							<div>
								<p class="text-sm font-bold text-zinc-900">
									Low Stock
								</p>

								<p class="mt-0.5 text-xs text-zinc-500">
									At or below reorder level
								</p>
							</div>
						</div>

						<span class="text-xl font-black text-amber-700">
							{loading ? '—' : lowStockProducts}
						</span>
					</div>

					<!-- OUT OF STOCK -->
					<div
						class="flex items-center justify-between rounded-xl border border-red-100 bg-red-50/60 p-4"
					>
						<div class="flex items-center gap-3">
							<div
								class="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-700"
							>
								<Package size={17} />
							</div>

							<div>
								<p class="text-sm font-bold text-zinc-900">
									Out of Stock
								</p>

								<p class="mt-0.5 text-xs text-zinc-500">
									Products with zero units
								</p>
							</div>
						</div>

						<span class="text-xl font-black text-red-700">
							{loading ? '—' : outOfStockProducts}
						</span>
					</div>
				</div>
			</div>

			<!-- QUICK ACTIONS -->
			<div
				class="rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-white shadow-sm"
			>
				<div class="flex items-center gap-2">
					<div
						class="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600"
					>
						<Settings2 size={18} />
					</div>

					<h3 class="text-base font-black">
						Quick Actions
					</h3>
				</div>

				<p class="mt-2 text-sm leading-6 text-zinc-400">
					Common tasks for managing your store.
				</p>

				<div class="mt-5 space-y-2">
					<a
						href="/admin/products/new"
						class="group flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-3 transition hover:border-red-600 hover:bg-zinc-800"
					>
						<span class="flex items-center gap-3">
							<Plus size={17} class="text-red-500" />

							<span class="text-sm font-semibold">
								Add Product
							</span>
						</span>

						<ArrowUpRight
							size={15}
							class="text-zinc-600 transition group-hover:text-red-500"
						/>
					</a>

					<a
						href="/admin/inventory"
						class="group flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-3 transition hover:border-red-600 hover:bg-zinc-800"
					>
						<span class="flex items-center gap-3">
							<Boxes size={17} class="text-red-500" />

							<span class="text-sm font-semibold">
								Check Inventory
							</span>
						</span>

						<ArrowUpRight
							size={15}
							class="text-zinc-600 transition group-hover:text-red-500"
						/>
					</a>

					<a
						href="/admin/reports"
						class="group flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-3 transition hover:border-red-600 hover:bg-zinc-800"
					>
						<span class="flex items-center gap-3">
							<FileText size={17} class="text-red-500" />

							<span class="text-sm font-semibold">
								View Reports
							</span>
						</span>

						<ArrowUpRight
							size={15}
							class="text-zinc-600 transition group-hover:text-red-500"
						/>
					</a>
				</div>
			</div>
		</section>

		<!-- MANAGEMENT -->
		<section class="mt-10">
			<div
				class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
			>
				<div>
					<p
						class="text-[11px] font-black uppercase tracking-[0.2em] text-red-600"
					>
						Administration
					</p>

					<h3
						class="mt-1.5 text-2xl font-black tracking-tight text-zinc-950"
					>
						Management
					</h3>

					<p class="mt-1 text-sm text-zinc-500">
						Manage the core areas of your Mlera Stores operation.
					</p>
				</div>
			</div>

			<div class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<!-- PRODUCTS -->
				<a
					href="/admin/products"
					class="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
				>
					<div class="flex items-start justify-between">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white"
						>
							<Package size={25} />
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
						Add, edit and maintain products in the store catalogue.
					</p>

					<div
						class="mt-5 text-xs font-black uppercase tracking-wider text-red-600"
					>
						Manage Products →
					</div>

					<div
						class="absolute bottom-0 left-0 h-1 w-0 bg-red-600 transition-all duration-300 group-hover:w-full"
					></div>
				</a>

				<!-- INVENTORY -->
				<a
					href="/admin/inventory"
					class="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
				>
					<div class="flex items-start justify-between">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 transition group-hover:bg-zinc-900 group-hover:text-white"
						>
							<Boxes size={25} />
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
						Monitor stock levels and keep inventory quantities up to date.
					</p>

					<div
						class="mt-5 text-xs font-black uppercase tracking-wider text-red-600"
					>
						Manage Inventory →
					</div>

					<div
						class="absolute bottom-0 left-0 h-1 w-0 bg-red-600 transition-all duration-300 group-hover:w-full"
					></div>
				</a>

				<!-- CATEGORIES -->
				<a
					href="/admin/categories"
					class="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
				>
					<div class="flex items-start justify-between">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 transition group-hover:bg-zinc-900 group-hover:text-white"
						>
							<Tags size={25} />
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
						Organise products into categories used throughout the shop.
					</p>

					<div
						class="mt-5 text-xs font-black uppercase tracking-wider text-red-600"
					>
						Manage Categories →
					</div>

					<div
						class="absolute bottom-0 left-0 h-1 w-0 bg-red-600 transition-all duration-300 group-hover:w-full"
					></div>
				</a>

				<!-- REPORTS -->
				<a
					href="/admin/reports"
					class="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
				>
					<div class="flex items-start justify-between">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 transition group-hover:bg-zinc-900 group-hover:text-white"
						>
							<FileText size={25} />
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
						Review stock values, inventory summaries and product activity.
					</p>

					<div
						class="mt-5 text-xs font-black uppercase tracking-wider text-red-600"
					>
						View Reports →
					</div>

					<div
						class="absolute bottom-0 left-0 h-1 w-0 bg-red-600 transition-all duration-300 group-hover:w-full"
					></div>
				</a>
			</div>
		</section>

		<!-- ERROR -->
		{#if error}
			<div
				class="mt-8 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700"
			>
				<AlertTriangle
					size={19}
					class="mt-0.5 shrink-0"
				/>

				<div>
					<p class="font-bold">
						Unable to load dashboard statistics
					</p>

					<p class="mt-0.5 text-red-600/80">
						{error}
					</p>
				</div>
			</div>
		{/if}
	</main>

	<AdminFooter />
	</div>
</div>