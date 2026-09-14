<script lang="ts">
	import { onMount } from 'svelte';
	import {
		AlertTriangle,
		Boxes,
		Download,
		FileText,
		Package,
		Printer,
		RefreshCw,
		Search,
		ShoppingBag,
		TrendingUp,
		X
	} from 'lucide-svelte';

	type Summary = {
		totalProducts: number;
		totalStockUnits: number;
		inventoryCostValue: number;
		potentialSalesValue: number;
		lowStockCount: number;
		outOfStockCount: number;
	};

	type CategoryReport = {
		categoryId: string | null;
		categoryName: string;
		productCount: number;
		stockUnits: number;
		inventoryValue: number;
		potentialSalesValue: number;
	};

	type ProductReport = {
		id: string;
		sku: string;
		name: string;
		categoryName: string;
		costPrice: number;
		sellingPrice: number;
		stockQuantity: number;
		reorderLevel: number;
		stockValue: number;
		potentialSalesValue: number;
		status: string;
	};

	let summary: Summary = {
		totalProducts: 0,
		totalStockUnits: 0,
		inventoryCostValue: 0,
		potentialSalesValue: 0,
		lowStockCount: 0,
		outOfStockCount: 0
	};

	let categories: CategoryReport[] = [];
	let products: ProductReport[] = [];

	let loading = true;
	let error = '';

	let searchTerm = '';
	let selectedCategory = 'All Categories';
	let selectedStatus = 'All Statuses';

	$: attentionCount = summary.lowStockCount + summary.outOfStockCount;

	$: filteredProducts = products.filter((product) => {
		const search = searchTerm.trim().toLowerCase();

		const matchesSearch =
			!search ||
			product.name.toLowerCase().includes(search) ||
			product.sku.toLowerCase().includes(search) ||
			product.categoryName.toLowerCase().includes(search);

		const matchesCategory =
			selectedCategory === 'All Categories' ||
			product.categoryName === selectedCategory;

		const normalizedStatus = product.status.toLowerCase();

		const matchesStatus =
			selectedStatus === 'All Statuses' ||
			(selectedStatus === 'In Stock' && normalizedStatus === 'in stock') ||
			(selectedStatus === 'Low Stock' && normalizedStatus === 'low stock') ||
			(selectedStatus === 'Out of Stock' && normalizedStatus === 'out of stock');

		return matchesSearch && matchesCategory && matchesStatus;
	});

	$: categoryOptions = [
		'All Categories',
		...Array.from(new Set(products.map((product) => product.categoryName))).filter(Boolean)
	];

	function formatMoney(value: number | null | undefined) {
		return `MK ${Number(value ?? 0).toLocaleString('en-MW', {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		})}`;
	}

	function formatNumber(value: number | null | undefined) {
		return Number(value ?? 0).toLocaleString('en-US');
	}

	function getStatusClass(status: string) {
		switch (status.toLowerCase()) {
			case 'out of stock':
				return 'border-red-200 bg-red-50 text-red-700';

			case 'low stock':
				return 'border-amber-200 bg-amber-50 text-amber-700';

			default:
				return 'border-emerald-200 bg-emerald-50 text-emerald-700';
		}
	}

	function getStatusDot(status: string) {
		switch (status.toLowerCase()) {
			case 'out of stock':
				return 'bg-red-500';

			case 'low stock':
				return 'bg-amber-500';

			default:
				return 'bg-emerald-500';
		}
	}

	function clearFilters() {
		searchTerm = '';
		selectedCategory = 'All Categories';
		selectedStatus = 'All Statuses';
	}

	async function loadReport() {
		loading = true;
		error = '';

		try {
			const response = await fetch('/api/reports/inventory');

			if (!response.ok) {
				throw new Error(`Failed to load inventory report (${response.status})`);
			}

			const data = await response.json();

			summary = {
				totalProducts: Number(data.summary?.totalProducts ?? 0),
				totalStockUnits: Number(data.summary?.totalStockUnits ?? 0),
				inventoryCostValue: Number(data.summary?.inventoryCostValue ?? 0),
				potentialSalesValue: Number(data.summary?.potentialSalesValue ?? 0),
				lowStockCount: Number(data.summary?.lowStockCount ?? 0),
				outOfStockCount: Number(data.summary?.outOfStockCount ?? 0)
			};

			categories = data.categories ?? [];
			products = data.products ?? [];
		} catch (err) {
			console.error(err);
			error = err instanceof Error ? err.message : 'Unable to load inventory report.';
		} finally {
			loading = false;
		}
	}

	function printReport() {
		window.print();
	}

	function exportCsv() {
		const headers = [
			'Product',
			'SKU',
			'Category',
			'Stock',
			'Reorder Level',
			'Cost Price',
			'Selling Price',
			'Stock Value',
			'Potential Sales',
			'Status'
		];

		const rows = filteredProducts.map((product) => [
			product.name,
			product.sku,
			product.categoryName,
			product.stockQuantity,
			product.reorderLevel,
			product.costPrice,
			product.sellingPrice,
			product.stockValue,
			product.potentialSalesValue,
			product.status
		]);

		const csv = [headers, ...rows]
			.map((row) =>
				row
					.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
					.join(',')
			)
			.join('\n');

		const blob = new Blob([csv], {
			type: 'text/csv;charset=utf-8;'
		});

		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');

		link.href = url;
		link.download = `mlera-inventory-report-${new Date().toISOString().slice(0, 10)}.csv`;

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		URL.revokeObjectURL(url);
	}

	onMount(() => {
		loadReport();
	});
