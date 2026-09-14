<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowRight, ShoppingBag, Wrench } from 'lucide-svelte';
// =========================================================
	// HERO IMAGES
	// =========================================================

import carService from '$lib/assets/images/autocare/Fluids.jpeg';
import mechanic from '$lib/assets/images/autocare/Manyaparts.jpeg';
import engine from '$lib/assets/images/autocare/NGK Spark Plug.jpeg';
import oilChange from '$lib/assets/images/autocare/toyoyaParts.jpg';

// =========================================================
	// SERVICE IMAGES
	// =========================================================

import autoElectrical from '$lib/assets/images/autocare/autoElectrical.jpeg';
import suspension from '$lib/assets/images/autocare/mazda-suspension.jpg';
import brakes from '$lib/assets/images/autocare/brakes.jpeg';
import oilService from '$lib/assets/images/autocare/Oils.jpg';
import generalRepair from '$lib/assets/images/autocare/GeneralRepair.jpg';
import diagnostics from '$lib/assets/images/autocare/diagonostics.jpeg';
	
import storeIllustration from '$lib/assets/images/autocare/illustration.jpeg';
import autoZone from '$lib/assets/images/autocare/autoZone.jpeg';

const heroImages = [
		{
			src: carService,
			alt: 'Automotive fluids and lubricants'
		},
		{
			src: mechanic,
			alt: 'Automotive spare parts'
		},
		{
			src: engine,
			alt: 'NGK spark plugs'
		},
		{
			src: oilChange,
			alt: 'Toyota automotive parts'
		}
	];

	let activeImage = 0;

	let slideTimer: ReturnType<typeof setInterval>;


	// =========================================================
	// NEXT IMAGE
	// =========================================================

	function nextImage() {
		activeImage = (activeImage + 1) % heroImages.length;
	}


	// =========================================================
	// PREVIOUS IMAGE
	// =========================================================

	function previousImage() {
		activeImage =
			activeImage === 0
				? heroImages.length - 1
				: activeImage - 1;
	}


	// =========================================================
	// GO TO SPECIFIC IMAGE
	// =========================================================

	function goToImage(index: number) {
		activeImage = index;
	}


	// =========================================================
	// START SLIDESHOW
	// =========================================================

	function startSlideshow() {
		clearInterval(slideTimer);

		slideTimer = setInterval(() => {
			nextImage();
		}, 5000);
	}


	// =========================================================
	// INITIALIZE
	// =========================================================

	onMount(() => {
		startSlideshow();

		return () => {
			clearInterval(slideTimer);
		};
	});


	// =========================================================
	// SERVICES
	// =========================================================

const services = [
	{
		image: generalRepair,
		title: 'General Repairs',
		description:
			'Reliable repairs for everyday vehicle problems and mechanical faults.'
	},
	{
		image: diagnostics,
		title: 'Vehicle Diagnostics',
		description:
			'Professional vehicle diagnostics and fault detection to identify problems accurately.'
	},
	{
		image: oilService,
		title: 'Oil & Filter Service',
		description:
			'Keep your engine running smoothly with quality lubricants and filters.'
	},
	{
		image: brakes,
		title: 'Brake Service',
		description:
			'Brake inspection, repairs and replacement for safer driving.'
	},
	{
		image: suspension,
		title: 'Suspension',
		description:
			'Suspension inspection and repair for a smoother and safer ride.'
	},
	{
		image: autoElectrical,
		title: 'Auto Electrical',
		description:
			'Electrical troubleshooting, diagnostics and repairs for your vehicle.'
	}
];
</script>


<svelte:head>

	<title>
		Mlera AutoCare | Automotive Care & Parts
	</title>

	<meta
		name="description"
		content="Mlera AutoCare provides professional automotive services, quality lubricants, spare parts and vehicle accessories."
	/>

	<meta
		name="theme-color"
		content="#09090b"
	/>

</svelte:head>


<!-- =========================================================
     HEADER
========================================================= -->

<header
	class="fixed top-0 z-50 w-full border-b border-white/10 bg-black/75 backdrop-blur-xl"
