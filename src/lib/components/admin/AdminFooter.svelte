<script lang="ts">
	import { Mail, MapPin } from 'lucide-svelte';
	import logo from '$lib/assets/images/MleraAuto2.png';
</script>

<footer class="border-t border-zinc-300 bg-white text-zinc-900">
	<div class="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">

		<!-- FOOTER INFORMATION -->
		<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

			<!-- BRAND -->
			<div>
				<div class="flex items-center gap-3">
					<div
						class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-zinc-300"
					>
						<img
							src={logo}
							alt="Mlera AutoCare"
							class="h-full w-full object-contain p-0.5"
						/>
					</div>

					<div>
						<p class="text-base font-extrabold text-zinc-950">
							Mlera Stores
						</p>

						<p class="text-sm font-medium text-zinc-600">
							Inventory Management
						</p>
					</div>
				</div>

				<p class="mt-4 max-w-xs text-sm leading-6 text-zinc-600">
					Mlera AutoCare — automotive consumables, parts,
					workshop supplies and safety wear.
				</p>
			</div>

			<!-- CONTACT -->
			<div>
				<h3 class="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-950">
					Contact
				</h3>

				<div class="space-y-3">

					<!-- EMAIL -->
					<a
						href="mailto:storesmlera@gmail.com"
						class="group flex items-center gap-3 text-sm font-medium text-zinc-700 transition-colors hover:text-red-600"
					>
						<span
							class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200 transition-colors group-hover:bg-red-50 group-hover:text-red-600"
						>
							<Mail size={17} strokeWidth={2.2} />
						</span>

						<span class="break-all">
							storesmlera@gmail.com
						</span>
					</a>

					<!-- WHATSAPP -->
					<a
						href="https://wa.me/265997245335"
						target="_blank"
						rel="noopener noreferrer"
						class="group flex items-center gap-3 text-sm font-medium text-zinc-700 transition-colors hover:text-emerald-600"
					>
						<span
							class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
						>
							<svg
								viewBox="0 0 24 24"
								fill="currentColor"
								class="h-[18px] w-[18px]"
								aria-hidden="true"
							>
								<path
									d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.5 0 .17 5.33.17 11.89c0 2.1.55 4.15 1.6 5.96L.06 24l6.3-1.65a11.86 11.86 0 0 0 5.69 1.45h.01c6.55 0 11.88-5.33 11.88-11.89 0-3.17-1.23-6.15-3.42-8.43ZM12.06 21.8h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.74.98 1-3.65-.23-.37a9.88 9.88 0 0 1-1.52-5.28C2.15 6.42 6.59 2 12.06 2a9.86 9.86 0 0 1 7.02 2.92 9.88 9.88 0 0 1 2.9 7.03c0 5.47-4.45 9.85-9.92 9.85Zm5.43-7.39c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.5 1.69.64.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"
								/>
							</svg>
						</span>

						<span>+265 997 245 335</span>
					</a>

				</div>
			</div>

			<!-- LOCATION -->
			<div>
				<h3 class="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-950">
					Location
				</h3>

				<div class="flex items-start gap-3 text-sm font-medium leading-6 text-zinc-700">
					<span
						class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 ring-1 ring-red-100"
					>
						<MapPin size={17} strokeWidth={2.2} />
					</span>

					<span>
						Malangalanga,<br />
						Opposite TAMTAM Bus Depot,<br />
						Lilongwe, Malawi
					</span>
				</div>
			</div>

			<!-- SYSTEM -->
			<div>
				<h3 class="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-950">
					System
				</h3>

				<div class="space-y-3 text-sm text-zinc-700">

					<div class="flex items-center gap-2.5">
						<span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>

						<span class="font-semibold text-zinc-800">
							System Online
						</span>
					</div>

					<p class="font-medium text-zinc-700">
						Administrator Dashboard
					</p>

					<p class="text-zinc-600">
						Secure inventory management
					</p>

				</div>
			</div>
		</div>

		<!-- BOTTOM BAR -->
		<div
			class="mt-9 flex flex-col gap-2 border-t border-zinc-200 pt-5 text-xs font-medium text-zinc-500 sm:flex-row sm:items-center sm:justify-between"
		>
			<p>
				© {new Date().getFullYear()} Mlera Stores. All rights reserved.
			</p>

			<p class="text-zinc-600">
				Mlera AutoCare
			</p>
		</div>
	</div>
</footer>
