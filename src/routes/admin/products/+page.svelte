<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { ArrowLeft, Plus, Search } from 'lucide-svelte';

	type Category = {
		id: string;
		name: string;
	};

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
	let searchQuery = '';
	let categories: Category[] = [];

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

			products = await productsResponse.json();
			categories = await categoriesResponse.json();
		} catch (err) {
			console.error('Failed to load products:', err);
			error = 'Unable to load products from the database.';
		} finally {
			loading = false;
		}
	});

	$: selectedCategoryId = page.url.searchParams.get('category');

	$: filteredProducts = products.filter((product) => {
		const matchesCategory =
			!selectedCategoryId || product.categoryId === selectedCategoryId;

		const searchableText = [
			product.name,
			product.sku,
			product.categoryName
		]
			.filter(Boolean)
			.join(' ')
			.toLowerCase();

		const matchesSearch = searchableText.includes(
			searchQuery.trim().toLowerCase()
		);

		return matchesCategory && matchesSearch;
	});

	function formatPrice(price: string | null) {
		if (!price) return 'Price not set';

		return `MK ${Number(price).toLocaleString('en-MW')}`;
	}

	function getStockStatus(product: Product) {
		if (product.stockQuantity <= 0) {
			return {
				label: 'Out of Stock',
				className: 'bg-red-100 text-red-700'
			};
		}

		if (product.stockQuantity <= product.reorderLevel) {
			return {
				label: 'Low Stock',
				className: 'bg-amber-100 text-amber-700'
			};
		}

		return {
			label: 'In Stock',
			className: 'bg-emerald-100 text-emerald-700'
		};
	}
</script>

<svelte:head>
	<title>Products | Mlera Stores Admin</title>
</svelte:head>

<div class="min-h-screen bg-zinc-50">
	<!-- HEADER -->
	<header class="bg-black text-white">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
			<div>
				<p class="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
					Mlera Stores
				</p>

				<h1 class="mt-1 text-2xl font-black sm:text-3xl">
					Product Management
				</h1>
			</div>

			<a
				href="/admin"
				class="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10"
			>
				<ArrowLeft size={17} />
				<span class="hidden sm:inline">Dashboard</span>
				<span class="sm:hidden">Back</span>
			</a>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- PAGE INTRO -->
		<div class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
			<div>
				<p class="text-sm font-semibold text-red-600">Inventory</p>
				<h2 class="mt-1 text-2xl font-black tracking-tight text-zinc-900">
					Products
				</h2>
				<p class="mt-2 text-sm text-zinc-500">
					View and manage products currently stored in your database.
				</p>
			</div>

			<a
				href="/admin/products/new"
				class="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700"
			>
				<Plus size={18} />
				Add Product
			</a>
		</div>

		<!-- SEARCH -->
		<div class="mt-8 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
			<div class="relative">
				<Search
					size={19}
					class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
				/>

				<input
					type="search"
					bind:value={searchQuery}
					placeholder="Search products, SKU or category..."
					class="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-red-500 focus:bg-white"
				/>
			</div>
		</div>

		<!-- ERROR -->
		{#if error}
			<div class="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
				{error}
			</div>
		{/if}

		<!-- PRODUCTS -->
		<div class="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
			<div class="border-b border-zinc-200 px-5 py-4">
				<div class="flex items-center justify-between gap-4">
					<div>
						<h3 class="font-bold text-zinc-900">Product Inventory</h3>

						{#if selectedCategoryId}
							<p class="mt-1 text-sm font-semibold text-red-600">
								{categories.find((category) => category.id === selectedCategoryId)?.name ?? 'Category'}
							</p>
						{/if}

						<p class="mt-1 text-xs text-zinc-500">
							{loading ? 'Loading...' : `${filteredProducts.length} products`}
						</p>
					</div>
				</div>
			</div>

			{#if loading}
				<div class="px-5 py-12 text-center text-sm text-zinc-500">
					Loading products from database...
				</div>
			{:else if filteredProducts.length === 0}
				<div class="px-5 py-12 text-center">
					<p class="font-semibold text-zinc-900">No products found</p>
					<p class="mt-1 text-sm text-zinc-500">
						{searchQuery
							? 'Try a different search.'
							: 'There are currently no products in the database.'}
					</p>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full min-w-[900px] text-left">
						<thead class="bg-zinc-50 text-xs font-bold uppercase tracking-wide text-zinc-500">
							<tr>
								<th class="px-5 py-4">Product</th>
								<th class="px-5 py-4">Category</th>
								<th class="px-5 py-4">Price</th>
								<th class="px-5 py-4">Stock</th>
								<th class="px-5 py-4">Status</th>
								<th class="px-5 py-4">Active</th>
								<th class="px-5 py-4">Action</th>
							</tr>
						</thead>

						<tbody class="divide-y divide-zinc-100">
							{#each filteredProducts as product}
								{@const stockStatus = getStockStatus(product)}

								<tr class="transition hover:bg-zinc-50">
									<td class="px-5 py-4">
										<div class="flex items-center gap-3">
											<div class="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
												{#if product.imageUrl}
													<img
														src={product.imageUrl}
														alt={product.name}
														width="48"
														height="48"
														class="h-full w-full object-cover"
													/>
												{:else}
													<div class="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-400">
														N/A
													</div>
												{/if}
											</div>

											<div>
												<p class="font-bold text-zinc-900">
													{product.name}
												</p>

												<p class="mt-1 text-xs font-medium text-zinc-400">
													{product.sku}
												</p>
											</div>
										</div>
									</td>

									<td class="px-5 py-4 text-sm font-medium text-zinc-600">
										{product.categoryName ?? 'Uncategorized'}
									</td>

									<td class="px-5 py-4 text-sm font-bold text-zinc-900">
										{formatPrice(product.sellingPrice)}
									</td>

									<td class="px-5 py-4">
										<span class="font-bold text-zinc-900">
											{product.stockQuantity}
										</span>
										<span class="ml-1 text-xs text-zinc-400">units</span>
									</td>

									<td class="px-5 py-4">
										<span class={`rounded-full px-2.5 py-1 text-xs font-bold ${stockStatus.className}`}>
											{stockStatus.label}
										</span>
									</td>

									<td class="px-5 py-4">
										<span
											class={`rounded-full px-2.5 py-1 text-xs font-bold ${
												product.active
													? 'bg-emerald-100 text-emerald-700'
													: 'bg-zinc-100 text-zinc-500'
											}`}
										>
											{product.active ? 'Active' : 'Inactive'}
										</span>
									</td>

									<td class="px-5 py-4">
										<a
											href={`/admin/products/${product.id}`}
											class="text-sm font-bold text-red-600 hover:text-red-700"
										>
											Edit
										</a>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</main>
</div>