>

	<div
		class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
	>

		<!-- BRAND -->

		<a
			href="/"
			class="text-xl font-black tracking-tight text-white"
		>
			MLERA
			<span class="text-red-500">
				AUTOCARE
			</span>
		</a>


		<!-- DESKTOP NAV -->

		<nav
			class="hidden items-center gap-8 text-sm text-gray-300 md:flex"
		>

			<a
				href="#home"
				class="transition hover:text-white"
			>
				Home
			</a>

			<a
				href="#services"
				class="transition hover:text-white"
			>
				Services
			</a>

			<a
				href="#about"
				class="transition hover:text-white"
			>
				About
			</a>

			<a
				href="#contact"
				class="transition hover:text-white"
			>
				Contact
			</a>


			<!-- SHOP -->

			<a
				href="/shop"
				class="group ml-2 flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 font-bold text-white shadow-lg shadow-red-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-500"
			>

				<ShoppingBag
					size={18}
					strokeWidth={2.5}
				/>

				<span>
					Visit Shop
				</span>

				<ArrowRight
					size={16}
					class="transition-transform duration-200 group-hover:translate-x-1"
				/>

			</a>

		</nav>


		<!-- MOBILE SHOP -->

		<a
			href="/shop"
			class="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white md:hidden"
		>

			<ShoppingBag size={17} />

			<span>
				Shop
			</span>

		</a>

	</div>

</header>


<!-- =========================================================
     HERO
========================================================= -->

<section
	id="home"
	class="relative flex min-h-screen items-center overflow-hidden bg-black pt-20"