</script>

<svelte:head>
	<title>Inventory Reports | Mlera Stores</title>
	<meta
		name="description"
		content="Inventory reports, stock levels and inventory value for Mlera Stores."
	/>
</svelte:head>

<div class="min-h-screen bg-black text-white">
	<!-- TOP BAR -->
	<header
		class="sticky top-0 z-50 border-b border-zinc-800 bg-black text-white shadow-xl print:hidden"
	>
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
			<div class="flex items-center gap-3">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-600/10"
				>
					<ShoppingBag size={20} class="text-red-500" />
				</div>

				<div>
					<p class="text-sm font-black tracking-wide">MLERA STORES</p>
					<p class="text-[11px] font-medium text-zinc-500">Inventory Management</p>
				</div>
			</div>

			<div class="hidden items-center gap-2 sm:flex">
				<a
					href="/admin"
					class="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
				>
					Admin Dashboard
				</a>

				<a
					href="/shop"
					class="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm font-semibold text-white transition hover:border-zinc-700 hover:bg-zinc-800"
				>
					View Shop
				</a>
			</div>
		</div>
	</header>

	<!-- PAGE -->
	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
		<!-- HERO -->
		<section class="mb-8">
			<div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<div
						class="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500"
					>
						<a href="/admin" class="transition hover:text-white">Admin</a>
						<span>/</span>
						<span class="text-red-500">Reports</span>
					</div>

					<div class="max-w-3xl">
						<h1 class="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
							Inventory <span class="text-red-500">Reports.</span>
						</h1>

						<p class="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
							Monitor inventory levels, stock value, product performance and items requiring
							attention from one central report.
						</p>
					</div>
				</div>

				<div class="flex flex-wrap gap-2 print:hidden">
					<button
						on:click={exportCsv}
						class="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
					>
						<Download size={16} />
						Export CSV
					</button>

					<button
						on:click={printReport}
						class="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-950/30 transition hover:bg-red-500"
					>
						<Printer size={16} />
						Print Report
					</button>
				</div>
			</div>

			<!-- HERO SUMMARY -->
			<div class="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
				<div class="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
					<div class="flex items-center justify-between">
						<span class="text-xs font-semibold uppercase tracking-wider text-zinc-500">
							Products
						</span>

						<Package size={16} class="text-zinc-500" />
					</div>

					<p class="mt-2 text-2xl font-black">
						{formatNumber(summary.totalProducts)}
					</p>
				</div>

				<div class="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
					<div class="flex items-center justify-between">
						<span class="text-xs font-semibold uppercase tracking-wider text-zinc-500">
							Units
						</span>

						<Boxes size={16} class="text-zinc-500" />
					</div>

					<p class="mt-2 text-2xl font-black">
						{formatNumber(summary.totalStockUnits)}
					</p>
				</div>

				<div class="rounded-2xl border border-red-500/20 bg-red-500/[0.07] p-4">
					<div class="flex items-center justify-between">
						<span class="text-xs font-semibold uppercase tracking-wider text-red-400">
							Attention
						</span>

						<AlertTriangle size={16} class="text-red-400" />
					</div>

					<p class="mt-2 text-2xl font-black text-red-400">
						{formatNumber(attentionCount)}
					</p>
				</div>
			</div>
		</section>

		<!-- ERROR -->
		{#if error}
			<div
				class="mb-8 flex flex-col gap-4 rounded-2xl border border-red-200 bg-white p-5 shadow-xl shadow-black/10 sm:flex-row sm:items-center sm:justify-between"
			>
				<div class="flex items-start gap-3">
					<div class="mt-0.5 rounded-lg bg-red-50 p-2">
						<AlertTriangle size={18} class="text-red-600" />
					</div>

					<div>
						<p class="font-semibold text-zinc-950">Unable to load report</p>
						<p class="mt-1 text-sm text-zinc-500">{error}</p>
					</div>
				</div>

				<button
					on:click={loadReport}
					class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-500"
				>
					<RefreshCw size={15} />
					Try Again
				</button>
			</div>
		{/if}

		{#if loading}
			<!-- LOADING -->
			<div class="space-y-8">
				<div>
					<div class="mb-4 h-6 w-48 animate-pulse rounded bg-white/10"></div>

					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{#each Array(4) as _}
							<div class="h-36 animate-pulse rounded-2xl bg-white/90"></div>
						{/each}
					</div>
				</div>

				<div class="h-72 animate-pulse rounded-2xl bg-white/90"></div>

				<div class="h-96 animate-pulse rounded-2xl bg-white/90"></div>
			</div>
		{:else}
			<!-- REPORT OVERVIEW -->
			<section class="mb-8">
				<div class="mb-4 flex items-end justify-between gap-4">
					<div>
						<p class="text-xs font-bold uppercase tracking-[0.18em] text-red-500">
							Report Overview
						</p>

						<h2 class="mt-1 text-xl font-black tracking-tight text-white sm:text-2xl">
							Inventory at a glance
						</h2>
					</div>
				</div>

				<!-- KPI CARDS -->
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<!-- PRODUCTS -->
					<div
						class="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 text-zinc-950 shadow-2xl shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-black/30"
					>
						<div class="flex items-start justify-between">
							<div
								class="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100"
							>
								<Package size={20} class="text-zinc-700" />
							</div>

							<span class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
								Products
							</span>
						</div>

						<div class="mt-6">
							<p class="text-3xl font-black tracking-tight text-zinc-950">
								{formatNumber(summary.totalProducts)}
							</p>

							<p class="mt-1 text-xs font-medium text-zinc-500">
								Active products
							</p>
						</div>

						<div
							class="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-zinc-100 transition group-hover:bg-zinc-200"
						></div>
					</div>

					<!-- UNITS -->
					<div
						class="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 text-zinc-950 shadow-2xl shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-black/30"
					>
						<div class="flex items-start justify-between">
							<div
								class="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100 bg-blue-50"
							>
								<Boxes size={20} class="text-blue-600" />
							</div>

							<span class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
								Units
							</span>
						</div>

						<div class="mt-6">
							<p class="text-3xl font-black tracking-tight text-zinc-950">
								{formatNumber(summary.totalStockUnits)}
							</p>

							<p class="mt-1 text-xs font-medium text-zinc-500">
								Units available
							</p>
						</div>

						<div
							class="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-50 transition group-hover:bg-blue-100"
						></div>
					</div>

					<!-- COST VALUE -->
					<div
						class="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 text-zinc-950 shadow-2xl shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-black/30"
					>
						<div class="flex items-start justify-between">
							<div
								class="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-100 bg-amber-50"
							>
								<FileText size={20} class="text-amber-600" />
							</div>

							<span class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
								Cost
							</span>
						</div>

						<div class="mt-6">
							<p class="text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl">
								{formatMoney(summary.inventoryCostValue)}
							</p>

							<p class="mt-1 text-xs font-medium text-zinc-500">
								Inventory cost value
							</p>
						</div>

						<div
							class="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-amber-50 transition group-hover:bg-amber-100"
						></div>
					</div>

					<!-- SALES POTENTIAL -->
					<div
						class="group relative overflow-hidden rounded-2xl border border-red-100 bg-white p-5 text-zinc-950 shadow-2xl shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-black/30"
					>
						<div class="flex items-start justify-between">
							<div
								class="flex h-11 w-11 items-center justify-center rounded-xl border border-red-100 bg-red-50"
							>
								<TrendingUp size={20} class="text-red-600" />
							</div>

							<span class="text-[10px] font-bold uppercase tracking-widest text-red-500">
								Potential
							</span>
						</div>

						<div class="mt-6">
							<p class="text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl">
								{formatMoney(summary.potentialSalesValue)}
							</p>

							<p class="mt-1 text-xs font-medium text-zinc-500">
								Potential sales value
							</p>
						</div>

						<div
							class="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-red-50 transition group-hover:bg-red-100"
						></div>
					</div>
				</div>

				<!-- ATTENTION CARDS -->
				<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div
						class="flex items-center justify-between rounded-2xl border border-amber-200 bg-white p-5 shadow-xl shadow-black/10"
					>
						<div class="flex items-center gap-4">
							<div
								class="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-100 bg-amber-50"
							>
								<AlertTriangle size={19} class="text-amber-600" />
							</div>

							<div>
								<p class="text-sm font-bold text-zinc-950">Low stock items</p>

								<p class="mt-0.5 text-xs text-zinc-500">
									Products below reorder level
								</p>
							</div>
						</div>

						<p class="text-2xl font-black text-amber-600">
							{formatNumber(summary.lowStockCount)}
						</p>
					</div>

					<div
						class="flex items-center justify-between rounded-2xl border border-red-200 bg-white p-5 shadow-xl shadow-black/10"
					>
						<div class="flex items-center gap-4">
							<div
								class="flex h-11 w-11 items-center justify-center rounded-xl border border-red-100 bg-red-50"
							>
								<X size={19} class="text-red-600" />
							</div>

							<div>
								<p class="text-sm font-bold text-zinc-950">Out of stock</p>

								<p class="mt-0.5 text-xs text-zinc-500">
									Products currently unavailable
								</p>
							</div>
						</div>

						<p class="text-2xl font-black text-red-600">
							{formatNumber(summary.outOfStockCount)}
						</p>
					</div>
				</div>
			</section>

			<!-- CATEGORY SUMMARY -->
			<section class="mb-8">
				<div class="mb-4">
					<p class="text-xs font-bold uppercase tracking-[0.18em] text-red-500">
						Category Summary
					</p>

					<h2 class="mt-1 text-xl font-black tracking-tight text-white sm:text-2xl">
						Category performance
					</h2>
				</div>

				<div
					class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-black/20"
				>
					<div
						class="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-4"
					>
						<div>
							<p class="text-sm font-bold text-zinc-950">Inventory by category</p>
							<p class="mt-0.5 text-xs text-zinc-500">
								Stock distribution and financial value
							</p>
						</div>

						<Boxes size={18} class="text-zinc-400" />
					</div>

					<div class="overflow-x-auto">
						<table class="w-full min-w-[760px]">
							<thead>
								<tr class="border-b border-zinc-200 bg-zinc-100/80">
									<th
										class="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500"
									>
										Category
									</th>

									<th
										class="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-zinc-500"
									>
										Products
									</th>

									<th
										class="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-zinc-500"
									>
										Units
									</th>

									<th
										class="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-zinc-500"
									>
										Cost Value
									</th>

									<th
										class="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-zinc-500"
									>
										Sales Potential
									</th>
								</tr>
							</thead>

							<tbody class="divide-y divide-zinc-100">
								{#if categories.length === 0}
									<tr>
										<td colspan="5" class="px-5 py-12 text-center text-sm text-zinc-500">
											No category data available.
										</td>
									</tr>
								{:else}
									{#each categories as category}
										<tr class="group transition hover:bg-zinc-50">
											<td class="px-5 py-4">
												<div class="flex items-center gap-3">
													<div
														class="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100"
													>
														<Boxes size={16} class="text-zinc-600" />
													</div>

													<div>
														<p class="font-semibold text-zinc-950">
															{category.categoryName}
														</p>

														<p class="text-[11px] text-zinc-400">
															Category inventory
														</p>
													</div>
												</div>
											</td>

											<td class="px-5 py-4 text-right text-sm font-semibold text-zinc-700">
												{formatNumber(category.productCount)}
											</td>

											<td class="px-5 py-4 text-right text-sm font-semibold text-zinc-700">
												{formatNumber(category.stockUnits)}
											</td>

											<td class="px-5 py-4 text-right text-sm font-semibold text-zinc-700">
												{formatMoney(category.inventoryValue)}
											</td>

											<td class="px-5 py-4 text-right">
												<span class="font-bold text-zinc-950">
													{formatMoney(category.potentialSalesValue)}
												</span>
											</td>
										</tr>
									{/each}
								{/if}
							</tbody>
						</table>
					</div>
				</div>
			</section>

			<!-- STOCK DETAILS -->
			<section class="mb-8">
				<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p class="text-xs font-bold uppercase tracking-[0.18em] text-red-500">
							Stock Details
						</p>

						<h2 class="mt-1 text-xl font-black tracking-tight text-white sm:text-2xl">
							Stock report
						</h2>
					</div>

					<div class="text-xs font-medium text-zinc-500">
						Showing
						<span class="font-bold text-zinc-300">{filteredProducts.length}</span>
						of
						<span class="font-bold text-zinc-300">{products.length}</span>
						products
					</div>
				</div>

				<!-- FILTER PANEL -->
				<div
					class="mb-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xl shadow-black/20"
				>
					<div class="flex flex-col gap-3 lg:flex-row">
						<div class="relative min-w-0 flex-1">
							<Search
								size={17}
								class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
							/>

							<input
								bind:value={searchTerm}
								type="search"
								placeholder="Search products, SKU or category..."
								class="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
							/>
						</div>

						<select
							bind:value={selectedCategory}
							class="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
						>
							{#each categoryOptions as category}
								<option value={category}>{category}</option>
							{/each}
						</select>

						<select
							bind:value={selectedStatus}
							class="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
						>
							<option value="All Statuses">All Statuses</option>
							<option value="In Stock">In Stock</option>
							<option value="Low Stock">Low Stock</option>
							<option value="Out of Stock">Out of Stock</option>
						</select>

						{#if searchTerm || selectedCategory !== 'All Categories' || selectedStatus !== 'All Statuses'}
							<button
								on:click={clearFilters}
								class="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950"
							>
								<X size={15} />
								Clear
							</button>
						{/if}
					</div>
				</div>

				<!-- STOCK TABLE -->
				<div
					class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-black/20"
				>
					<div
						class="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-4"
					>
						<div>
							<p class="text-sm font-bold text-zinc-950">Product stock levels</p>
							<p class="mt-0.5 text-xs text-zinc-500">
								Current availability and inventory value
							</p>
						</div>

						<Package size={18} class="text-zinc-400" />
					</div>

					<div class="overflow-x-auto">
						<table class="w-full min-w-[1150px]">
							<thead>
								<tr class="border-b border-zinc-200 bg-zinc-100/80">
									<th
										class="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500"
									>
										Product
									</th>

									<th
										class="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500"
									>
										SKU
									</th>

									<th
										class="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500"
									>
										Category
									</th>

									<th
										class="px-4 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-zinc-500"
									>
										Stock
									</th>

									<th
										class="px-4 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-zinc-500"
									>
										Reorder
									</th>

									<th
										class="px-4 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-zinc-500"
									>
										Selling Price
									</th>

									<th
										class="px-4 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-zinc-500"
									>
										Stock Value
									</th>

									<th
										class="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-zinc-500"
									>
										Status
									</th>
								</tr>
							</thead>

							<tbody class="divide-y divide-zinc-100">
								{#if filteredProducts.length === 0}
									<tr>
										<td colspan="8" class="px-5 py-16 text-center">
											<div class="mx-auto flex max-w-sm flex-col items-center">
												<div
													class="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100"
												>
													<Search size={20} class="text-zinc-400" />
												</div>

												<p class="mt-4 font-semibold text-zinc-950">
													No products found
												</p>

												<p class="mt-1 text-sm text-zinc-500">
													Try adjusting your search or filters.
												</p>

												<button
													on:click={clearFilters}
													class="mt-4 text-sm font-semibold text-red-600 transition hover:text-red-500"
												>
													Clear filters
												</button>
											</div>
										</td>
									</tr>
								{:else}
									{#each filteredProducts as product}
										<tr class="group transition hover:bg-zinc-50">
											<!-- PRODUCT -->
											<td class="px-5 py-4">
												<div class="flex items-center gap-3">
													<div
														class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100"
													>
														<Package size={17} class="text-zinc-600" />
													</div>

													<div class="min-w-0">
														<p class="truncate font-semibold text-zinc-950">
															{product.name}
														</p>

														<p class="mt-0.5 text-[11px] text-zinc-400">
															ID: {product.id}
														</p>
													</div>
												</div>
											</td>

											<!-- SKU -->
											<td class="px-4 py-4">
												<span
													class="rounded-lg border border-zinc-200 bg-zinc-100 px-2.5 py-1.5 font-mono text-[11px] font-semibold text-zinc-600"
												>
													{product.sku || '—'}
												</span>
											</td>

											<!-- CATEGORY -->
											<td class="px-4 py-4">
												<span class="text-sm font-medium text-zinc-600">
													{product.categoryName || 'Uncategorised'}
												</span>
											</td>

											<!-- STOCK -->
											<td class="px-4 py-4 text-right">
												<div class="flex flex-col items-end">
													<span class="text-sm font-black text-zinc-950">
														{formatNumber(product.stockQuantity)}
													</span>

													<span class="text-[10px] text-zinc-400">units</span>
												</div>
											</td>

											<!-- REORDER -->
											<td class="px-4 py-4 text-right">
												<span class="text-sm font-semibold text-zinc-500">
													{formatNumber(product.reorderLevel)}
												</span>
											</td>

											<!-- SELLING PRICE -->
											<td class="px-4 py-4 text-right">
												<span class="text-sm font-bold text-zinc-800">
													{formatMoney(product.sellingPrice)}
												</span>
											</td>

											<!-- STOCK VALUE -->
											<td class="px-4 py-4 text-right">
												<span class="text-sm font-bold text-zinc-950">
													{formatMoney(product.stockValue)}
												</span>
											</td>

											<!-- STATUS -->
											<td class="px-5 py-4 text-right">
												<span
													class={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold ${getStatusClass(product.status)}`}
												>
													<span
														class={`h-1.5 w-1.5 rounded-full ${getStatusDot(product.status)}`}
													></span>

													{product.status}
												</span>
											</td>
										</tr>
									{/each}
								{/if}
							</tbody>
						</table>
					</div>
				</div>
			</section>

			<!-- MANAGEMENT CTA -->
			<section class="mb-4">
				<div
					class="relative overflow-hidden rounded-2xl border border-red-200 bg-white p-6 shadow-2xl shadow-black/20 sm:p-8"
				>
					<div
						class="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
					>
						<div>
							<div
								class="mb-3 inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-red-600"
							>
								<Boxes size={13} />
								Inventory Control
							</div>

							<h2 class="text-xl font-black tracking-tight text-zinc-950 sm:text-2xl">
								Keep your inventory accurate.
							</h2>

							<p class="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
								Update product information, stock quantities, pricing and reorder levels
								from the product management area.
							</p>
						</div>

						<a
							href="/admin/products"
							class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/20 transition hover:bg-red-500"
						>
							<Package size={17} />
							Manage Products
						</a>
					</div>

					<div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-50"></div>
					<div class="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-zinc-50"></div>
				</div>
			</section>
		{/if}
	</main>

	<!-- FOOTER -->
	<footer class="border-t border-zinc-900 bg-black py-8 print:hidden">
		<div
			class="mx-auto flex max-w-7xl flex-col gap-2 px-4 text-center text-xs text-zinc-600 sm:px-6 lg:px-8"
		>
			<p class="font-semibold text-zinc-500">MLERA STORES</p>
			<p>Inventory Management &amp; Reporting</p>
		</div>
	</footer>
</div>

<style>
	@media print {
		:global(body) {
			background: white !important;
			color: black !important;
		}

		header,
		footer,
		.print\:hidden {
			display: none !important;
		}

		main {
			max-width: none !important;
			padding: 20px !important;
		}

		section {
			break-inside: avoid;
		}

		table {
			page-break-inside: auto;
		}

		tr {
			page-break-inside: avoid;
			page-break-after: auto;
		}
	}
</style>