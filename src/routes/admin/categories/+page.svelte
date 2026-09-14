```svelte
<script lang="ts">
import { onMount } from 'svelte';
	import {
		Boxes,
		Search,
		ArrowLeft,
		RefreshCw,
		Package,
		FolderOpen,
		ChevronRight,
		X,
		AlertTriangle,
        Plus,
        Pencil
	} from 'lucide-svelte';

	type Category = {
		id: string;
		name: string;
		description: string | null;
		createdAt: string;
		updatedAt: string;
	};

	type Product = {
		id: string;
		sku: string;
		name: string;
		categoryId: string | null;
		categoryName: string | null;
		description: string | null;
		costPrice: number | string | null;
		sellingPrice: number | string | null;
		stockQuantity: number;
		reorderLevel: number;
		imageUrl: string | null;
		active: boolean;
		createdAt: string;
		updatedAt: string;
	};

	let categories: Category[] = [];
	let products: Product[] = [];

	let loading = true;
	let refreshing = false;
	let error = '';

	let searchTerm = '';

    let showAddCategory = false;
let categoryName = '';
let categoryDescription = '';
let savingCategory = false;
let categoryError = '';
let categorySuccess = '';

let showEditCategory = false;
let editingCategoryId = '';
let editingCategoryName = '';
let editingCategoryDescription = '';
let updatingCategory = false;
let editCategoryError = '';
let editCategorySuccess = '';

function openAddCategory() {
	categoryName = '';
	categoryDescription = '';
	categoryError = '';
	categorySuccess = '';
	showAddCategory = true;
}

function closeAddCategory() {
	if (savingCategory) return;

	showAddCategory = false;
	categoryError = '';
	categorySuccess = '';
}

async function addCategory() {
	categoryError = '';
	categorySuccess = '';

	const name = categoryName.trim();
	const description = categoryDescription.trim();

	if (!name) {
		categoryError = 'Category name is required.';
		return;
	}

	savingCategory = true;

	try {
		const response = await fetch('/api/categories', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name,
				description
			})
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(
				data?.error || 'Failed to create category.'
			);
		}

		categorySuccess = 'Category created successfully.';

		await loadCategories();

		categoryName = '';
		categoryDescription = '';

		setTimeout(() => {
			showAddCategory = false;
			categorySuccess = '';
		}, 700);
	} catch (err) {
		console.error('Failed to create category:', err);

		categoryError =
			err instanceof Error
				? err.message
				: 'Failed to create category.';
	} finally {
		savingCategory = false;
	}
}


function openEditCategory(category: Category) {
	editingCategoryId = category.id;
	editingCategoryName = category.name;
	editingCategoryDescription = category.description ?? '';

	editCategoryError = '';
	editCategorySuccess = '';
	showEditCategory = true;
}

function closeEditCategory() {
	if (updatingCategory) return;

	showEditCategory = false;
	editingCategoryId = '';
	editingCategoryName = '';
	editingCategoryDescription = '';
	editCategoryError = '';
	editCategorySuccess = '';
}

async function updateCategory() {
	editCategoryError = '';
	editCategorySuccess = '';

	const name = editingCategoryName.trim();
	const description = editingCategoryDescription.trim();

	if (!name) {
		editCategoryError = 'Category name is required.';
		return;
	}

	if (!editingCategoryId) {
		editCategoryError = 'Category ID is missing.';
		return;
	}

	updatingCategory = true;

	try {
		const response = await fetch('/api/categories', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: editingCategoryId,
				name,
				description
			})
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(
				data?.error || 'Failed to update category.'
			);
		}

		editCategorySuccess = 'Category updated successfully.';

		await loadCategories();

		setTimeout(() => {
			showEditCategory = false;
			editCategorySuccess = '';
		}, 700);
	} catch (error) {
		console.error('Failed to update category:', error);

		editCategoryError =
			error instanceof Error
				? error.message
				: 'Failed to update category.';
	} finally {
		updatingCategory = false;
	}
}

	function normalize(value: string | null | undefined) {
		return String(value ?? '').trim().toLowerCase();
	}

	function formatDate(value: string) {
		if (!value) return '—';

		const date = new Date(value);

		if (Number.isNaN(date.getTime())) {
			return '—';
		}

		return new Intl.DateTimeFormat('en-MW', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		}).format(date);
	}

	function getProductCount(categoryId: string) {
		return products.filter(
			(product) =>
				product.active &&
				product.categoryId === categoryId
		).length;
	}

	function getUnitCount(categoryId: string) {
		return products
			.filter(
				(product) =>
					product.active &&
					product.categoryId === categoryId
			)
			.reduce(
				(total, product) =>
					total + Number(product.stockQuantity || 0),
				0
			);
	}

	function clearSearch() {
		searchTerm = '';
	}

	async function loadCategories() {
		error = '';

		try {
			const [categoriesResponse, productsResponse] =
				await Promise.all([
					fetch('/api/categories'),
					fetch('/api/products')
				]);

			if (!categoriesResponse.ok) {
				throw new Error(
					`Failed to load categories (${categoriesResponse.status})`
				);
			}

			if (!productsResponse.ok) {
				throw new Error(
					`Failed to load products (${productsResponse.status})`
				);
			}

			const categoriesData = await categoriesResponse.json();
			const productsData = await productsResponse.json();

			if (Array.isArray(categoriesData)) {
				categories = categoriesData;
			} else if (Array.isArray(categoriesData.categories)) {
				categories = categoriesData.categories;
			} else {
				throw new Error(
					'Unexpected response from categories API'
				);
			}

			if (Array.isArray(productsData)) {
				products = productsData;
			} else if (Array.isArray(productsData.products)) {
				products = productsData.products;
			} else {
				throw new Error(
					'Unexpected response from products API'
				);
			}
		} catch (err) {
			console.error('Failed to load categories:', err);

			error =
				err instanceof Error
					? err.message
					: 'Failed to load categories.';

			categories = [];
			products = [];
		} finally {
			loading = false;
			refreshing = false;
		}
	}

	async function refreshCategories() {
		refreshing = true;
		await loadCategories();
	}

	$: filteredCategories = categories.filter((category) => {
		const search = normalize(searchTerm);

		if (!search) {
			return true;
		}

		return (
			normalize(category.name).includes(search) ||
			normalize(category.description).includes(search)
		);
	});

	$: totalCategories = categories.length;

	$: categoriesWithProducts = categories.filter(
		(category) => getProductCount(category.id) > 0
	).length;

	$: emptyCategories = categories.filter(
		(category) => getProductCount(category.id) === 0
	).length;

	$: totalCategorizedUnits = categories.reduce(
		(total, category) =>
			total + getUnitCount(category.id),
		0
	);

	onMount(() => {
		loadCategories();
	});
</script>

<svelte:head>
	<title>Categories | Mlera Stores</title>

	<meta
		name="description"
		content="Manage and review Mlera Stores product categories."
	/>
</svelte:head>

<div class="min-h-screen bg-black text-white">

	<!-- HEADER -->
	<header
		class="sticky top-0 z-50 border-b border-zinc-800 bg-black text-white shadow-xl"
	>
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
						<FolderOpen
							size={20}
							class="shrink-0 text-red-500"
						/>

						<h1
							class="truncate text-lg font-black tracking-tight sm:text-xl"
						>
							Categories
						</h1>
					</div>

					<p
						class="mt-0.5 hidden text-xs text-zinc-500 sm:block"
					>
						Mlera Stores · Product Categories
					</p>
				</div>
			</div>

			<button
				type="button"
				on:click={refreshCategories}
				disabled={refreshing}
				class="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-bold text-white transition hover:border-red-500 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
			>
				<div class:animate-spin={refreshing}>
					<RefreshCw size={16} />
				</div>

				<span class="hidden sm:inline">
					Refresh
				</span>
			</button>
		</div>
	</header>

	<!-- MAIN -->
	<main
		class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
	>

		<!-- INTRO -->
		<section class="mb-8">

			<div
				class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
			>
				<div>

					<p
						class="mb-2 text-xs font-black uppercase tracking-[0.2em] text-red-500"
					>
						Store Management
					</p>

					<h2
						class="text-3xl font-black tracking-tight sm:text-4xl"
					>
						Product Categories
					</h2>

					<p
						class="mt-2 max-w-2xl text-sm leading-6 text-zinc-400"
					>
						Organize the Mlera Stores catalogue by product
						category and quickly see how inventory is distributed.
					</p>

				</div>

				<div class="flex flex-wrap items-center gap-3">
	<button
		type="button"
		on:click={openAddCategory}
		class="inline-flex w-fit items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-black text-white transition hover:bg-red-700"
	>
		<Plus size={17} />
		Add Category
	</button>

	<a
		href="/admin/products"
		class="inline-flex w-fit items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-black text-white transition hover:border-red-500 hover:bg-zinc-800"
	>
		<Package size={17} />
		View Products
	</a>
</div>

			</div>

		</section>

		<!-- ERROR -->
		{#if error}

			<section
				class="mb-8 rounded-2xl border border-red-900/60 bg-red-950/30 p-5 shadow-xl"
			>

				<div class="flex items-start gap-3">

					<AlertTriangle
						size={20}
						class="mt-0.5 shrink-0 text-red-500"
					/>

					<div class="min-w-0 flex-1">

						<h3 class="font-bold text-white">
							Unable to load categories
						</h3>

						<p class="mt-1 text-sm text-red-200">
							{error}
						</p>

					</div>

					<button
						type="button"
						on:click={refreshCategories}
						class="rounded-lg border border-red-800 bg-red-950 px-3 py-2 text-xs font-bold text-white hover:bg-red-900"
					>
						Retry
					</button>

				</div>

			</section>

		{/if}

		<!-- SUMMARY CARDS -->
		<section
			class="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
		>

			<!-- TOTAL CATEGORIES -->
			<div
				class="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl shadow-black/20"
			>

				<div class="flex items-start justify-between gap-4">

					<div>

						<p
							class="text-xs font-bold uppercase tracking-wider text-zinc-500"
						>
							Total Categories
						</p>

						<p
							class="mt-3 text-3xl font-black text-white"
						>
							{totalCategories}
						</p>

					</div>

					<div
						class="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-zinc-300"
					>
						<Boxes size={21} />
					</div>

				</div>

			</div>

			<!-- USED CATEGORIES -->
			<div
				class="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl shadow-black/20"
			>

				<div class="flex items-start justify-between gap-4">

					<div>

						<p
							class="text-xs font-bold uppercase tracking-wider text-zinc-500"
						>
							Categories In Use
						</p>

						<p
							class="mt-3 text-3xl font-black text-emerald-400"
						>
							{categoriesWithProducts}
						</p>

					</div>

					<div
						class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400"
					>
						<FolderOpen size={21} />
					</div>

				</div>

			</div>

			<!-- EMPTY -->
			<div
				class="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl shadow-black/20"
			>

				<div class="flex items-start justify-between gap-4">

					<div>

						<p
							class="text-xs font-bold uppercase tracking-wider text-zinc-500"
						>
							Empty Categories
						</p>

						<p
							class="mt-3 text-3xl font-black text-amber-400"
						>
							{emptyCategories}
						</p>

					</div>

					<div
						class="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400"
					>
						<AlertTriangle size={21} />
					</div>

				</div>

			</div>

			<!-- UNITS -->
			<div
				class="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl shadow-black/20"
			>

				<div class="flex items-start justify-between gap-4">

					<div>

						<p
							class="text-xs font-bold uppercase tracking-wider text-zinc-500"
						>
							Categorized Units
						</p>

						<p
							class="mt-3 text-3xl font-black text-white"
						>
							{totalCategorizedUnits.toLocaleString()}
						</p>

					</div>

					<div
						class="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-zinc-300"
					>
						<Package size={21} />
					</div>

				</div>

			</div>

		</section>

		<!-- CATEGORY CONTENT -->
		<section
			class="overflow-hidden rounded-2xl border border-zinc-200 bg-white text-zinc-950 shadow-2xl shadow-black/20"
		>

			<!-- SECTION HEADER -->
			<div class="border-b border-zinc-200 p-5 sm:p-6">

				<div
					class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
				>

					<div>

						<h3
							class="text-xl font-black tracking-tight"
						>
							Category Directory
						</h3>

						<p
							class="mt-1 text-sm text-zinc-500"
						>
							{filteredCategories.length}
							of
							{categories.length}
							categories shown.
						</p>

					</div>

					<div class="relative w-full xl:w-96">

						<Search
							size={18}
							class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
						/>

						<input
							id="category-search"
							type="search"
							bind:value={searchTerm}
							placeholder="Search categories..."
							autocomplete="off"
							class="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-10 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
						/>

						{#if searchTerm}

							<button
								type="button"
								on:click={clearSearch}
								aria-label="Clear category search"
								class="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-400 transition hover:bg-zinc-200 hover:text-zinc-700"
							>
								<X size={17} />
							</button>

						{/if}

					</div>

				</div>

			</div>

			<!-- LOADING -->
			{#if loading}

				<div class="p-10 text-center">

					<RefreshCw
						size={28}
						class="mx-auto animate-spin text-red-600"
					/>

					<p
						class="mt-4 text-sm font-semibold text-zinc-600"
					>
						Loading categories...
					</p>

				</div>

			<!-- EMPTY SEARCH -->
			{:else if filteredCategories.length === 0}

				<div class="p-10 text-center sm:p-16">

					<div
						class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400"
					>
						<Search size={24} />
					</div>

					<h4
						class="mt-4 text-lg font-black text-zinc-900"
					>
						No categories found
					</h4>

					<p
						class="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500"
					>
						No categories match your current search.
					</p>

					{#if searchTerm}

						<button
							type="button"
							on:click={clearSearch}
							class="mt-5 inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-bold text-white transition hover:bg-zinc-800"
						>
							<X size={16} />
							Clear Search
						</button>

					{/if}

				</div>

			<!-- CATEGORY TABLE -->
			{:else}

				<div class="overflow-x-auto">

					<table class="w-full min-w-[850px] text-left">

						<thead
							class="border-b border-zinc-200 bg-zinc-50"
						>

							<tr>

								<th
									class="px-5 py-4 text-xs font-black uppercase tracking-wider text-zinc-500"
								>
									Category
								</th>

								<th
									class="px-5 py-4 text-xs font-black uppercase tracking-wider text-zinc-500"
								>
									Description
								</th>

								<th
									class="px-5 py-4 text-center text-xs font-black uppercase tracking-wider text-zinc-500"
								>
									Products
								</th>

								<th
									class="px-5 py-4 text-center text-xs font-black uppercase tracking-wider text-zinc-500"
								>
									Units
								</th>

								<th
									class="px-5 py-4 text-xs font-black uppercase tracking-wider text-zinc-500"
								>
									Created
								</th>

								<th
									class="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-zinc-500"
								>
									Action
								</th>

							</tr>

						</thead>

						<tbody class="divide-y divide-zinc-100">

							{#each filteredCategories as category}

								{@const productCount = getProductCount(category.id)}
								{@const unitCount = getUnitCount(category.id)}

								<tr
									class="transition hover:bg-zinc-50"
								>

									<!-- CATEGORY -->
									<td class="px-5 py-5">

										<div
											class="flex items-center gap-3"
										>

											<div
												class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700"
											>
												<FolderOpen size={19} />
											</div>

											<div class="min-w-0">

												<p
													class="truncate text-sm font-black text-zinc-900"
												>
													{category.name}
												</p>

												<p
													class="mt-0.5 font-mono text-[11px] text-zinc-400"
												>
													{category.id}
												</p>

											</div>

										</div>

									</td>

									<!-- DESCRIPTION -->
									<td class="px-5 py-5">

										<p
											class="max-w-[320px] text-sm leading-5 text-zinc-600"
										>
											{category.description ||
												'No description provided.'}
										</p>

									</td>

									<!-- PRODUCTS -->
									<td class="px-5 py-5 text-center">

										<span
											class="inline-flex min-w-10 items-center justify-center rounded-lg bg-zinc-100 px-2.5 py-1.5 text-sm font-black text-zinc-900"
										>
											{productCount}
										</span>

									</td>

									<!-- UNITS -->
									<td class="px-5 py-5 text-center">

										<span
											class="text-sm font-bold text-zinc-700"
										>
											{unitCount.toLocaleString()}
										</span>

									</td>

									<!-- CREATED -->
									<td class="px-5 py-5">

										<span
											class="text-sm font-medium text-zinc-600"
										>
											{formatDate(category.createdAt)}
										</span>

									</td>

									<!-- ACTION -->
									<td class="px-5 py-5 text-right">

										<div class="flex flex-wrap items-center justify-end gap-2">

											<button
												type="button"
												on:click={() => openEditCategory(category)}
												class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
											>
												<Pencil size={14} />
												Edit
											</button>

											<a
												href={`/admin/products?category=${encodeURIComponent(category.id)}`}
												class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
											>
												View Products
												<ChevronRight size={14} />
											</a>

										</div>

									</td>

								</tr>

							{/each}

						</tbody>

					</table>

				</div>

				<!-- TABLE FOOTER -->
				<div
					class="border-t border-zinc-200 bg-zinc-50 px-5 py-4 sm:px-6"
				>

					<div
						class="flex flex-col gap-2 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between"
					>

						<p>
							Showing
							<span class="font-bold text-zinc-900">
								{filteredCategories.length}
							</span>
							category{filteredCategories.length === 1
								? ''
								: 'ies'}
						</p>

						<p>
							Total categorized stock:
							<span class="font-bold text-zinc-900">
								{totalCategorizedUnits.toLocaleString()}
							</span>
							units
						</p>

					</div>

				</div>

			{/if}

		</section>

		<!-- INFORMATION / NEXT STEP -->
		<section
			class="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl"
		>

			<div
				class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
			>

				<div>

					<p
						class="text-xs font-black uppercase tracking-[0.2em] text-red-500"
					>
						Category Structure
					</p>

					<h3
						class="mt-2 text-xl font-black text-white"
					>
						Categories are database-backed
					</h3>

					<p
						class="mt-2 max-w-2xl text-sm leading-6 text-zinc-400"
					>
						These categories are loaded directly from the
						Mlera Stores PostgreSQL database. Products are
						linked to categories through their category ID.
					</p>

				</div>

				<a
					href="/admin/inventory"
					class="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-black transition hover:bg-zinc-200"
				>
					<Boxes size={17} />
					View Inventory
				</a>

			</div>

		</section>

	</main>

    {#if showAddCategory}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
		role="presentation"
		on:click={(event) => {
			if (event.target === event.currentTarget) {
				closeAddCategory();
			}
		}}
	>
		<div
			class="w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white text-zinc-950 shadow-2xl"
			role="dialog"
			aria-modal="true"
			aria-labelledby="add-category-title"
		>
			<!-- MODAL HEADER -->
			<div
				class="flex items-center justify-between border-b border-zinc-200 px-5 py-4 sm:px-6"
			>
				<div>
					<p
						class="text-xs font-black uppercase tracking-[0.2em] text-red-600"
					>
						Category Management
					</p>

					<h3
						id="add-category-title"
						class="mt-1 text-xl font-black tracking-tight"
					>
						Add Category
					</h3>
				</div>

				<button
					type="button"
					on:click={closeAddCategory}
					disabled={savingCategory}
					aria-label="Close add category form"
					class="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<X size={19} />
				</button>
			</div>

			<!-- FORM -->
			<form
				class="space-y-5 p-5 sm:p-6"
				on:submit|preventDefault={addCategory}
			>
				<!-- ERROR -->
				{#if categoryError}
					<div
						class="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
					>
						<div class="flex items-start gap-2">
							<AlertTriangle
								size={17}
								class="mt-0.5 shrink-0"
							/>

							<p>{categoryError}</p>
						</div>
					</div>
				{/if}

				<!-- SUCCESS -->
				{#if categorySuccess}
					<div
						class="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700"
					>
						{categorySuccess}
					</div>
				{/if}

				<!-- NAME -->
				<div>
					<label
						for="category-name"
						class="mb-2 block text-sm font-bold text-zinc-800"
					>
						Category Name
						<span class="text-red-600">*</span>
					</label>

					<input
						id="category-name"
						type="text"
						bind:value={categoryName}
						maxlength="100"
						placeholder="e.g. Safety Gear"
						disabled={savingCategory}
						autocomplete="off"
						class="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
					/>

					<p class="mt-1.5 text-xs text-zinc-400">
						Maximum 100 characters.
					</p>
				</div>

				<!-- DESCRIPTION -->
				<div>
					<label
						for="category-description"
						class="mb-2 block text-sm font-bold text-zinc-800"
					>
						Description
						<span class="font-normal text-zinc-400">
							(Optional)
						</span>
					</label>

					<textarea
						id="category-description"
						bind:value={categoryDescription}
						rows="4"
						placeholder="Briefly describe the products that belong in this category..."
						disabled={savingCategory}
						class="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
					></textarea>
				</div>

				<!-- ACTIONS -->
				<div
					class="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-5 sm:flex-row sm:justify-end"
				>
					<button
						type="button"
						on:click={closeAddCategory}
						disabled={savingCategory}
						class="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Cancel
					</button>

					<button
						type="submit"
						disabled={savingCategory || !categoryName.trim()}
						class="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if savingCategory}
							<RefreshCw
								size={16}
								class="animate-spin"
							/>
							Saving...
						{:else}
							<Plus size={16} />
							Add Category
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

{#if showEditCategory}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
		role="presentation"
		on:click={(event) => {
			if (event.target === event.currentTarget) {
				closeEditCategory();
			}
		}}
	>
		<div
			class="w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
			role="dialog"
			aria-modal="true"
			aria-labelledby="edit-category-title"
		>
			<!-- HEADER -->
			<div
				class="flex items-center justify-between border-b border-zinc-200 px-5 py-4 sm:px-6"
			>
				<div>
					<p class="text-xs font-black uppercase tracking-widest text-red-600">
						Category Management
					</p>

					<h3
						id="edit-category-title"
						class="mt-1 text-xl font-black tracking-tight text-zinc-950"
					>
						Edit Category
					</h3>
				</div>

				<button
					type="button"
					on:click={closeEditCategory}
					disabled={updatingCategory}
					aria-label="Close edit category form"
					class="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<X size={19} />
				</button>
			</div>

			<!-- FORM -->
			<form
				class="space-y-5 p-5 sm:p-6"
				on:submit|preventDefault={updateCategory}
			>
				<!-- ERROR -->
				{#if editCategoryError}
					<div
						class="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
					>
						<div class="flex items-start gap-2">
							<AlertTriangle
								size={17}
								class="mt-0.5 shrink-0"
							/>

							<p>{editCategoryError}</p>
						</div>
					</div>
				{/if}

				<!-- SUCCESS -->
				{#if editCategorySuccess}
					<div
						class="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700"
					>
						{editCategorySuccess}
					</div>
				{/if}

				<!-- NAME -->
				<div>
					<label
						for="edit-category-name"
						class="mb-2 block text-sm font-bold text-zinc-800"
					>
						Category Name
						<span class="text-red-600">*</span>
					</label>

					<input
						id="edit-category-name"
						type="text"
						bind:value={editingCategoryName}
						maxlength="100"
						placeholder="e.g. Safety Gear"
						disabled={updatingCategory}
						autocomplete="off"
						class="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
					/>

					<p class="mt-1.5 text-xs text-zinc-400">
						Maximum 100 characters.
					</p>
				</div>

				<!-- DESCRIPTION -->
				<div>
					<label
						for="edit-category-description"
						class="mb-2 block text-sm font-bold text-zinc-800"
					>
						Description
						<span class="font-normal text-zinc-400">
							(Optional)
						</span>
					</label>

					<textarea
						id="edit-category-description"
						bind:value={editingCategoryDescription}
						rows="4"
						placeholder="Briefly describe the products that belong in this category..."
						disabled={updatingCategory}
						class="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
					></textarea>
				</div>

				<!-- ACTIONS -->
				<div
					class="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-5 sm:flex-row sm:justify-end"
				>
					<button
						type="button"
						on:click={closeEditCategory}
						disabled={updatingCategory}
						class="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Cancel
					</button>

					<button
						type="submit"
						disabled={updatingCategory || !editingCategoryName.trim()}
						class="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if updatingCategory}
							<RefreshCw
								size={16}
								class="animate-spin"
							/>
							Saving...
						{:else}
							<Pencil size={16} />
							Save Changes
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

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

			<div
				class="text-xs text-zinc-500 sm:text-right"
			>

				<p>
					Part of Mlera AutoCare
				</p>

				<p class="mt-1">
					&copy; {new Date().getFullYear()}
					Mlera Stores. All rights reserved.
				</p>

			</div>

		</div>

	</footer>

</div>
```