>

	<!-- =====================================================
	     BACKGROUND SLIDES
	===================================================== -->

	<div
		class="absolute inset-0"
	>

		{#each heroImages as image, index}

			<div
				class="hero-slide absolute inset-0"
				class:active={index === activeImage}
			>

				<img
					src={image.src}
					alt={image.alt}
					class="h-full w-full object-cover"
				/>

			</div>

		{/each}

	</div>


	<!-- =====================================================
	     OVERLAYS
	===================================================== -->

	<div
		class="absolute inset-0 bg-black/50"
	></div>


	<div
		class="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20"
	></div>


	<div
		class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"
	></div>


	<!-- RED GLOW -->

	<div
		class="absolute -right-40 top-1/4 h-[500px] w-[500px] rounded-full bg-red-600/20 blur-[140px]"
	></div>


	<!-- =====================================================
	     HERO CONTENT
	===================================================== -->

	<div
		class="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-6 py-32 lg:grid-cols-2 lg:items-center"
	>

		<!-- LEFT -->

		<div>

			<div
				class="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400 backdrop-blur-md"
			>

				<span
					class="h-2 w-2 animate-pulse rounded-full bg-red-500"
				></span>

				Professional Automotive Care

			</div>


			<h1
				class="max-w-4xl text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
			>

				Your Car.

				<span class="text-red-500">
					Our Expertise.
				</span>

			</h1>


			<p
				class="mt-6 max-w-xl text-lg leading-8 text-gray-300"
			>

				Reliable vehicle servicing, quality automotive
				products and professional repairs you can trust.

			</p>


			<!-- BUTTONS -->

			<div
				class="mt-8 flex flex-wrap gap-4"
			>

				<a
					href="/shop"
					class="group flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3.5 font-bold text-white shadow-xl shadow-red-600/30 transition hover:bg-red-500"
				>

					<ShoppingBag
						size={19}
						strokeWidth={2.5}
					/>

					<span>
						Visit Shop
					</span>

					<ArrowRight
						size={17}
						class="transition-transform group-hover:translate-x-1"
					/>

				</a>


				<a
					href="#contact"
					class="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3.5 font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
				>

					<Wrench size={18} />

					Book a Service

				</a>

			</div>


			<!-- STATS -->

			<div
				class="mt-10 flex flex-wrap gap-8 border-t border-white/10 pt-8"
			>

				<div>

					<p class="text-2xl font-bold text-white">
						Quality
					</p>

					<p class="mt-1 text-sm text-gray-400">
						Products
					</p>

				</div>


				<div>

					<p class="text-2xl font-bold text-white">
						Reliable
					</p>

					<p class="mt-1 text-sm text-gray-400">
						Service
					</p>

				</div>


				<div>

					<p class="text-2xl font-bold text-white">
						Fair
					</p>

					<p class="mt-1 text-sm text-gray-400">
						Pricing
					</p>

				</div>

			</div>

		</div>


		<!-- =================================================
		     RIGHT CARD
		================================================= -->

		<div
			class="hidden lg:flex lg:justify-end"
		>

			<div
	class="w-full max-w-md rounded-3xl border border-white/15 bg-black/35 p-8 shadow-2xl backdrop-blur-md"
>
	<div
		class="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-600/30"
	>
		<ShoppingBag
			size={28}
			class="text-white"
		/>
	</div>

	<p
		class="text-sm font-bold uppercase tracking-widest text-red-400"
	>
		Mlera Stores
	</p>

	<h2
		class="mt-3 text-3xl font-black text-white"
	>
		Quality Parts.

		<span class="text-red-500">
			Quality Care.
		</span>
	</h2>

	<p
		class="mt-4 leading-7 text-gray-300"
	>
		Shop automotive lubricants, spare parts,
		vehicle accessories and other products
		for your vehicle.
	</p>

	<a
		href="/shop"
		class="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-zinc-900 transition hover:bg-red-500 hover:text-white"
	>
		<ShoppingBag size={17} />

		Shop Automotive Products

		<ArrowRight size={15} />
	</a>

	<!-- STORE ILLUSTRATION -->

	<div
		class="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 shadow-xl"
	>
		<img
			src={storeIllustration}
			alt="Mlera Stores automotive products"
			class="h-auto w-full rounded-xl object-cover transition duration-500 hover:scale-[1.02]"
			loading="lazy"
		/>
	</div>
</div>

		</div>

	</div>


	<!-- =====================================================
	     SLIDER CONTROLS
	===================================================== -->

	<div
		class="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-4"
	>

		<!-- PREVIOUS -->

		<button
			type="button"
			onclick={() => {
				previousImage();
				startSlideshow();
			}}
			aria-label="Previous image"
			class="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-lg text-white backdrop-blur-md transition hover:bg-white/15"
		>
			←
		</button>


		<!-- DOTS -->

		<div
			class="flex items-center gap-2"
		>

			{#each heroImages as _, index}

				<button
					type="button"
					onclick={() => {
						goToImage(index);
						startSlideshow();
					}}
					aria-label={`Show slide ${index + 1}`}
					class:active-dot={index === activeImage}
					class="slide-dot"
				></button>

			{/each}

		</div>


		<!-- NEXT -->

		<button
			type="button"
			onclick={() => {
				nextImage();
				startSlideshow();
			}}
			aria-label="Next image"
			class="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-lg text-white backdrop-blur-md transition hover:bg-white/15"
		>
			→
		</button>

	</div>


	<!-- SLIDE COUNTER -->

	<div
		class="absolute bottom-9 right-6 z-30 hidden text-sm font-medium text-white/60 sm:block"
	>

		<span class="text-white">
			{String(activeImage + 1).padStart(2, '0')}
		</span>

		<span class="mx-1">
			/
		</span>

		{String(heroImages.length).padStart(2, '0')}

	</div>

</section>


<!-- =========================================================
     SERVICES
========================================================= -->

<section
	id="services"
	class="bg-white px-6 py-24"
>

	<div class="mx-auto max-w-7xl">

		<div class="max-w-2xl">

			<p
				class="text-sm font-bold uppercase tracking-widest text-red-600"
			>
				What We Do
			</p>

			<h2
				class="mt-3 text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl"
			>
				Our Services
			</h2>

			<p
				class="mt-5 text-lg leading-8 text-zinc-600"
			>
				Professional automotive services designed to
				keep your vehicle safe, reliable and performing
				at its best.
			</p>

		</div>


		<div
			class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
		>

{#each services as service}
	<div
		class="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-2xl"
	>
		<!-- SERVICE IMAGE -->

		<div class="relative aspect-square w-full overflow-hidden bg-zinc-100">
			<img
				src={service.image}
				alt={service.title}
				class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
				loading="lazy"
			/>

			<!-- Image overlay -->

			<div
				class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent"
			></div>

			<!-- Service badge -->

			<div
				class="absolute bottom-4 left-4 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg"
			>
				Mlera AutoCare
			</div>
		</div>

		<!-- SERVICE CONTENT -->

		<div class="p-7">
			<h3 class="text-xl font-bold text-zinc-900">
				{service.title}
			</h3>

			<p class="mt-3 leading-7 text-zinc-600">
				{service.description}
			</p>

			<a
				href="#contact"
				class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-red-600 transition-all duration-300 group-hover:gap-3"
			>
				Book This Service

				<ArrowRight size={15} />
			</a>
		</div>
	</div>
{/each}

		</div>

	</div>

</section>


<!-- =========================================================
     SHOP PROMOTION
========================================================= -->

<section class="bg-zinc-100 px-6 py-20">
	<div class="mx-auto max-w-7xl">
		<div
			class="relative overflow-hidden rounded-3xl bg-zinc-950 p-6 shadow-2xl sm:p-8 lg:p-10"
		>
			<!-- Background glow -->
			<div
				class="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-red-600/20 blur-3xl"
			></div>

			<div
				class="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-red-600/10 blur-3xl"
			></div>

			<div
				class="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between"
			>
				<!-- Text -->
				<div class="max-w-2xl">
					<p
						class="text-sm font-bold uppercase tracking-widest text-red-500"
					>
						Mlera Stores
					</p>

					<h2
						class="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl"
					>
						Everything your vehicle needs.
					</h2>

					<p
						class="mt-4 max-w-xl leading-7 text-gray-400"
					>
						Discover quality lubricants, spare parts,
						filters, spark plugs and vehicle accessories.
					</p>
				</div>

				<!-- Image + Button -->
				<div class="w-full shrink-0 lg:w-[380px]">
					<div
						class="rounded-2xl border border-white/10 bg-white/5 p-2 shadow-xl"
					>
						<div class="overflow-hidden rounded-xl">
							<img
								src={autoZone}
								alt="Mlera Stores automotive products"
								class="h-56 w-full object-cover transition duration-700 hover:scale-105"
								loading="lazy"
							/>
						</div>
					</div>

					<a
						href="/shop"
						class="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-red-600/20 transition duration-300 hover:bg-red-500 hover:shadow-red-600/30"
					>
						<ShoppingBag size={18} />

						Visit Store

						<ArrowRight
							size={17}
							class="transition-transform duration-300 group-hover:translate-x-1"
						/>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- =========================================================
     ABOUT
========================================================= -->

<section
	id="about"
	class="bg-zinc-950 px-6 py-24"
>

	<div
		class="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center"
	>

		<div>

			<p
				class="text-sm font-bold uppercase tracking-widest text-red-500"
			>
				About Mlera AutoCare
			</p>

			<h2
				class="mt-3 text-4xl font-black text-white sm:text-5xl"
			>

				Care for your car.

				<span class="text-red-500">
					Care for you.
				</span>

			</h2>

		</div>


		<div>

			<p
				class="text-lg leading-8 text-gray-400"
			>

				At Mlera AutoCare, our goal is simple:
				provide dependable automotive services and
				quality vehicle products that give our customers
				confidence on the road.

			</p>


			<div
				class="mt-8 grid grid-cols-2 gap-6"
			>

				<div
					class="rounded-xl border border-white/10 p-5 transition hover:border-red-500/30"
				>

					<p class="text-2xl font-bold text-white">
						✓
					</p>

					<p class="mt-2 font-semibold text-white">
						Professional Service
					</p>

				</div>


				<div
					class="rounded-xl border border-white/10 p-5 transition hover:border-red-500/30"
				>

					<p class="text-2xl font-bold text-white">
						✓
					</p>

					<p class="mt-2 font-semibold text-white">
						Quality Products
					</p>

				</div>


				<div
					class="rounded-xl border border-white/10 p-5 transition hover:border-red-500/30"
				>

					<p class="text-2xl font-bold text-white">
						✓
					</p>

					<p class="mt-2 font-semibold text-white">
						Fair Pricing
					</p>

				</div>


				<div
					class="rounded-xl border border-white/10 p-5 transition hover:border-red-500/30"
				>

					<p class="text-2xl font-bold text-white">
						✓
					</p>

					<p class="mt-2 font-semibold text-white">
						Reliable Repairs
					</p>

				</div>

			</div>

		</div>

	</div>

</section>


<!-- =========================================================
     CONTACT
========================================================= -->

<section
	id="contact"
	class="bg-white px-6 py-24"
>
	<div class="mx-auto max-w-6xl">

		<!-- SECTION HEADER -->

		<div class="mb-12 text-center">

			<p
				class="text-sm font-bold uppercase tracking-[0.2em] text-red-600"
			>
				Get In Touch
			</p>

			<h2
				class="mt-3 text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl"
			>
				Let's Take Care of Your Vehicle
			</h2>

			<p
				class="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-600"
			>
				Whether you need a service, spare parts, lubricants
				or vehicle accessories, Mlera AutoCare is ready to help.
			</p>

		</div>


		<!-- CONTACT CARD -->

		<div
			class="overflow-hidden rounded-3xl bg-zinc-950 shadow-2xl"
		>

			<div
				class="grid lg:grid-cols-2"
			>

				<!-- =================================================
				     LEFT
				================================================= -->

				<div
					class="relative overflow-hidden p-8 sm:p-12"
				>

					<!-- Background glow -->

					<div
						class="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-red-600/20 blur-3xl"
					></div>

					<div
						class="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-red-600/10 blur-3xl"
					></div>


					<div class="relative">

						<p
							class="text-sm font-bold uppercase tracking-widest text-red-500"
						>
							Mlera AutoCare
						</p>


						<h3
							class="mt-4 text-3xl font-black text-white sm:text-4xl"
						>
							Need help with your vehicle?
						</h3>


						<p
							class="mt-5 max-w-lg leading-8 text-gray-400"
						>
							Talk to our team about vehicle servicing,
							automotive parts, lubricants and accessories.
							We're here to help you keep your vehicle
							running right.
						</p>


						<!-- CONTACT INFORMATION -->

						<div class="mt-10 space-y-5">


							<!-- WHATSAPP -->

							<a
								href="https://wa.me/265997245335"
								target="_blank"
								rel="noopener noreferrer"
								class="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-green-500/40 hover:bg-green-500/10"
							>

								<!-- WhatsApp Icon -->

								<div
									class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/20 transition group-hover:scale-105 group-hover:bg-green-400"
								>

									<svg
										viewBox="0 0 24 24"
										class="h-6 w-6 fill-current"
										aria-hidden="true"
									>
										<path
											d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.96L.06 24l6.28-1.65a11.86 11.86 0 0 0 5.71 1.46h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.17-1.23-6.15-3.43-8.43ZM12.06 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.73.98 1-3.64-.23-.37a9.85 9.85 0 0 1-1.51-5.28c0-5.47 4.45-9.92 9.93-9.92 2.65 0 5.14 1.03 7.01 2.91a9.86 9.86 0 0 1 2.9 7.02c0 5.46-4.45 9.91-9.92 9.91Zm5.43-7.43c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.08 4.5.71.31 1.27.5 1.7.64.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"
										/>
									</svg>

								</div>


								<div class="min-w-0">

									<p
										class="text-sm font-medium text-gray-500"
									>
										WhatsApp
									</p>

									<p
										class="mt-1 text-lg font-bold text-white"
									>
										+265 997 245 335
									</p>

									<p
										class="mt-1 text-sm text-green-400"
									>
										Chat with us on WhatsApp →
									</p>

								</div>

							</a>


							<!-- EMAIL -->

							<a
								href="mailto:storesmlera@gmail.com"
								class="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-red-500/40 hover:bg-red-500/10"
							>

								<div
									class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/20 transition group-hover:scale-105 group-hover:bg-red-500"
								>

									<svg
										viewBox="0 0 24 24"
										class="h-6 w-6 fill-none stroke-current"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										aria-hidden="true"
									>
										<rect
											x="3"
											y="5"
											width="18"
											height="14"
											rx="2"
										></rect>

										<polyline
											points="3,7 12,13 21,7"
										></polyline>

									</svg>

								</div>


								<div class="min-w-0">

									<p
										class="text-sm font-medium text-gray-500"
									>
										Email
									</p>

									<p
										class="mt-1 break-all text-lg font-bold text-white"
									>
										storesmlera@gmail.com
									</p>

									<p
										class="mt-1 text-sm text-red-400"
									>
										Send us an email →
									</p>

								</div>

							</a>

						</div>

					</div>

				</div>


				<!-- =================================================
				     RIGHT
				================================================= -->

				<div
					class="flex flex-col justify-center bg-white p-8 sm:p-12"
				>

					<p
						class="text-sm font-bold uppercase tracking-widest text-red-600"
					>
						Visit or Contact Us
					</p>


					<h3
						class="mt-3 text-3xl font-black text-zinc-900"
					>
						We're ready to help.
					</h3>


					<p
						class="mt-4 leading-7 text-zinc-600"
					>
						Contact us directly and we'll get back to
						you as soon as possible.
					</p>


					<!-- QUICK ACTIONS -->

					<div class="mt-8 space-y-3">


						<!-- WHATSAPP BUTTON -->

						<a
							href="https://wa.me/265997245335"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center justify-center gap-3 rounded-xl bg-green-500 px-6 py-4 font-bold text-white shadow-lg shadow-green-500/20 transition duration-300 hover:-translate-y-0.5 hover:bg-green-600"
						>

							<svg
								viewBox="0 0 24 24"
								class="h-5 w-5 fill-current"
								aria-hidden="true"
							>
								<path
									d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.96L.06 24l6.28-1.65a11.86 11.86 0 0 0 5.71 1.46h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.17-1.23-6.15-3.43-8.43ZM12.06 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.73.98 1-3.64-.23-.37a9.85 9.85 0 0 1-1.51-5.28c0-5.47 4.45-9.92 9.93-9.92 2.65 0 5.14 1.03 7.01 2.91a9.86 9.86 0 0 1 2.9 7.02c0 5.46-4.45 9.91-9.92 9.91Zm5.43-7.43c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.08 4.5.71.31 1.27.5 1.7.64.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"
								/>
							</svg>

							Chat on WhatsApp

						</a>


						<!-- EMAIL BUTTON -->

						<a
							href="mailto:storesmlera@gmail.com"
							class="flex items-center justify-center gap-3 rounded-xl bg-zinc-900 px-6 py-4 font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-zinc-800"
						>

							<svg
								viewBox="0 0 24 24"
								class="h-5 w-5 fill-none stroke-current"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
							>
								<rect
									x="3"
									y="5"
									width="18"
									height="14"
									rx="2"
								></rect>

								<polyline
									points="3,7 12,13 21,7"
								></polyline>

							</svg>

							Email Mlera AutoCare

						</a>

					</div>


					<!-- LOCATION -->

					<div
						class="mt-8 border-t border-zinc-200 pt-6"
					>

						<p
							class="text-sm font-semibold text-zinc-900"
						>
							📍 Location
						</p>

						<p
							class="mt-2 text-sm leading-6 text-zinc-600"
						>
							Mlera, Malawi
						</p>

					</div>

				</div>

			</div>

		</div>

	</div>
</section>


<!-- =========================================================
     FOOTER
========================================================= -->

<footer
	class="border-t border-zinc-800 bg-zinc-950 px-6 py-8"
>

	<div
		class="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-gray-500 sm:flex-row"
	>

		<p>
			© {new Date().getFullYear()}
			Mlera AutoCare. All rights reserved.
		</p>

		<p>
			Professional Automotive Care
		</p>

	</div>

</footer>


<!-- =========================================================
     SLIDESHOW CSS
========================================================= -->

<style>

	/* ---------------------------------------------------------
	   Base slide
	--------------------------------------------------------- */

	.hero-slide {

		opacity: 0;

		transform: scale(1.10);

		transition:
			opacity 1.5s ease-in-out,
			transform 6s ease-out;

	}


	/* ---------------------------------------------------------
	   Active slide
	--------------------------------------------------------- */

	.hero-slide.active {

		opacity: 1;

		transform: scale(1);

	}


	/* ---------------------------------------------------------
	   Image
	--------------------------------------------------------- */

	.hero-slide img {

		width: 100%;

		height: 100%;

		object-fit: cover;

	}


	/* ---------------------------------------------------------
	   Slide dots
	--------------------------------------------------------- */

	.slide-dot {

		width: 8px;

		height: 8px;

		border-radius: 9999px;

		background: rgba(255, 255, 255, 0.35);

		border: none;

		padding: 0;

		cursor: pointer;

		transition:
			width 0.4s ease,
			background 0.4s ease;

	}


	/* ---------------------------------------------------------
	   Active dot
	--------------------------------------------------------- */

	.slide-dot.active-dot {

		width: 32px;

		background: rgb(239, 68, 68);

	}


	/* ---------------------------------------------------------
	   Accessibility
	--------------------------------------------------------- */

	@media (prefers-reduced-motion: reduce) {

		.hero-slide {

			transition:
				opacity 0.3s ease;

			transform: none;

		}

		.hero-slide.active {

			transform: none;

		}

	}

</style>