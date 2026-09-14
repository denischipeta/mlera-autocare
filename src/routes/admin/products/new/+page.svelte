<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { ArrowLeft, Save } from 'lucide-svelte';

	type Category = {
		id: string;
		name: string;
	};

	let categories: Category[] = [];
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
			const response = await fetch('/api/categories');

			if (!response.ok) {
				throw new Error(`Failed to load categories: ${response.status}`);
			}

			const data = await response.json();

			if (!Array.isArray(data)) {
				throw new Error('Invalid category data received.');
			}

			categories = data;
		} catch (err) {
			console.error('Failed to load categories:', err);

			error =
				err instanceof Error
					? err.message
					: 'Unable to load product categories.';
		} finally {
			loadingCategories = false;
		}
	});


	//Image Handle function
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


	// Save product function
	async function saveProduct() {
		error = '';
		saving = true;

		try {
			let uploadedImageUrl = imageUrl.trim() || null;

			// Upload the selected product image first
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

				uploadedImageUrl = uploadResult.url;
			}

			// Create the product using the uploaded image URL
			const response = await fetch('/api/products', {
				method: 'POST',
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
					imageUrl: uploadedImageUrl,
					active
				})
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error ?? 'Failed to create product.');
			}

			await goto('/admin/products');
		} catch (err) {
			console.error('Failed to save product:', err);

			error =
				err instanceof Error
					? err.message
					: 'Failed to save product.';
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<title>Add Product | Mlera Stores Admin</title>
</svelte:head>

<div class="min-h-screen bg-zinc-50">
	<header class="bg-black text-white">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
			<div>
				<p class="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
					Mlera Stores
				</p>

				<h1 class="mt-1 text-2xl font-black sm:text-3xl">
					Add Product
				</h1>
			</div>

			<a
				href="/admin/products"
				class="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10"
			>
				<ArrowLeft size={17} />
				<span class="hidden sm:inline">Products</span>
				<span class="sm:hidden">Back</span>
			</a>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="mb-8">
			<p class="text-sm font-semibold text-red-600">Inventory Management</p>

			<h2 class="mt-1 text-2xl font-black tracking-tight text-zinc-900">
				Create a new product
			</h2>

			<p class="mt-2 text-sm text-zinc-500">
				Add product information that will be stored in the Mlera Stores database.
			</p>
		</div>

		{#if error}
			<div class="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
				{error}
			</div>
		{/if}

		<form class="space-y-6" on:submit|preventDefault={saveProduct}>
			<!-- BASIC INFORMATION -->
			<section class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
				<div class="mb-6">
					<h3 class="text-lg font-black text-zinc-900">Basic Information</h3>

					<p class="mt-1 text-sm text-zinc-500">
						Identify the product and assign it to a category.
					</p>
				</div>

				<div class="grid gap-5 sm:grid-cols-2">
					<div class="sm:col-span-2">
						<label for="productName" class="mb-2 block text-sm font-bold text-zinc-700">
							Product Name <span class="text-red-600">*</span>
						</label>

						<input
							id="productName"
							type="text"
							bind:value={productName}
							placeholder="e.g. Castrol GTX 20W-50"
							required
							class="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:bg-white"
						/>
					</div>

					<div>
						<label for="sku" class="mb-2 block text-sm font-bold text-zinc-700">
							SKU <span class="text-red-600">*</span>
						</label>

						<input
							id="sku"
							type="text"
							bind:value={sku}
							placeholder="e.g. CAST-GTX-20W50"
							required
							class="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm uppercase outline-none transition focus:border-red-500 focus:bg-white"
						/>
					</div>

					<div>
						<label for="category" class="mb-2 block text-sm font-bold text-zinc-700">
							Category <span class="text-red-600">*</span>
						</label>

						<select
							id="category"
							bind:value={category}
							required
							disabled={loadingCategories}
							class="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
						>
							<option value="" disabled>
								{loadingCategories ? 'Loading categories...' : 'Select category'}
							</option>

							{#each categories as item}
								<option value={item.id}>{item.name}</option>
							{/each}
						</select>
					</div>

					<div class="sm:col-span-2">
						<label for="description" class="mb-2 block text-sm font-bold text-zinc-700">
							Description
						</label>

						<textarea
							id="description"
							bind:value={description}
							rows="4"
							placeholder="Describe the product, specifications, size, application, etc."
							class="w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:bg-white"
						></textarea>
					</div>
				</div>
			</section>

			<!-- PRICING -->
			<section class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
				<div class="mb-6">
					<h3 class="text-lg font-black text-zinc-900">Pricing</h3>

					<p class="mt-1 text-sm text-zinc-500">
						Set the cost and customer selling price in MWK.
					</p>
				</div>

				<div class="grid gap-5 sm:grid-cols-2">
					<div>
						<label for="costPrice" class="mb-2 block text-sm font-bold text-zinc-700">
							Cost Price
						</label>

						<div class="relative">
							<span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">
								MK
							</span>

							<input
								id="costPrice"
								type="number"
								min="0"
								step="0.01"
								bind:value={costPrice}
								placeholder="0.00"
								class="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-red-500 focus:bg-white"
							/>
						</div>
					</div>

					<div>
						<label for="sellingPrice" class="mb-2 block text-sm font-bold text-zinc-700">
							Selling Price
						</label>

						<div class="relative">
							<span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">
								MK
							</span>

							<input
								id="sellingPrice"
								type="number"
								min="0"
								step="0.01"
								bind:value={sellingPrice}
								placeholder="0.00"
								class="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-red-500 focus:bg-white"
							/>
						</div>

						<p class="mt-2 text-xs text-zinc-400">
							Leave blank if the price has not yet been set.
						</p>
					</div>
				</div>
			</section>

			<!-- INVENTORY -->
			<section class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
				<div class="mb-6">
					<h3 class="text-lg font-black text-zinc-900">Inventory</h3>

					<p class="mt-1 text-sm text-zinc-500">
						Set the current quantity and the level at which the product should be flagged.
					</p>
				</div>

				<div class="grid gap-5 sm:grid-cols-2">
					<div>
						<label for="stockQuantity" class="mb-2 block text-sm font-bold text-zinc-700">
							Stock Quantity <span class="text-red-600">*</span>
						</label>

						<input
							id="stockQuantity"
							type="number"
							min="0"
							step="1"
							bind:value={stockQuantity}
							required
							class="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:bg-white"
						/>
					</div>

					<div>
						<label for="reorderLevel" class="mb-2 block text-sm font-bold text-zinc-700">
							Reorder Level <span class="text-red-600">*</span>
						</label>

						<input
							id="reorderLevel"
							type="number"
							min="0"
							step="1"
							bind:value={reorderLevel}
							required
							class="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:bg-white"
						/>
					</div>
				</div>
			</section>

			<!-- IMAGE -->
			<!-- IMAGE -->
<section class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
	<div class="mb-6">
		<h3 class="text-lg font-black text-zinc-900">Product Image</h3>

		<p class="mt-1 text-sm text-zinc-500">
			Select an image of the product. The image can be uploaded when the product is saved.
		</p>
	</div>

	<div class="grid gap-6 sm:grid-cols-[220px_1fr] sm:items-start">
		<!-- IMAGE PREVIEW -->
		<div
			class="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 sm:w-[220px]"
		>
			{#if imagePreview}
				<img
					src={imagePreview}
					alt="Selected product preview"
					class="h-full w-full object-contain"
				/>
			{:else}
				<div class="px-5 text-center">
					<p class="text-sm font-bold text-zinc-400">No image selected</p>

					<p class="mt-1 text-xs text-zinc-400">
						Product image preview
					</p>
				</div>
			{/if}
		</div>

		<!-- IMAGE SELECTOR -->
		<div>
			<label
				for="productImage"
				class="mb-2 block text-sm font-bold text-zinc-700"
			>
				Product Image
			</label>

			<input
				id="productImage"
				type="file"
				accept="image/jpeg,image/png,image/webp"
				on:change={handleImageSelect}
				class="block w-full cursor-pointer rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-600 file:mr-4 file:cursor-pointer file:border-0 file:bg-red-600 file:px-4 file:py-3 file:text-sm file:font-bold file:text-white hover:file:bg-red-700"
			/>

			<p class="mt-2 text-xs text-zinc-400">
				Supported formats: JPG, JPEG, PNG and WebP.
			</p>

			{#if imageFile}
				<div class="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
					<p class="text-xs font-bold uppercase tracking-wide text-zinc-400">
						Selected file
					</p>

					<p class="mt-1 break-all text-sm font-semibold text-zinc-700">
						{imageFile.name}
					</p>

					<p class="mt-1 text-xs text-zinc-400">
						{Math.round(imageFile.size / 1024)} KB
					</p>
				</div>
			{/if}
		</div>
	</div>
</section>

			<!-- STATUS -->
			<section class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
				<div class="flex items-start justify-between gap-5">
					<div>
						<h3 class="text-lg font-black text-zinc-900">Product Status</h3>

						<p class="mt-1 text-sm text-zinc-500">
							Active products are available to customers in the shop.
						</p>
					</div>

					<label class="relative inline-flex cursor-pointer items-center">
						<input
							type="checkbox"
							bind:checked={active}
							class="peer sr-only"
						/>

						<div class="h-7 w-12 rounded-full bg-zinc-300 transition peer-checked:bg-red-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-500/30"></div>

						<div class="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5"></div>
					</label>
				</div>

				<div class="mt-4">
					<span
						class={`rounded-full px-3 py-1 text-xs font-bold ${
							active
								? 'bg-emerald-100 text-emerald-700'
								: 'bg-zinc-100 text-zinc-500'
						}`}
					>
						{active ? 'Active' : 'Inactive'}
					</span>
				</div>
			</section>

			<!-- ACTIONS -->
			<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
				<a
					href="/admin/products"
					class="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100"
				>
					Cancel
				</a>

				<button
					type="submit"
					disabled={saving || loadingCategories}
					class="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
				>
					<Save size={18} />
					{saving ? 'Saving...' : 'Save Product'}
				</button>
			</div>
		</form>
	</main>
</div>
