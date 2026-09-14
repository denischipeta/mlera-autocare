
<script lang="ts">
	import {
		Boxes,
		Search,
		Package,
		AlertTriangle,
		XCircle,
		CheckCircle2,
		RefreshCw,
		ArrowLeft,
		Plus,
		X
	} from 'lucide-svelte';

	type Product = {
		id: number;
		sku: string;
		name: string;
		categoryId: number | null;
		categoryName: string | null;
		description: string | null;
		costPrice: number;
		sellingPrice: number;
		stockQuantity: number;
		reorderLevel: number;
		imageUrl: string | null;
		active: boolean;
		createdAt: string;
		updatedAt: string;
	};

	let products: Product[] = [];
	let loading = true;
	let refreshing = false;
	let error = '';

	let searchTerm = '';
	let categoryFilter = 'all';
	let statusFilter = 'all';

	function normalize(value: string | null | undefined) {
		return String(value ?? '').trim().toLowerCase();
	}

	function formatPrice(value: number) {
		return new Intl.NumberFormat('en-MW', {
			style: 'currency',
			currency: 'MWK',
			maximumFractionDigits: 0
		}).format(Number(value) || 0);
	}

	function getStatus(product: Product) {
		if (product.stockQuantity <= 0) {
			return 'Out of Stock';
		}

		if (product.stockQuantity <= product.reorderLevel) {
			return 'Low Stock';
		}

		return 'In Stock';
	}

	function getStatusClasses(status: string) {
		if (status === 'Out of Stock') {
			return 'border-red-200 bg-red-50 text-red-700';
		}

		if (status === 'Low Stock') {
			return 'border-amber-200 bg-amber-50 text-amber-700';
		}

		return 'border-emerald-200 bg-emerald-50 text-emerald-700';
	}

	function getStatusIcon(status: string) {
		if (status === 'Out of Stock') {
			return XCircle;
		}

		if (status === 'Low Stock') {
			return AlertTriangle;
		}

		return CheckCircle2;
	}

	async function loadProducts() {
		error = '';

		try {
			const response = await fetch('/api/products');

			if (!response.ok) {
				throw new Error(`Failed to load products (${response.status})`);
			}

			const data = await response.json();

			if (Array.isArray(data)) {
				products = data;
			} else if (Array.isArray(data.products)) {
				products = data.products;
			} else {
				throw new Error('Unexpected response from products API');
			}
		} catch (err) {
			console.error('Failed to load inventory:', err);
			error = err instanceof Error ? err.message : 'Failed to load inventory.';
			products = [];
		} finally {
			loading = false;
			refreshing = false;
		}
	}

	async function refreshInventory() {
		refreshing = true;
		await loadProducts();
	}

	function clearSearch() {
		searchTerm = '';
	}

	$: activeProducts = products.filter((product) => product.active);

	$: categories = Array.from(
		new Set(
			activeProducts
				.map((product) => product.categoryName)
				.filter((category): category is string => Boolean(category))
		)
	).sort((a, b) => a.localeCompare(b));

	/*
	 * Search + category + status filtering.
	 *
	 * Search checks:
	 * - Product name
	 * - SKU
	 * - Category
	 * - Description
	 */
	$: filteredProducts = activeProducts.filter((product) => {
		const search = normalize(searchTerm);

		const matchesSearch =
			!search ||
			normalize(product.name).includes(search) ||
			normalize(product.sku).includes(search) ||
			normalize(product.categoryName).includes(search) ||
			normalize(product.description).includes(search);

		const matchesCategory =
			categoryFilter === 'all' ||
			normalize(product.categoryName) === normalize(categoryFilter);

		const matchesStatus =
			statusFilter === 'all' ||
			getStatus(product) === statusFilter;

		return matchesSearch && matchesCategory && matchesStatus;
	});

	$: totalUnits = activeProducts.reduce(
		(total, product) => total + Number(product.stockQuantity || 0),
		0
	);

	$: lowStockCount = activeProducts.filter(
		(product) =>
			product.stockQuantity > 0 &&
			product.stockQuantity <= product.reorderLevel
	).length;

	$: outOfStockCount = activeProducts.filter(
		(product) => product.stockQuantity <= 0
	).length;

	$: inventoryValue = activeProducts.reduce(
		(total, product) =>
			total + Number(product.costPrice || 0) * Number(product.stockQuantity || 0),
		0
	);

	loadProducts();
</script>

