<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { ArrowLeft, Save } from 'lucide-svelte';

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

	let categories: Category[] = [];
	let loading = true;
	let loadingCategories = true;
	let saving = false;
	let error = '';

	let productName = '';
	let sku = '';
	let category = '';
	let description = '';
	let costPrice = '';
	let sellingPrice = '';
	let stockQuantity = '0';
	let reorderLevel = '5';
	let imageUrl = '';
let imageFile: File | null = null;
let imagePreview = '';
let active = true;

	onMount(async () => {
		try {
			const [productResponse, categoriesResponse] = await Promise.all([
				fetch(`/api/products/${page.params.id}`),
				fetch('/api/categories')
			]);

			if (!productResponse.ok) {
				throw new Error('Product could not be found.');
			}

			if (!categoriesResponse.ok) {
				throw new Error('Failed to load categories.');
			}

			const product: Product = await productResponse.json();
			const categoryData: Category[] = await categoriesResponse.json();

			productName = product.name;
			sku = product.sku;
			category = product.categoryId ?? '';
			description = product.description ?? '';
			costPrice = product.costPrice ?? '';
			sellingPrice = product.sellingPrice ?? '';
			stockQuantity = String(product.stockQuantity);
			reorderLevel = String(product.reorderLevel);
			imageUrl = product.imageUrl ?? '';
            imagePreview = product.imageUrl ?? '';
            active = product.active;

			categories = categoryData;
		} catch (err) {
			console.error(err);
			error =
				err instanceof Error
					? err.message
					: 'Failed to load product.';
		} finally {
			loading = false;
			loadingCategories = false;
		}
	});


	// Save product function
	async function saveProduct() {
		error = '';

		if (!productName.trim()) {
			error = 'Product name is required.';
			return;
		}

		if (!sku.trim()) {
			error = 'SKU is required.';
			return;
		}

		if (!category) {
			error = 'Category is required.';
			return;
		}

		saving = true;

		try {
			let updatedImageUrl = imageUrl.trim() || null;

			// Upload a new image only when one has been selected
			if (imageFile) {
				const formData = new FormData();
				formData.append('file', imageFile);

				const uploadResponse = await fetch('/api/uploads', {
					method: 'POST',
					body: formData
				});

				const uploadResult = await uploadResponse.json();

				if (!uploadResponse.ok) {
					throw new Error(
						uploadResult.error ?? 'Failed to upload product image.'
					);
				}

				updatedImageUrl = uploadResult.url;
			}

			// Update the product using the existing or newly uploaded image URL
			const response = await fetch(`/api/products/${page.params.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: productName.trim(),
					sku: sku.trim().toUpperCase(),
					categoryId: category,
					description: description.trim() || null,
					costPrice: costPrice || null,
					sellingPrice: sellingPrice || null,
					stockQuantity: Number(stockQuantity),
					reorderLevel: Number(reorderLevel),
					imageUrl: updatedImageUrl,
					active
				})
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to update product.');
			}

			await goto('/admin/products');
		} catch (err) {
			console.error(err);

			error =
				err instanceof Error
					? err.message
					: 'Failed to update product.';
		} finally {
			saving = false;
		}
	}

	function handleImageSelect(event: Event) {
	const input = event.currentTarget as HTMLInputElement;
	const file = input.files?.[0];

	if (!file) {
		return;
	}

	imageFile = file;

	if (imagePreview) {
		URL.revokeObjectURL(imagePreview);
	}

	imagePreview = URL.createObjectURL(file);
}
</script>

<svelte:head>
	<title>Edit Product | Mlera Stores</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<header class="bg-black text-white">
		<div
			class="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8"
		>
			<div>
				<p class="text-sm font-medium text-red-500">MLERA STORES</p>
				<h1 class="mt-1 text-2xl font-bold">Edit Product</h1>
			</div>

			<a
				href="/admin/products"
				class="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-white/10 hover:text-white"
			>
				<ArrowLeft size={17} />
				Products
			</a>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
		{#if error}
			<div
				class="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
			>
				{error}
			</div>
		{/if}

		{#if loading}
			<div class="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
				<div
					class="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"
				></div>

				<p class="mt-4 text-sm text-gray-500">
					Loading product...
				</p>
			</div>
		{:else}
			<form on:submit|preventDefault={saveProduct} class="space-y-6">
				<!-- PRODUCT IMAGE -->
<section
	class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
>
	<div class="mb-6">
		<h2 class="text-lg font-bold text-gray-900">
			Product Image
		</h2>

		<p class="mt-1 text-sm text-gray-500">
			View the current image or select a new image to replace it.
		</p>
	</div>

	<div class="grid gap-6 sm:grid-cols-[220px_1fr] sm:items-start">
		<!-- IMAGE PREVIEW -->
		<div
			class="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gray-50 sm:w-[220px]"
		>
			{#if imagePreview}
				<img
					src={imagePreview}
					alt={`${productName} product image`}
					class="h-full w-full object-contain"
				/>
			{:else}
				<div class="px-5 text-center">
					<p class="text-sm font-bold text-gray-400">
						No image
					</p>

					<p class="mt-1 text-xs text-gray-400">
						No product image has been assigned.
					</p>
				</div>
			{/if}
		</div>

		<!-- IMAGE SELECTOR -->
		<div>
			<label
				for="productImage"
				class="mb-2 block text-sm font-semibold text-gray-700"
			>
				Replace Product Image
			</label>

			<input
				id="productImage"
				type="file"
				accept="image/jpeg,image/png,image/webp"
				on:change={handleImageSelect}
				class="block w-full cursor-pointer rounded-xl border border-gray-300 bg-gray-50 text-sm text-gray-600 file:mr-4 file:cursor-pointer file:border-0 file:bg-red-600 file:px-4 file:py-3 file:text-sm file:font-bold file:text-white hover:file:bg-red-700"
			/>

			<p class="mt-2 text-xs text-gray-500">
				Supported formats: JPG, JPEG, PNG and WebP.
			</p>

			{#if imageFile}
				<div class="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">
					<p class="text-xs font-bold uppercase tracking-wide text-red-600">
						New image selected
					</p>

					<p class="mt-1 break-all text-sm font-semibold text-gray-700">
						{imageFile.name}
					</p>

					<p class="mt-1 text-xs text-gray-500">
						{Math.round(imageFile.size / 1024)} KB
					</p>
				</div>
			{:else if imageUrl}
				<div class="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
					<p class="text-xs font-bold uppercase tracking-wide text-gray-400">
						Current image
					</p>

					<p class="mt-1 break-all font-mono text-xs text-gray-500">
						{imageUrl}
					</p>
				</div>
			{/if}
		</div>
	</div>
</section>

				<section
					class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
				>
					<div class="mb-6">
						<h2 class="text-lg font-bold text-gray-900">
							Pricing
						</h2>

						<p class="mt-1 text-sm text-gray-500">
							Update the product's cost and selling prices.
						</p>
					</div>

					<div class="grid gap-5 sm:grid-cols-2">
						<div>
							<label
								for="costPrice"
								class="mb-2 block text-sm font-semibold text-gray-700"
							>
								Cost Price (MWK)
							</label>

							<input
								id="costPrice"
								type="number"
								min="0"
								step="0.01"
								bind:value={costPrice}
								placeholder="Optional"
								class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
							/>
						</div>

						<div>
							<label
								for="sellingPrice"
								class="mb-2 block text-sm font-semibold text-gray-700"
							>
								Selling Price (MWK)
							</label>

							<input
								id="sellingPrice"
								type="number"
								min="0"
								step="0.01"
								bind:value={sellingPrice}
								placeholder="Optional"
								class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
							/>
						</div>
					</div>
				</section>

				<section
					class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
				>
					<div class="mb-6">
						<h2 class="text-lg font-bold text-gray-900">
							Inventory
						</h2>

						<p class="mt-1 text-sm text-gray-500">
							Manage stock levels and reorder settings.
						</p>
					</div>

					<div class="grid gap-5 sm:grid-cols-2">
						<div>
							<label
								for="stockQuantity"
								class="mb-2 block text-sm font-semibold text-gray-700"
							>
								Stock Quantity
							</label>

							<input
								id="stockQuantity"
								type="number"
								min="0"
								step="1"
								bind:value={stockQuantity}
								class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
								required
							/>
						</div>

						<div>
							<label
								for="reorderLevel"
								class="mb-2 block text-sm font-semibold text-gray-700"
							>
								Reorder Level
							</label>

							<input
								id="reorderLevel"
								type="number"
								min="0"
								step="1"
								bind:value={reorderLevel}
								class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
								required
							/>

							<p class="mt-2 text-xs text-gray-500">
								The product becomes Low Stock at or below this
								quantity.
							</p>
						</div>
					</div>
				</section>

				<section
					class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
				>
					<div class="mb-6">
						<h2 class="text-lg font-bold text-gray-900">
							Product Image
						</h2>

						<p class="mt-1 text-sm text-gray-500">
							Specify the image path for this product.
						</p>
					</div>

					<label
						for="imageUrl"
						class="mb-2 block text-sm font-semibold text-gray-700"
					>
						Image URL
					</label>

					<input
						id="imageUrl"
						type="text"
						bind:value={imageUrl}
						placeholder="/products/product-image.jpeg"
						class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
					/>

					<p class="mt-2 text-xs text-gray-500">
						Example:
						<span class="font-mono">/products/TOTAL-FLUIDMATIC-CVT-MV.jpeg</span>
					</p>
				</section>

				<section
					class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
				>
					<div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h2 class="text-lg font-bold text-gray-900">
								Product Status
							</h2>

							<p class="mt-1 text-sm text-gray-500">
								Control whether customers can see this product
								in the shop.
							</p>
						</div>

						<button
							type="button"
							role="switch"
							aria-checked={active}
							on:click={() => (active = !active)}
							class="flex items-center gap-3"
						>
							<span
								class={`relative h-7 w-12 rounded-full transition ${
									active ? 'bg-green-500' : 'bg-gray-300'
								}`}
							>
								<span
									class={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
										active ? 'left-6' : 'left-1'
									}`}
								></span>
							</span>

							<span
								class={`text-sm font-semibold ${
									active ? 'text-green-700' : 'text-gray-500'
								}`}
							>
								{active ? 'Active / Visible' : 'Hidden'}
							</span>
						</button>
					</div>

					<div
						class={`mt-5 rounded-xl px-4 py-3 text-sm ${
							active
								? 'bg-green-50 text-green-700'
								: 'bg-gray-100 text-gray-600'
						}`}
					>
						{#if active}
							This product is active and will be available to
							customers in the shop.
						{:else}
							This product is hidden from customers but remains
							safely stored in your database.
						{/if}
					</div>
				</section>

				<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<a
						href="/admin/products"
						class="flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
					>
						Cancel
					</a>

					<button
						type="submit"
						disabled={saving || loadingCategories}
						class="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
					>
						<Save size={17} />

						{saving ? 'Saving...' : 'Save Changes'}
					</button>
				</div>
			</form>
		{/if}
	</main>
</div>
