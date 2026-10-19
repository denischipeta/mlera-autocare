<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import AdminFooter from '$lib/components/admin/AdminFooter.svelte';
	import { Save } from 'lucide-svelte';

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

	async function saveProduct() {
		error = '';
		saving = true;

		try {
			let uploadedImageUrl: string | null = null;

			/*
			 * Upload the selected image first.
			 */
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

			/*
			 * Create the product.
			 *
			 * Description is sent as null when the field
			 * is left empty.
			 */
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
	<AdminHeader pageTitle="Add Product" pageLabel="Mlera Stores" />

	<main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="mb-8">
			<p class="text-sm font-semibold text-red-600">
				Inventory Management
			</p>

			<h2 class="mt-1 text-2xl font-black tracking-tight text-zinc-900">
				Create a new product
			</h2>

			<p class="mt-2 text-sm text-zinc-500">
				Add product information that will be stored in the Mlera Stores
				database.
			</p>
		</div>

		{#if error}
			<div
				class="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700"
			>
				{error}
			</div>
		{/if}

		<form class="space-y-6" on:submit|preventDefault={saveProduct}>
			<!-- BASIC INFORMATION -->
			<section
				class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
			>
				<div class="mb-6">
					<h3 class="text-lg font-black text-zinc-900">
						Basic Information
					</h3>

					<p class="mt-1 text-sm text-zinc-500">
						Identify the product and assign it to a category.
					</p>
				</div>

				<div class="grid gap-5 sm:grid-cols-2">
					<!-- PRODUCT NAME -->
					<div class="sm:col-span-2">
						<label
							for="productName"
							class="mb-2 block text-sm font-bold text-zinc-700"
						>
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

					<!-- SKU -->
					<div>
						<label
							for="sku"
							class="mb-2 block text-sm font-bold text-zinc-700"
						>
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

					<!-- CATEGORY -->
					<div>
						<label
							for="category"
							class="mb-2 block text-sm font-bold text-zinc-700"
						>
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
								{loadingCategories
									? 'Loading categories...'
									: 'Select category'}
							</option>

							{#each categories as item}
								<option value={item.id}>
									{item.name}
								</option>
							{/each}
						</select>
					</div>

					<!-- DESCRIPTION -->
					<div class="sm:col-span-2">
						<label
							for="description"
							class="mb-2 block text-sm font-bold text-zinc-700"
						>
							Description
						</label>

						<textarea
							id="description"
							bind:value={description}
							rows="5"
							placeholder="Describe the product, specifications, size, application, compatibility, features, or other useful information..."
							class="w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-red-500 focus:bg-white"
						></textarea>

						<p class="mt-2 text-xs text-zinc-400">
							Optional. This description can be used to provide customers
							with more information about the product.
						</p>
					</div>
				</div>
			</section>

			<!-- PRICING -->
			<section
				class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
			>
				<div class="mb-6">
					<h3 class="text-lg font-black text-zinc-900">
						Pricing
					</h3>

					<p class="mt-1 text-sm text-zinc-500">
						Set the cost and customer selling price in MWK.
					</p>
				</div>

				<div class="grid gap-5 sm:grid-cols-2">
					<!-- COST PRICE -->
					<div>
						<label
							for="costPrice"
							class="mb-2 block text-sm font-bold text-zinc-700"
						>
							Cost Price
						</label>

						<div class="relative">
							<span
								class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400"
							>
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

					<!-- SELLING PRICE -->
					<div>
						<label
							for="sellingPrice"
							class="mb-2 block text-sm font-bold text-zinc-700"
						>
							Selling Price
						</label>

						<div class="relative">
							<span
								class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400"
							>
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
					</div>
				</div>
			</section>

			<!-- INVENTORY -->
			<section
				class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
			>
				<div class="mb-6">
					<h3 class="text-lg font-black text-zinc-900">
						Inventory
					</h3>

					<p class="mt-1 text-sm text-zinc-500">
						Set the available quantity and low-stock threshold.
					</p>
				</div>

				<div class="grid gap-5 sm:grid-cols-2">
					<!-- STOCK -->
					<div>
						<label
							for="stockQuantity"
							class="mb-2 block text-sm font-bold text-zinc-700"
						>
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

					<!-- REORDER LEVEL -->
					<div>
						<label
							for="reorderLevel"
							class="mb-2 block text-sm font-bold text-zinc-700"
						>
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

			<!-- PRODUCT IMAGE -->
			<!-- PRODUCT IMAGE -->
<section
	class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
>
	<div class="mb-6">
		<h3 class="text-lg font-black text-zinc-900">
			Product Image
		</h3>

		<p class="mt-1 text-sm text-zinc-500">
			Select a product image from your computer. The image will be uploaded
			automatically when you save the product.
		</p>
	</div>

	<div class="space-y-5">
		<div>
			<label
				for="imageFile"
				class="mb-2 block text-sm font-bold text-zinc-700"
			>
				Select Image
			</label>

			<input
				id="imageFile"
				type="file"
				accept="image/jpeg,image/png,image/webp"
				on:change={handleImageSelect}
				class="block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-zinc-800"
			/>

			<p class="mt-2 text-xs text-zinc-400">
				Supported formats: JPG, PNG and WebP. Maximum size: 5 MB.
			</p>

			{#if imageFile}
				<p class="mt-2 text-xs font-medium text-zinc-600">
					Selected: {imageFile.name}
				</p>
			{/if}
		</div>

		{#if imagePreview}
			<div>
				<p class="mb-2 text-sm font-bold text-zinc-700">
					Image Preview
				</p>

				<div
					class="h-48 w-48 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50"
				>
					<img
						src={imagePreview}
						alt="Selected product preview"
						class="h-full w-full object-cover"
					/>
				</div>
			</div>
		{/if}
	</div>
</section>

			<!-- STATUS -->
			<section
				class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
			>
				<div class="flex items-start gap-4">
					<input
						id="active"
						type="checkbox"
						bind:checked={active}
						class="mt-1 h-4 w-4 rounded border-zinc-300 text-red-600 focus:ring-red-500"
					/>

					<div>
						<label
							for="active"
							class="text-sm font-bold text-zinc-900"
						>
							Product is active
						</label>

						<p class="mt-1 text-sm text-zinc-500">
							Active products are available for display and sale in
							Mlera Stores.
						</p>
					</div>
				</div>
			</section>

			<!-- ACTIONS -->
			<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
				<a
					href="/admin/products"
					class="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
				>
					Cancel
				</a>

				<button
					type="submit"
					disabled={saving}
					class="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
				>
					<Save size={18} />

					{saving ? 'Saving Product...' : 'Save Product'}
				</button>
			</div>
		</form>
	</main>

	<AdminFooter />
</div>