<svelte:head>
	<title>Inventory | Mlera Stores</title>
	<meta
		name="description"
		content="Mlera Stores inventory management and stock overview."
	/>
</svelte:head>

<div class="min-h-screen bg-black text-white">

	<!-- HEADER -->
	<header class="sticky top-0 z-50 border-b border-zinc-800 bg-black text-white shadow-xl">
		<div
			class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
		>
			<div class="flex min-w-0 items-center gap-3">
				<a
					href="/admin"
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 transition hover:border-red-500 hover:bg-zinc-800"
					aria-label="Back to admin dashboard"
				>
					<ArrowLeft size={18} />
				</a>

				<div class="min-w-0">
					<div class="flex items-center gap-2">
						<Boxes size={20} class="shrink-0 text-red-500" />
						<h1 class="truncate text-lg font-black tracking-tight sm:text-xl">
							Inventory
						</h1>
					</div>

					<p class="mt-0.5 hidden text-xs text-zinc-500 sm:block">
						Mlera Stores · Stock Management
					</p>
				</div>
			</div>

			<button
				type="button"
				on:click={refreshInventory}
				disabled={refreshing}
				class="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-bold text-white transition hover:border-red-500 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
			>
				<RefreshCw size={16} class={refreshing ? 'animate-spin' : ''} />
				<span class="hidden sm:inline">Refresh</span>
			</button>
		</div>
	</header>

	<!-- MAIN -->
	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

		<!-- PAGE INTRO -->
		<section class="mb-8">
			<div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<p class="mb-2 text-xs font-black uppercase tracking-[0.2em] text-red-500">
						Store Management
					</p>

					<h2 class="text-3xl font-black tracking-tight sm:text-4xl">
						Inventory Overview
					</h2>

					<p class="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
						Monitor product quantities, stock levels, inventory value and
						reorder requirements from one place.
					</p>
				</div>

				<a
					href="/admin/products"
					class="inline-flex w-fit items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-black text-white transition hover:bg-red-700"
				>
					<Package size={17} />
					Manage Products
				</a>
			</div>
		</section>

		<!-- ERROR -->
		{#if error}
			<section
				class="mb-8 rounded-2xl border border-red-900/60 bg-red-950/30 p-5 shadow-xl"
			>
				<div class="flex items-start gap-3">
					<XCircle class="mt-0.5 shrink-0 text-red-500" size={20} />

					<div class="min-w-0 flex-1">
						<h3 class="font-bold text-white">Unable to load inventory</h3>
						<p class="mt-1 text-sm text-red-200">{error}</p>
					</div>

					<button
						type="button"
						on:click={refreshInventory}
						class="rounded-lg border border-red-800 bg-red-950 px-3 py-2 text-xs font-bold text-white hover:bg-red-900"
					>
						Retry
					</button>
				</div>
			</section>
		{/if}

		<!-- KPI CARDS -->
		<section class="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

			<div
				class="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl shadow-black/20"
			>
				<div class="flex items-start justify-between gap-4">
					<div>
						<p class="text-xs font-bold uppercase tracking-wider text-zinc-500">
							Active Products
						</p>

						<p class="mt-3 text-3xl font-black text-white">
							{activeProducts.length}
						</p>
					</div>

					<div
						class="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-zinc-300"
					>
						<Package size={21} />
					</div>
				</div>
			</div>

			<div
				class="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl shadow-black/20"
			>
				<div class="flex items-start justify-between gap-4">
					<div>
						<p class="text-xs font-bold uppercase tracking-wider text-zinc-500">
							Total Units
						</p>

						<p class="mt-3 text-3xl font-black text-white">
							{totalUnits.toLocaleString()}
						</p>
					</div>

					<div
						class="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-zinc-300"
					>
						<Boxes size={21} />
					</div>
				</div>
			</div>

			<div
				class="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl shadow-black/20"
			>
				<div class="flex items-start justify-between gap-4">
					<div>
						<p class="text-xs font-bold uppercase tracking-wider text-zinc-500">
							Low Stock
						</p>

						<p class="mt-3 text-3xl font-black text-amber-400">
							{lowStockCount}
						</p>
					</div>

					<div
						class="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400"
					>
						<AlertTriangle size={21} />
					</div>
				</div>
			</div>

			<div
				class="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl shadow-black/20"
			>
				<div class="flex items-start justify-between gap-4">
					<div>
						<p class="text-xs font-bold uppercase tracking-wider text-zinc-500">
							Inventory Value
						</p>

						<p class="mt-3 text-2xl font-black text-white sm:text-3xl">
							{formatPrice(inventoryValue)}
						</p>
					</div>

					<div
						class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400"
					>
						<CheckCircle2 size={21} />
					</div>
				</div>
			</div>

		</section>

		<!-- INVENTORY SECTION -->
		<section
			class="overflow-hidden rounded-2xl border border-zinc-200 bg-white text-zinc-950 shadow-2xl shadow-black/20"
		>
			<!-- SECTION HEADER -->
			<div class="border-b border-zinc-200 p-5 sm:p-6">
				<div
					class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
				>
					<div>
						<h3 class="text-xl font-black tracking-tight">
							Stock Inventory
						</h3>

						<p class="mt-1 text-sm text-zinc-500">
							Showing {filteredProducts.length} of {activeProducts.length}
							active products.
						</p>
					</div>

					{#if outOfStockCount > 0}
						<div
							class="inline-flex w-fit items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700"
						>
							<XCircle size={15} />
							{outOfStockCount} out of stock
						</div>
					{/if}
				</div>

				<!-- FILTERS -->
				<div class="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_180px]">

					<!-- SEARCH -->
					<div class="relative">
						<Search
							size={18}
							class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
						/>

						<input
							id="inventory-search"
							type="search"
							bind:value={searchTerm}
							placeholder="Search by product, SKU, category or description..."
							autocomplete="off"
							class="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-10 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
						/>

						{#if searchTerm}
							<button
								type="button"
								on:click={clearSearch}
								aria-label="Clear search"
								class="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-400 transition hover:bg-zinc-200 hover:text-zinc-700"
							>
								<X size={17} />
							</button>
						{/if}
					</div>

					<!-- CATEGORY -->
					<select
						bind:value={categoryFilter}
						class="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm font-medium text-zinc-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
					>
						<option value="all">All Categories</option>

						{#each categories as category}
							<option value={category}>{category}</option>
						{/each}
					</select>

					<!-- STATUS -->
					<select
						bind:value={statusFilter}
						class="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm font-medium text-zinc-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
					>
						<option value="all">All Statuses</option>
						<option value="In Stock">In Stock</option>
						<option value="Low Stock">Low Stock</option>
						<option value="Out of Stock">Out of Stock</option>
					</select>
				</div>
			</div>

			<!-- LOADING -->
			{#if loading}
				<div class="p-10 text-center">
					<RefreshCw
						size={28}
						class="mx-auto animate-spin text-red-600"
					/>

					<p class="mt-4 text-sm font-semibold text-zinc-600">
						Loading inventory...
					</p>
				</div>

			<!-- EMPTY SEARCH RESULT -->
			{:else if filteredProducts.length === 0}
				<div class="p-10 text-center sm:p-16">
					<div
						class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400"
					>
						<Search size={24} />
					</div>

					<h4 class="mt-4 text-lg font-black text-zinc-900">
						No products found
					</h4>

					<p class="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
						No inventory items match your current search or filter
						selection.
					</p>

					<button
						type="button"
						on:click={() => {
							searchTerm = '';
							categoryFilter = 'all';
							statusFilter = 'all';
						}}
						class="mt-5 inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-bold text-white transition hover:bg-zinc-800"
					>
						<X size={16} />
						Clear Filters
					</button>
				</div>

			<!-- TABLE -->
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full min-w-[900px] text-left">
						<thead class="border-b border-zinc-200 bg-zinc-50">
							<tr>
								<th
									class="px-5 py-4 text-xs font-black uppercase tracking-wider text-zinc-500"
								>
									Product
								</th>

								<th
									class="px-5 py-4 text-xs font-black uppercase tracking-wider text-zinc-500"
								>
									SKU
								</th>

								<th
									class="px-5 py-4 text-xs font-black uppercase tracking-wider text-zinc-500"
								>
									Category
								</th>

								<th
									class="px-5 py-4 text-center text-xs font-black uppercase tracking-wider text-zinc-500"
								>
									Stock
								</th>

								<th
									class="px-5 py-4 text-center text-xs font-black uppercase tracking-wider text-zinc-500"
								>
									Reorder
								</th>

								<th
									class="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-zinc-500"
								>
									Selling Price
								</th>

								<th
									class="px-5 py-4 text-center text-xs font-black uppercase tracking-wider text-zinc-500"
								>
									Status
								</th>
							</tr>
						</thead>

						<tbody class="divide-y divide-zinc-100">
							{#each filteredProducts as product}
								{@const status = getStatus(product)}
								{@const StatusIcon = getStatusIcon(status)}

								<tr class="transition hover:bg-zinc-50">

									<!-- PRODUCT -->
									<td class="px-5 py-4">
										<div class="flex items-center gap-3">
											<div
												class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100"
											>
												{#if product.imageUrl}
													<img
														src={product.imageUrl}
														alt={product.name}
														width="44"
														height="44"
														loading="lazy"
														class="h-11 w-11 object-cover"
													/>
												{:else}
													<Package
														size={19}
														class="text-zinc-400"
													/>
												{/if}
											</div>

											<div class="min-w-0">
												<p class="max-w-[280px] truncate text-sm font-black text-zinc-900">
													{product.name}
												</p>

												{#if product.description}
													<p class="mt-0.5 max-w-[280px] truncate text-xs text-zinc-500">
														{product.description}
													</p>
												{/if}
											</div>
										</div>
									</td>

									<!-- SKU -->
									<td class="px-5 py-4">
										<span class="font-mono text-xs font-bold text-zinc-600">
											{product.sku}
										</span>
									</td>

									<!-- CATEGORY -->
									<td class="px-5 py-4">
										<span class="text-sm font-medium text-zinc-700">
											{product.categoryName || 'Uncategorized'}
										</span>
									</td>

									<!-- STOCK -->
									<td class="px-5 py-4 text-center">
										<span
											class:text-red-700={product.stockQuantity <= 0}
											class:text-amber-700={
												product.stockQuantity > 0 &&
												product.stockQuantity <= product.reorderLevel
											}
											class:text-zinc-900={
												product.stockQuantity > product.reorderLevel
											}
											class="text-base font-black"
										>
											{product.stockQuantity}
										</span>
									</td>

									<!-- REORDER -->
									<td class="px-5 py-4 text-center">
										<span class="text-sm font-semibold text-zinc-500">
											{product.reorderLevel}
										</span>
									</td>

									<!-- PRICE -->
									<td class="px-5 py-4 text-right">
										<span class="text-sm font-black text-zinc-900">
											{formatPrice(product.sellingPrice)}
										</span>
									</td>

									<!-- STATUS -->
									<td class="px-5 py-4 text-center">
										<span
											class={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${getStatusClasses(status)}`}
										>
											<StatusIcon size={13} />
											{status}
										</span>
									</td>

								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}

			<!-- TABLE FOOTER -->
			{#if !loading && filteredProducts.length > 0}
				<div
					class="border-t border-zinc-200 bg-zinc-50 px-5 py-4 sm:px-6"
				>
					<div
						class="flex flex-col gap-2 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between"
					>
						<p>
							Showing
							<span class="font-bold text-zinc-900">
								{filteredProducts.length}
							</span>
							product{filteredProducts.length === 1 ? '' : 's'}
						</p>

						<p>
							Total stock:
							<span class="font-bold text-zinc-900">
								{filteredProducts
									.reduce(
										(total, product) =>
											total + Number(product.stockQuantity || 0),
										0
									)
									.toLocaleString()}
							</span>
							units
						</p>
					</div>
				</div>
			{/if}
		</section>

		<!-- MANAGEMENT CTA -->
		<section class="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
			<div
				class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
			>
				<div>
					<p class="text-xs font-black uppercase tracking-[0.2em] text-red-500">
						Inventory Management
					</p>

					<h3 class="mt-2 text-xl font-black text-white">
						Need to update your catalogue?
					</h3>

					<p class="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
						Add new products, edit product information or manage your
						catalogue from the Products section.
					</p>
				</div>

				<a
					href="/admin/products"
					class="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-black transition hover:bg-zinc-200"
				>
					<Plus size={17} />
					Manage Products
				</a>
			</div>
		</section>

	</main>

	<!-- FOOTER -->
	<footer class="mt-16 border-t border-zinc-800 bg-black">
		<div
			class="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between"
		>
			<div>
				<p class="text-sm font-black text-white">
					Mlera Stores
				</p>

				<p class="mt-1 text-xs text-zinc-500">
					Inventory &amp; Store Management
				</p>
			</div>

			<div class="text-xs text-zinc-500 sm:text-right">
				<p>Part of Mlera AutoCare</p>

				<p class="mt-1">
					&copy; {new Date().getFullYear()} Mlera Stores. All rights reserved.
				</p>
			</div>
		</div>
	</footer>

</div>

