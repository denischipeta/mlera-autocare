<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import {
		ArrowRight,
		ArrowUp,
		Calendar,
		Car,
		Check,
		ChevronDown,
		Clock,
		Disc,
		Droplets,
		Gauge,
		Mail,
		MapPin,
		Menu,
		MessageCircle,
		Package,
		Phone,
		ShieldCheck,
		ShoppingBag,
		Store,
		Truck,
		Wrench,
		X,
		Zap
	} from 'lucide-svelte';

	/* =========================================================
	   IMAGES
	========================================================= */

	import carService from '$lib/assets/images/autocare/Fluids.jpeg';
	import mechanic from '$lib/assets/images/autocare/Manyaparts.jpeg';
	import engine from '$lib/assets/images/autocare/NGK Spark Plug.jpeg';
	import oilChange from '$lib/assets/images/autocare/toyoyaParts.jpg';

	import autoElectrical from '$lib/assets/images/autocare/autoElectrical.jpeg';
	import suspension from '$lib/assets/images/autocare/mazda-suspension.jpg';
	import brakes from '$lib/assets/images/autocare/brakes.jpeg';
	import oilService from '$lib/assets/images/autocare/Oils.jpg';
	import generalRepair from '$lib/assets/images/autocare/GeneralRepair.jpg';
	import diagnostics from '$lib/assets/images/autocare/diagonostics.jpeg';

	import storeIllustration from '$lib/assets/images/autocare/illustration.jpeg';
	import autoZone from '$lib/assets/images/autocare/autoZone.jpeg';

	/* =========================================================
	   BUSINESS DETAILS (edit here)
	========================================================= */

	const WHATSAPP_NUMBER = '265997245335';
	const PHONE_DISPLAY = '+265 997 245 335';
	const EMAIL = 'storesmlera@gmail.com';
	const LOCATION = 'Mlera, Malawi';
	const MAPS_LINK = 'https://www.google.com/maps/search/?api=1&query=Mlera+AutoCare+Malawi';

	// Day numbers: 0 = Sunday, 1 = Monday ... 6 = Saturday
	const OPENING_HOURS = [
		{ days: 'Monday – Saturday', dayNumbers: [1, 2, 3, 4, 5, 6], open: '07:00', close: '16:30' },
		{ days: 'Sunday', dayNumbers: [0], open: '08:00', close: '14:30' }
	];

	/* =========================================================
	   OPEN NOW / CLOSED (Malawi time)
	========================================================= */

	let openStatus = { isOpen: false, text: '' };
	let currentDay = -1;

	function toMinutes(time: string) {
		const [hours, minutes] = time.split(':').map(Number);
		return hours * 60 + minutes;
	}

	function formatTime(time: string) {
		const [hours, minutes] = time.split(':').map(Number);
		const suffix = hours >= 12 ? 'pm' : 'am';
		const hour12 = hours % 12 || 12;
		return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`;
	}

	function hoursFor(day: number) {
		return OPENING_HOURS.find((entry) => entry.dayNumbers.includes(day));
	}

	function updateOpenStatus() {
		const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Blantyre' }));
		const day = now.getDay();
		const minutesNow = now.getHours() * 60 + now.getMinutes();
		const today = hoursFor(day);

		currentDay = day;

		if (today && minutesNow >= toMinutes(today.open) && minutesNow < toMinutes(today.close)) {
			openStatus = { isOpen: true, text: `Open now · closes ${formatTime(today.close)}` };
			return;
		}

		if (today && minutesNow < toMinutes(today.open)) {
			openStatus = { isOpen: false, text: `Closed · opens today at ${formatTime(today.open)}` };
			return;
		}

		for (let offset = 1; offset <= 7; offset++) {
			const nextDay = (day + offset) % 7;
			const next = hoursFor(nextDay);

			if (next) {
				const when =
					offset === 1
						? 'tomorrow'
						: new Date(2024, 0, 7 + nextDay).toLocaleDateString('en-GB', { weekday: 'long' });

				openStatus = { isOpen: false, text: `Closed · opens ${when} at ${formatTime(next.open)}` };
				return;
			}
		}

		openStatus = { isOpen: false, text: 'Closed' };
	}

	function whatsappLink(message = '') {
		return message
			? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
			: `https://wa.me/${WHATSAPP_NUMBER}`;
	}

	/* =========================================================
	   HEADER / SCROLL
	========================================================= */

	let scrollY = 0;
	let menuOpen = false;

	$: scrolled = scrollY > 40;

	const navLinks = [
		{ href: '#services', label: 'Services' },
		{ href: '#how', label: 'How It Works' },
		{ href: '#shop', label: 'Shop' },
		{ href: '#about', label: 'About' },
		{ href: '#contact', label: 'Contact' }
	];

	/* =========================================================
	   HERO SLIDESHOW
	========================================================= */

	const heroImages = [
		{ src: carService, alt: 'Automotive fluids and lubricants' },
		{ src: mechanic, alt: 'Automotive spare parts' },
		{ src: engine, alt: 'NGK spark plugs' },
		{ src: oilChange, alt: 'Toyota automotive parts' }
	];

	let activeImage = 0;
	let slideTimer: ReturnType<typeof setInterval>;
	let touchStartX = 0;

	function nextImage() {
		activeImage = (activeImage + 1) % heroImages.length;
	}

	function previousImage() {
		activeImage = activeImage === 0 ? heroImages.length - 1 : activeImage - 1;
	}

	function goToImage(index: number) {
		activeImage = index;
		startSlideshow();
	}

	function startSlideshow() {
		clearInterval(slideTimer);
		slideTimer = setInterval(nextImage, 5000);
	}

	function handleSwipe(endX: number) {
		const distance = endX - touchStartX;
		if (Math.abs(distance) < 50) return;

		if (distance < 0) nextImage();
		else previousImage();

		startSlideshow();
	}

	/* =========================================================
	   SERVICES
	========================================================= */

	const services = [
		{
			icon: Wrench,
			image: generalRepair,
			title: 'General Repairs',
			description: 'Reliable repairs for everyday vehicle problems and mechanical faults.'
		},
		{
			icon: Gauge,
			image: diagnostics,
			title: 'Vehicle Diagnostics',
			description:
				'Professional vehicle diagnostics and fault detection to identify problems accurately.'
		},
		{
			icon: Droplets,
			image: oilService,
			title: 'Oil & Filter Service',
			description: 'Keep your engine running smoothly with quality lubricants and filters.'
		},
		{
			icon: Disc,
			image: brakes,
			title: 'Brake Service',
			description: 'Brake inspection, repairs and replacement for safer driving.'
		},
		{
			icon: Car,
			image: suspension,
			title: 'Suspension',
			description: 'Suspension inspection and repair for a smoother and safer ride.'
		},
		{
			icon: Zap,
			image: autoElectrical,
			title: 'Auto Electrical',
			description: 'Electrical troubleshooting, diagnostics and repairs for your vehicle.'
		}
	];

	let activeService = 0;

	$: currentService = services[activeService];

	/* =========================================================
	   BOOKING FORM
	========================================================= */

	let booking = {
		service: '',
		vehicle: '',
		date: '',
		name: '',
		phone: '',
		notes: ''
	};

	let bookingError = '';
	let bookingSent = false;
	let today = '';
	let nameInput: HTMLInputElement;

	function bookService(title: string) {
		booking.service = title;
		bookingSent = false;

		document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

		setTimeout(() => nameInput?.focus({ preventScroll: true }), 600);
	}

	function submitBooking() {
		bookingError = '';

		if (!booking.service) {
			bookingError = 'Please choose the service you need.';
			return;
		}

		if (!booking.name.trim() || !booking.phone.trim()) {
			bookingError = 'Please enter your name and phone number.';
			return;
		}

		const dateText = booking.date
			? new Date(`${booking.date}T00:00`).toLocaleDateString('en-GB', {
					weekday: 'short',
					day: 'numeric',
					month: 'short',
					year: 'numeric'
				})
			: 'Flexible';

		const message = [
			'*MLERA AUTOCARE – SERVICE BOOKING*',
			'',
			`Service: ${booking.service}`,
			`Vehicle: ${booking.vehicle.trim() || 'Not provided'}`,
			`Preferred date: ${dateText}`,
			'',
			`Name: ${booking.name.trim()}`,
			`Phone: ${booking.phone.trim()}`,
			booking.notes.trim() ? `\nProblem / notes: ${booking.notes.trim()}` : '',
			'',
			'Please confirm an available time. Thank you.'
		]
			.filter((line, index, lines) => line !== '' || lines[index - 1] !== '')
			.join('\n');

		window.open(whatsappLink(message), '_blank', 'noopener');
		bookingSent = true;
	}

	function resetBooking() {
		booking = { service: '', vehicle: '', date: '', name: '', phone: '', notes: '' };
		bookingSent = false;
		bookingError = '';
	}

	/* =========================================================
	   FEATURED PRODUCTS (live from the shop)
	========================================================= */

	type Product = {
		id: string;
		name: string;
		categoryName: string | null;
		sellingPrice: string | null;
		stockQuantity: number;
		imageUrl: string | null;
		active: boolean;
	};

	let featured: Product[] = [];
	let inStockCount = 0;
	let loadingFeatured = true;

	function formatPrice(value: string | null) {
		const price = Number(value ?? 0);
		if (price <= 0) return 'Price on request';
		return `MK ${new Intl.NumberFormat('en-MW').format(price)}`;
	}

	async function loadFeatured() {
		try {
			const response = await fetch('/api/products');
			if (!response.ok) throw new Error(String(response.status));

			const products: Product[] = await response.json();
			const available = products.filter((p) => p.active && p.stockQuantity > 0);

			inStockCount = available.length;

			// Products with an image and a price first
			featured = available
				.sort(
					(a, b) =>
						(b.imageUrl ? 2 : 0) +
						(Number(b.sellingPrice ?? 0) > 0 ? 1 : 0) -
						((a.imageUrl ? 2 : 0) + (Number(a.sellingPrice ?? 0) > 0 ? 1 : 0))
				)
				.slice(0, 4);
		} catch (error) {
			console.error('Could not load featured products:', error);
			featured = [];
		} finally {
			loadingFeatured = false;
		}
	}

	/* =========================================================
	   FAQ
	========================================================= */

	const faqs = [
		{
			question: 'How do I book a service?',
			answer:
				'Fill in the booking form on this page and press "Send Booking on WhatsApp". Your request opens in WhatsApp with all the details filled in, and we reply to confirm a time.'
		},
		{
			question: 'What are your opening hours?',
			answer: OPENING_HOURS.map(
				(entry) => `${entry.days}: ${formatTime(entry.open)} – ${formatTime(entry.close)}`
			).join('. ') + '.'
		},
		{
			question: 'How do I buy parts or lubricants?',
			answer:
				'Visit our online shop, add products to your cart and check out. Your order is sent to us on WhatsApp or by email, and we confirm availability and the final price.'
		},
		{
			question: 'Can I collect my order or have it delivered?',
			answer:
				'Yes. At checkout you can choose store pickup or delivery. For delivery, we confirm the arrangements with you after you send your order.'
		},
		{
			question: "I can't find the part I need. Can you help?",
			answer:
				'Send us a message on WhatsApp with your vehicle make, model and year, and the part you are looking for. A photo of the old part also helps.'
		},
		{
			question: "I'm not sure what's wrong with my car. What should I book?",
			answer:
				'Choose "Vehicle Diagnostics" and describe the problem in the notes. Our team will check the vehicle and advise you before doing any repairs.'
		}
	];

	let openFaq: number | null = 0;

	/* =========================================================
	   SCROLL-REVEAL ANIMATION
	========================================================= */

	function reveal(node: HTMLElement, delay = 0) {
		if (
			typeof IntersectionObserver === 'undefined' ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			return;
		}

		node.classList.add('reveal');
		node.style.transitionDelay = `${delay}ms`;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						node.classList.add('is-visible');
						observer.unobserve(node);
					}
				}
			},
			{ threshold: 0.12 }
		);

		observer.observe(node);

		return {
			destroy() {
				observer.disconnect();
			}
		};
	}

	/* =========================================================
	   INITIALIZE
	========================================================= */

	onMount(() => {
		startSlideshow();
		loadFeatured();
		updateOpenStatus();

		const statusTimer = setInterval(updateOpenStatus, 60_000);

		const now = new Date();
		today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

		return () => {
			clearInterval(slideTimer);
			clearInterval(statusTimer);
		};
	});
</script>

<svelte:window
	bind:scrollY
	onkeydown={(event) => {
		if (event.key === 'Escape') menuOpen = false;
	}}
/>

<svelte:head>
	<title>Mlera AutoCare | Car Service, Repairs & Auto Parts in Malawi</title>
	<meta
		name="description"
		content="Mlera AutoCare: vehicle servicing, diagnostics, brakes, suspension and auto electrical repairs, plus quality lubricants and spare parts from Mlera Stores. Book on WhatsApp."
	/>
	<meta property="og:title" content="Mlera AutoCare | Car Service, Repairs & Auto Parts" />
	<meta
		property="og:description"
		content="Book a vehicle service on WhatsApp or shop quality parts and lubricants online."
	/>
	<meta name="theme-color" content="#09090b" />
</svelte:head>

<!-- =========================================================
     HEADER
========================================================= -->

<header
	class={`fixed top-0 z-50 w-full transition-all duration-300 ${
		scrolled || menuOpen
			? 'border-b border-white/10 bg-zinc-950/90 shadow-lg backdrop-blur-xl'
			: 'border-b border-transparent bg-transparent'
	}`}
>
	<div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
		<a href="/" class="text-xl font-black tracking-tight text-white">
			MLERA <span class="text-red-500">AUTOCARE</span>
		</a>

		<!-- DESKTOP NAV -->

		<nav class="hidden items-center gap-7 text-sm font-medium text-gray-300 lg:flex">
			{#each navLinks as link}
				<a href={link.href} class="transition hover:text-white">{link.label}</a>
			{/each}
		</nav>

		<div class="flex items-center gap-2">
			<a
				href="#book"
				class="hidden items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 md:flex"
			>
				<Calendar size={16} />
				Book Service
			</a>

			<a
				href="/shop"
				class="group flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500"
			>
				<ShoppingBag size={17} strokeWidth={2.5} />
				<span>Shop</span>
				<ArrowRight size={15} class="hidden transition-transform group-hover:translate-x-1 sm:block" />
			</a>

			<button
				type="button"
				onclick={() => (menuOpen = !menuOpen)}
				class="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white transition hover:bg-white/10 lg:hidden"
				aria-label={menuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={menuOpen}
				aria-controls="mobile-menu"
			>
				{#if menuOpen}
					<X size={20} />
				{:else}
					<Menu size={20} />
				{/if}
			</button>
		</div>
	</div>

	<!-- MOBILE MENU -->

	{#if menuOpen}
		<nav
			id="mobile-menu"
			transition:fade={{ duration: 150 }}
			class="border-t border-white/10 bg-zinc-950 px-4 pb-6 pt-2 lg:hidden"
		>
			{#each navLinks as link}
				<a
					href={link.href}
					onclick={() => (menuOpen = false)}
					class="flex items-center justify-between border-b border-white/5 py-4 text-base font-semibold text-gray-200"
				>
					{link.label}
					<ArrowRight size={16} class="text-gray-500" />
				</a>
			{/each}

			<div class="mt-5 grid grid-cols-2 gap-3">
				<a
					href="#book"
					onclick={() => (menuOpen = false)}
					class="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white"
				>
					<Calendar size={16} />
					Book Service
				</a>
				<a
					href={whatsappLink()}
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-bold text-white"
				>
					<MessageCircle size={16} />
					WhatsApp
				</a>
			</div>
		</nav>
	{/if}
</header>

<!-- =========================================================
     HERO
========================================================= -->

<section
	id="home"
	class="relative flex min-h-[100svh] items-center overflow-hidden bg-black"
	ontouchstart={(event) => (touchStartX = event.touches[0].clientX)}
	ontouchend={(event) => handleSwipe(event.changedTouches[0].clientX)}
>
	<!-- SLIDES -->

	<div class="absolute inset-0">
		{#each heroImages as image, index}
			<div class="hero-slide absolute inset-0" class:active={index === activeImage}>
				<img
					src={image.src}
					alt={image.alt}
					class="h-full w-full object-cover"
					fetchpriority={index === 0 ? 'high' : 'auto'}
				/>
			</div>
		{/each}
	</div>

	<div class="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30"></div>
	<div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"></div>
	<div class="absolute -right-40 top-1/4 h-[500px] w-[500px] rounded-full bg-red-600/20 blur-[140px]"></div>

	<!-- CONTENT -->

	<div class="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-4 pb-28 pt-28 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:pt-32">
		<div>
			<div class="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 backdrop-blur-md">
				<span class="h-2 w-2 animate-pulse rounded-full bg-red-500"></span>
				Service · Repairs · Parts
			</div>

			<h1 class="text-5xl font-black leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-7xl">
				Your Car.
				<span class="block text-red-500">Our Expertise.</span>
			</h1>

			<p class="mt-6 max-w-xl text-lg leading-8 text-gray-300">
				Reliable vehicle servicing, professional repairs and quality automotive products, all
				in one place. Book in minutes on WhatsApp.
			</p>

			<div class="mt-8 flex flex-wrap gap-3">
				<a
					href="#book"
					class="group flex items-center gap-2 rounded-xl bg-red-600 px-6 py-4 font-bold text-white shadow-xl shadow-red-600/30 transition hover:-translate-y-0.5 hover:bg-red-500"
				>
					<Calendar size={19} />
					Book a Service
					<ArrowRight size={17} class="transition-transform group-hover:translate-x-1" />
				</a>

				<a
					href="/shop"
					class="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-4 font-semibold text-white backdrop-blur-md transition hover:bg-white/15"
				>
					<ShoppingBag size={18} />
					Shop Parts
				</a>
			</div>

			{#if openStatus.text}
				<div
					class={`mt-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold backdrop-blur-md ${
						openStatus.isOpen
							? 'border border-green-500/30 bg-green-500/10 text-green-300'
							: 'border border-white/15 bg-white/5 text-gray-300'
					}`}
				>
					<span
						class={`h-2 w-2 rounded-full ${openStatus.isOpen ? 'animate-pulse bg-green-400' : 'bg-gray-500'}`}
					></span>
					{openStatus.text}
				</div>
			{/if}

			<a
				href={`tel:+${WHATSAPP_NUMBER}`}
				class="mt-6 flex w-fit items-center gap-3 text-sm text-gray-300 transition hover:text-white"
			>
				<span class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
					<Phone size={17} />
				</span>
				<span>
					<span class="block text-xs text-gray-500">Call or WhatsApp</span>
					<span class="font-bold text-white">{PHONE_DISPLAY}</span>
				</span>
			</a>
		</div>

		<!-- QUICK HELP CARD -->

		<div class="w-full max-w-md rounded-3xl border border-white/15 bg-black/45 p-5 shadow-2xl backdrop-blur-xl sm:p-6 lg:justify-self-end">
			<p class="text-sm font-bold uppercase tracking-widest text-red-400">Quick help</p>
			<h2 class="mt-2 text-2xl font-black text-white">What do you need today?</h2>

			<div class="mt-5 space-y-3">
				<a
					href="#book"
					class="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-red-500/40 hover:bg-red-500/10"
				>
					<span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white">
						<Wrench size={22} />
					</span>
					<span class="min-w-0 flex-1">
						<span class="block font-bold text-white">Book a service or repair</span>
						<span class="block text-sm text-gray-400">Pick a service and a date</span>
					</span>
					<ArrowRight size={18} class="text-gray-500 transition group-hover:translate-x-1 group-hover:text-white" />
				</a>

				<a
					href="/shop"
					class="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-red-500/40 hover:bg-red-500/10"
				>
					<span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-zinc-900">
						<ShoppingBag size={22} />
					</span>
					<span class="min-w-0 flex-1">
						<span class="block font-bold text-white">Buy parts &amp; lubricants</span>
						<span class="block text-sm text-gray-400">
							{#if !loadingFeatured && inStockCount > 0}
								{inStockCount} products in stock now
							{:else}
								Browse our online shop
							{/if}
						</span>
					</span>
					<ArrowRight size={18} class="text-gray-500 transition group-hover:translate-x-1 group-hover:text-white" />
				</a>

				<a
					href={whatsappLink('Hello Mlera AutoCare, I have a question about my vehicle.')}
					target="_blank"
					rel="noopener noreferrer"
					class="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-green-500/40 hover:bg-green-500/10"
				>
					<span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white">
						<MessageCircle size={22} />
					</span>
					<span class="min-w-0 flex-1">
						<span class="block font-bold text-white">Ask us a question</span>
						<span class="block text-sm text-gray-400">Chat with our team on WhatsApp</span>
					</span>
					<ArrowRight size={18} class="text-gray-500 transition group-hover:translate-x-1 group-hover:text-white" />
				</a>
			</div>
		</div>
	</div>

	<!-- SLIDER CONTROLS -->

	<div class="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-4">
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

		<div class="flex items-center gap-2">
			{#each heroImages as _, index}
				<button
					type="button"
					onclick={() => goToImage(index)}
					aria-label={`Show slide ${index + 1}`}
					aria-current={index === activeImage}
					class="slide-dot"
					class:active-dot={index === activeImage}
				></button>
			{/each}
		</div>

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
</section>

<!-- =========================================================
     TRUST STRIP
========================================================= -->

<section class="border-b border-zinc-200 bg-white px-4 py-6 sm:px-6">
	<div class="mx-auto grid max-w-7xl grid-cols-2 gap-4 lg:grid-cols-4">
		{#each [
			{ icon: Wrench, title: 'Professional Service', text: 'Repairs done right' },
			{ icon: ShieldCheck, title: 'Quality Products', text: 'Lubricants, filters & spares' },
			{ icon: Store, title: 'Pickup or Delivery', text: 'For shop orders' },
			{ icon: MessageCircle, title: 'Easy Booking', text: 'Book on WhatsApp' }
		] as item, index}
			<div use:reveal={index * 80} class="flex items-center gap-3">
				<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
					<svelte:component this={item.icon} size={20} />
				</div>
				<div class="min-w-0">
					<p class="text-sm font-black text-zinc-900">{item.title}</p>
					<p class="text-xs text-zinc-500">{item.text}</p>
				</div>
			</div>
		{/each}
	</div>
</section>

<!-- =========================================================
     SERVICES (interactive explorer)
========================================================= -->

<section id="services" class="scroll-mt-20 bg-zinc-50 px-4 py-20 sm:px-6 lg:py-24">
	<div class="mx-auto max-w-7xl">
		<div use:reveal class="max-w-2xl">
			<p class="text-sm font-bold uppercase tracking-widest text-red-600">What We Do</p>
			<h2 class="mt-3 text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl">Our Services</h2>
			<p class="mt-4 text-lg leading-8 text-zinc-600">
				Choose a service to see what we do, then book it in one tap.
			</p>
		</div>

		<div use:reveal={100} class="mt-10 grid gap-6 lg:grid-cols-[320px_1fr]">
			<!-- SERVICE LIST -->

			<div
				class="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
				role="tablist"
				aria-label="Services"
			>
				{#each services as service, index}
					<button
						type="button"
						role="tab"
						aria-selected={activeService === index}
						onclick={() => (activeService = index)}
						class={`flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition lg:py-4 ${
							activeService === index
								? 'border-red-600 bg-red-600 text-white shadow-lg shadow-red-600/20'
								: 'border-zinc-200 bg-white text-zinc-800 hover:border-red-200 hover:text-red-600'
						}`}
					>
						<span
							class={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
								activeService === index ? 'bg-white/15' : 'bg-red-50 text-red-600'
							}`}
						>
							<svelte:component this={service.icon} size={19} />
						</span>
						<span class="whitespace-nowrap text-sm font-bold">{service.title}</span>
						<ArrowRight size={16} class={`ml-auto hidden lg:block ${activeService === index ? '' : 'text-zinc-300'}`} />
					</button>
				{/each}
			</div>

			<!-- SERVICE DETAIL -->

			<div class="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm" role="tabpanel">
				{#key activeService}
					<div in:fade={{ duration: 300 }} class="grid md:grid-cols-2">
						<div class="relative aspect-[4/3] overflow-hidden bg-zinc-100 md:aspect-auto md:min-h-[380px]">
							<img
								src={currentService.image}
								alt={currentService.title}
								class="absolute inset-0 h-full w-full object-cover"
								loading="lazy"
							/>
							<div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
							<span class="absolute bottom-4 left-4 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
								Mlera AutoCare
							</span>
						</div>

						<div class="flex flex-col p-6 sm:p-8">
							<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
								<svelte:component this={currentService.icon} size={24} />
							</div>

							<h3 class="mt-5 text-2xl font-black text-zinc-900 sm:text-3xl">
								{currentService.title}
							</h3>

							<p class="mt-3 leading-7 text-zinc-600">{currentService.description}</p>

							<div class="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
								<button
									type="button"
									onclick={() => bookService(currentService.title)}
									class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-red-500"
								>
									<Calendar size={17} />
									Book This Service
								</button>

								<a
									href={whatsappLink(`Hello Mlera AutoCare, I'd like to ask about ${currentService.title}.`)}
									target="_blank"
									rel="noopener noreferrer"
									class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 px-5 py-3.5 text-sm font-bold text-zinc-700 transition hover:border-green-300 hover:text-green-700"
								>
									<MessageCircle size={17} />
									Ask a Question
								</a>
							</div>
						</div>
					</div>
				{/key}
			</div>
		</div>
	</div>
</section>

<!-- =========================================================
     HOW IT WORKS
========================================================= -->

<section id="how" class="scroll-mt-20 bg-white px-4 py-20 sm:px-6 lg:py-24">
	<div class="mx-auto max-w-7xl">
		<div use:reveal class="mx-auto max-w-2xl text-center">
			<p class="text-sm font-bold uppercase tracking-widest text-red-600">Simple &amp; Fast</p>
			<h2 class="mt-3 text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl">How It Works</h2>
		</div>

		<div class="mt-12 grid gap-5 md:grid-cols-3">
			{#each [
				{ icon: Wrench, title: 'Choose your service', text: 'Pick the service you need, or Diagnostics if you are not sure what is wrong.' },
				{ icon: MessageCircle, title: 'Send your request', text: 'Fill in the short form. It opens WhatsApp with your booking ready to send.' },
				{ icon: Check, title: 'We confirm & get to work', text: 'Our team replies to confirm a time, then takes care of your vehicle.' }
			] as step, index}
				<div
					use:reveal={index * 120}
					class="relative rounded-3xl border border-zinc-200 bg-zinc-50 p-7 transition hover:-translate-y-1 hover:border-red-200 hover:bg-white hover:shadow-xl"
				>
					<span class="absolute right-6 top-5 text-6xl font-black text-zinc-200/80">
						{index + 1}
					</span>

					<div class="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white">
						<svelte:component this={step.icon} size={22} />
					</div>

					<h3 class="relative mt-6 text-xl font-black text-zinc-900">{step.title}</h3>
					<p class="relative mt-2 leading-7 text-zinc-600">{step.text}</p>
				</div>
			{/each}
		</div>

		<div use:reveal={200} class="mt-10 text-center">
			<a
				href="#book"
				class="group inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-4 font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500"
			>
				Start Your Booking
				<ArrowRight size={17} class="transition-transform group-hover:translate-x-1" />
			</a>
		</div>
	</div>
</section>

<!-- =========================================================
     SHOP (live products)
========================================================= -->

<section id="shop" class="scroll-mt-20 bg-zinc-950 px-4 py-20 sm:px-6 lg:py-24">
	<div class="relative mx-auto max-w-7xl">
		<div class="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-red-600/20 blur-3xl"></div>

		<div use:reveal class="relative flex flex-wrap items-end justify-between gap-6">
			<div class="max-w-2xl">
				<p class="text-sm font-bold uppercase tracking-widest text-red-500">Mlera Stores</p>
				<h2 class="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
					Everything your vehicle needs.
				</h2>
				<p class="mt-4 text-lg leading-8 text-gray-400">
					Quality lubricants, spare parts, filters, spark plugs and accessories. Order online
					for pickup or delivery.
				</p>
			</div>

			<a
				href="/shop"
				class="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-zinc-900 transition hover:bg-red-500 hover:text-white"
			>
				<ShoppingBag size={18} />
				Visit the Shop
				<ArrowRight size={16} class="transition-transform group-hover:translate-x-1" />
			</a>
		</div>

		<div class="relative mt-10">
			{#if loadingFeatured}
				<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
					{#each Array(4) as _}
						<div class="overflow-hidden rounded-2xl bg-white/5">
							<div class="aspect-square animate-pulse bg-white/10"></div>
							<div class="space-y-2 p-4">
								<div class="h-4 w-3/4 animate-pulse rounded bg-white/10"></div>
								<div class="h-4 w-1/2 animate-pulse rounded bg-white/10"></div>
							</div>
						</div>
					{/each}
				</div>
			{:else if featured.length > 0}
				<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
					{#each featured as product, index (product.id)}
						<a
							use:reveal={index * 80}
							href={`/shop/${product.id}`}
							class="group flex flex-col overflow-hidden rounded-2xl bg-white transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-600/10"
						>
							<div class="aspect-square bg-white">
								{#if product.imageUrl}
									<img
										src={product.imageUrl}
										alt={product.name}
										loading="lazy"
										class="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105"
									/>
								{:else}
									<div class="flex h-full w-full items-center justify-center bg-zinc-50 text-zinc-300">
										<Package size={48} />
									</div>
								{/if}
							</div>

							<div class="flex flex-1 flex-col border-t border-zinc-100 p-4">
								{#if product.categoryName}
									<p class="truncate text-[11px] font-semibold text-zinc-400">{product.categoryName}</p>
								{/if}
								<h3 class="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-zinc-800 group-hover:text-red-600">
									{product.name}
								</h3>
								<p class="mt-auto pt-3 text-base font-black text-zinc-950">
									{formatPrice(product.sellingPrice)}
								</p>
							</div>
						</a>
					{/each}
				</div>
			{:else}
				<a
					href="/shop"
					class="group block overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2"
				>
					<img
						src={autoZone}
						alt="Mlera Stores automotive products"
						class="h-64 w-full rounded-2xl object-cover transition duration-700 group-hover:scale-[1.02] sm:h-80"
						loading="lazy"
					/>
				</a>
			{/if}
		</div>

		<div use:reveal class="relative mt-8 grid gap-3 sm:grid-cols-3">
			<div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
				<Store size={20} class="shrink-0 text-red-500" />
				<span class="text-sm font-semibold">Collect in-store</span>
			</div>
			<div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
				<Truck size={20} class="shrink-0 text-red-500" />
				<span class="text-sm font-semibold">Delivery available</span>
			</div>
			<div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
				<MessageCircle size={20} class="shrink-0 text-red-500" />
				<span class="text-sm font-semibold">Order via WhatsApp or email</span>
			</div>
		</div>
	</div>
</section>

<!-- =========================================================
     ABOUT
========================================================= -->

<section id="about" class="scroll-mt-20 bg-white px-4 py-20 sm:px-6 lg:py-24">
	<div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
		<div use:reveal class="relative">
			<div class="overflow-hidden rounded-3xl shadow-2xl">
				<img
					src={storeIllustration}
					alt="Mlera Stores automotive products"
					class="h-full w-full object-cover"
					loading="lazy"
				/>
			</div>

			<div class="absolute -bottom-6 -right-2 hidden rounded-2xl bg-red-600 px-6 py-5 text-white shadow-xl sm:block">
				<p class="text-xs font-bold uppercase tracking-widest text-red-100">Mlera AutoCare</p>
				<p class="mt-1 text-lg font-black">Service + Parts</p>
			</div>
		</div>

		<div use:reveal={120}>
			<p class="text-sm font-bold uppercase tracking-widest text-red-600">About Us</p>
			<h2 class="mt-3 text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl">
				Care for your car.
				<span class="block text-red-600">Care for you.</span>
			</h2>

			<p class="mt-6 text-lg leading-8 text-zinc-600">
				At Mlera AutoCare, our goal is simple: provide dependable automotive services and
				quality vehicle products that give our customers confidence on the road.
			</p>

			<div class="mt-8 grid grid-cols-2 gap-3">
				{#each ['Professional Service', 'Quality Products', 'Fair Pricing', 'Reliable Repairs'] as point}
					<div class="flex items-center gap-3 rounded-2xl border border-zinc-200 p-4 transition hover:border-red-200 hover:bg-red-50/40">
						<span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
							<Check size={16} strokeWidth={3} />
						</span>
						<span class="text-sm font-bold text-zinc-900">{point}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- =========================================================
     BOOKING + CONTACT
========================================================= -->

<section id="contact" class="scroll-mt-20 bg-zinc-100 px-4 py-20 sm:px-6 lg:py-24">
	<div class="mx-auto max-w-7xl">
		<div use:reveal class="mx-auto max-w-2xl text-center">
			<p class="text-sm font-bold uppercase tracking-widest text-red-600">Get In Touch</p>
			<h2 class="mt-3 text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl">
				Book a Service
			</h2>
			<p class="mt-4 text-lg leading-8 text-zinc-600">
				Tell us what you need. Your booking opens in WhatsApp, ready to send.
			</p>
		</div>

		<div class="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
			<!-- BOOKING FORM -->

			<div id="book" use:reveal class="scroll-mt-24 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
				{#if bookingSent}
					<div class="flex h-full flex-col items-center justify-center py-10 text-center" in:fade>
						<div class="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white">
							<Check size={30} strokeWidth={3} />
						</div>

						<h3 class="mt-5 text-2xl font-black text-zinc-900">Booking ready to send</h3>

						<p class="mt-2 max-w-sm leading-7 text-zinc-600">
							Press send in WhatsApp to deliver your request for
							<strong class="text-zinc-900">{booking.service}</strong>. We will reply to confirm
							a time.
						</p>

						<div class="mt-7 flex flex-wrap justify-center gap-3">
							<button
								type="button"
								onclick={submitBooking}
								class="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-500"
							>
								<MessageCircle size={17} />
								Open WhatsApp Again
							</button>

							<button
								type="button"
								onclick={resetBooking}
								class="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
							>
								New Booking
							</button>
						</div>
					</div>
				{:else}
					<form
						onsubmit={(event) => {
							event.preventDefault();
							submitBooking();
						}}
						novalidate
					>
						<h3 class="text-xl font-black text-zinc-900">Your booking</h3>

						<!-- SERVICE PICKER -->

						<fieldset class="mt-5">
							<legend class="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
								1. Choose a service *
							</legend>

							<div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
								{#each [...services.map((s) => s.title), 'Other / Not sure'] as option}
									<label
										class={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-center text-xs font-bold transition sm:text-sm ${
											booking.service === option
												? 'border-red-600 bg-red-600 text-white'
												: 'border-zinc-200 bg-white text-zinc-700 hover:border-red-200 hover:text-red-600'
										}`}
									>
										<input
											type="radio"
											name="service"
											value={option}
											bind:group={booking.service}
											class="sr-only"
										/>
										{option}
									</label>
								{/each}
							</div>
						</fieldset>

						<!-- VEHICLE + DATE -->

						<p class="mb-3 mt-7 text-xs font-bold uppercase tracking-wider text-zinc-500">
							2. Your vehicle
						</p>

						<div class="grid gap-4 sm:grid-cols-2">
							<div>
								<label for="vehicle" class="mb-2 block text-xs font-bold text-zinc-600">
									Make, model &amp; year
								</label>
								<input
									id="vehicle"
									type="text"
									bind:value={booking.vehicle}
									placeholder="e.g. Toyota Corolla 2010"
									class="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
								/>
							</div>

							<div>
								<label for="date" class="mb-2 block text-xs font-bold text-zinc-600">
									Preferred date
								</label>
								<input
									id="date"
									type="date"
									min={today}
									bind:value={booking.date}
									class="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
								/>
							</div>
						</div>

						<!-- CONTACT -->

						<p class="mb-3 mt-7 text-xs font-bold uppercase tracking-wider text-zinc-500">
							3. Your details
						</p>

						<div class="grid gap-4 sm:grid-cols-2">
							<div>
								<label for="name" class="mb-2 block text-xs font-bold text-zinc-600">
									Full name *
								</label>
								<input
									id="name"
									type="text"
									autocomplete="name"
									bind:this={nameInput}
									bind:value={booking.name}
									placeholder="Your name"
									class="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
								/>
							</div>

							<div>
								<label for="phone" class="mb-2 block text-xs font-bold text-zinc-600">
									Phone number *
								</label>
								<input
									id="phone"
									type="tel"
									autocomplete="tel"
									bind:value={booking.phone}
									placeholder="+265..."
									class="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
								/>
							</div>
						</div>

						<div class="mt-4">
							<label for="notes" class="mb-2 block text-xs font-bold text-zinc-600">
								Describe the problem (optional)
							</label>
							<textarea
								id="notes"
								rows="3"
								bind:value={booking.notes}
								placeholder="e.g. Squeaking when braking, engine light is on..."
								class="w-full resize-none rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
							></textarea>
						</div>

						{#if bookingError}
							<p class="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
								{bookingError}
							</p>
						{/if}

						<button
							type="submit"
							class="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-500"
						>
							<MessageCircle size={19} />
							Send Booking on WhatsApp
						</button>

						<p class="mt-3 text-center text-xs text-zinc-500">
							Nothing is sent until you press send in WhatsApp.
						</p>
					</form>
				{/if}
			</div>

			<!-- CONTACT CARDS -->

			<div use:reveal={120} class="flex flex-col gap-4 rounded-3xl bg-zinc-950 p-6 text-white sm:p-8">
				<div>
					<p class="text-sm font-bold uppercase tracking-widest text-red-500">Contact Us</p>
					<h3 class="mt-2 text-2xl font-black">We're ready to help.</h3>
					<p class="mt-2 text-sm leading-6 text-gray-400">
						Questions about a repair, a part or an order? Reach us directly.
					</p>
				</div>

				<a
					href={whatsappLink()}
					target="_blank"
					rel="noopener noreferrer"
					class="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-green-500/40 hover:bg-green-500/10"
				>
					<span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500">
						<MessageCircle size={22} />
					</span>
					<span class="min-w-0">
						<span class="block text-xs text-gray-500">WhatsApp</span>
						<span class="block font-bold">{PHONE_DISPLAY}</span>
						<span class="block text-xs text-green-400">Chat with us →</span>
					</span>
				</a>

				<a
					href={`tel:+${WHATSAPP_NUMBER}`}
					class="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-red-500/40 hover:bg-red-500/10"
				>
					<span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-zinc-900">
						<Phone size={20} />
					</span>
					<span class="min-w-0">
						<span class="block text-xs text-gray-500">Call</span>
						<span class="block font-bold">{PHONE_DISPLAY}</span>
						<span class="block text-xs text-gray-400">Tap to call →</span>
					</span>
				</a>

				<a
					href={`mailto:${EMAIL}`}
					class="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-red-500/40 hover:bg-red-500/10"
				>
					<span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600">
						<Mail size={20} />
					</span>
					<span class="min-w-0">
						<span class="block text-xs text-gray-500">Email</span>
						<span class="block break-all font-bold">{EMAIL}</span>
						<span class="block text-xs text-red-400">Send us an email →</span>
					</span>
				</a>

				<a
					href={MAPS_LINK}
					target="_blank"
					rel="noopener noreferrer"
					class="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-red-500/40 hover:bg-red-500/10"
				>
					<span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-800">
						<MapPin size={20} />
					</span>
					<span class="min-w-0">
						<span class="block text-xs text-gray-500">Location</span>
						<span class="block font-bold">{LOCATION}</span>
						<span class="block text-xs text-gray-400">Open in Google Maps →</span>
					</span>
				</a>

				<!-- OPENING HOURS -->

				<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
					<div class="flex flex-wrap items-center justify-between gap-2">
						<span class="flex items-center gap-2 text-sm font-bold">
							<Clock size={18} class="text-red-500" />
							Opening Hours
						</span>

						{#if openStatus.text}
							<span
								class={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
									openStatus.isOpen ? 'bg-green-500/15 text-green-400' : 'bg-white/10 text-gray-400'
								}`}
							>
								{openStatus.isOpen ? 'Open now' : 'Closed now'}
							</span>
						{/if}
					</div>

					<div class="mt-3 space-y-2">
						{#each OPENING_HOURS as entry}
							<div
								class={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm ${
									entry.dayNumbers.includes(currentDay) ? 'bg-white/10 text-white' : 'text-gray-400'
								}`}
							>
								<span class="font-semibold">{entry.days}</span>
								<span>{formatTime(entry.open)} – {formatTime(entry.close)}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- =========================================================
     FAQ
========================================================= -->

<section id="faq" class="bg-white px-4 py-20 sm:px-6 lg:py-24">
	<div class="mx-auto max-w-3xl">
		<div use:reveal class="text-center">
			<p class="text-sm font-bold uppercase tracking-widest text-red-600">FAQ</p>
			<h2 class="mt-3 text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl">
				Common Questions
			</h2>
		</div>

		<div use:reveal={100} class="mt-10 divide-y divide-zinc-200 rounded-3xl border border-zinc-200">
			{#each faqs as faq, index}
				<div>
					<button
						type="button"
						onclick={() => (openFaq = openFaq === index ? null : index)}
						aria-expanded={openFaq === index}
						aria-controls={`faq-${index}`}
						class="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
					>
						<span class="font-bold text-zinc-900">{faq.question}</span>
						<ChevronDown
							size={20}
							class={`shrink-0 text-zinc-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-red-600' : ''}`}
						/>
					</button>

					<div
						id={`faq-${index}`}
						class="faq-panel grid px-5 sm:px-6"
						class:open={openFaq === index}
					>
						<div class="overflow-hidden">
							<p class="pb-5 leading-7 text-zinc-600">{faq.answer}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<p use:reveal class="mt-8 text-center text-zinc-600">
			Still have a question?
			<a
				href={whatsappLink('Hello Mlera AutoCare, I have a question.')}
				target="_blank"
				rel="noopener noreferrer"
				class="font-bold text-green-700 underline underline-offset-4"
			>
				Ask us on WhatsApp
			</a>
		</p>
	</div>
</section>

<!-- =========================================================
     FOOTER
========================================================= -->

<footer class="bg-zinc-950 px-4 pb-8 pt-14 text-white sm:px-6">
	<div class="mx-auto max-w-7xl">
		<div class="grid gap-10 md:grid-cols-3">
			<div>
				<p class="text-xl font-black">MLERA <span class="text-red-500">AUTOCARE</span></p>
				<p class="mt-3 max-w-sm text-sm leading-6 text-gray-400">
					Vehicle servicing, repairs and quality automotive products from Mlera Stores.
				</p>
			</div>

			<div>
				<p class="text-sm font-black uppercase tracking-wider">Quick Links</p>
				<div class="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-400">
					{#each navLinks as link}
						<a href={link.href} class="transition hover:text-red-500">{link.label}</a>
					{/each}
					<a href="#book" class="transition hover:text-red-500">Book a Service</a>
					<a href="/shop" class="transition hover:text-red-500">Online Shop</a>
				</div>
			</div>

			<div>
				<p class="text-sm font-black uppercase tracking-wider">Contact</p>
				<div class="mt-4 space-y-3 text-sm text-gray-400">
					<a href={whatsappLink()} target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 hover:text-white">
						<MessageCircle size={16} class="text-green-500" />
						{PHONE_DISPLAY}
					</a>
					<a href={`mailto:${EMAIL}`} class="flex items-center gap-2 hover:text-white">
						<Mail size={16} class="text-red-500" />
						{EMAIL}
					</a>
					<p class="flex items-center gap-2">
						<MapPin size={16} class="text-red-500" />
						{LOCATION}
					</p>
					{#each OPENING_HOURS as entry}
						<p class="flex items-start gap-2">
							<Clock size={16} class="mt-0.5 shrink-0 text-red-500" />
							<span>
								{entry.days}: {formatTime(entry.open)} – {formatTime(entry.close)}
							</span>
						</p>
					{/each}
				</div>
			</div>
		</div>

		<div class="mt-12 flex flex-col justify-between gap-2 border-t border-zinc-800 pt-6 text-xs text-gray-500 sm:flex-row">
			<p>© {new Date().getFullYear()} Mlera AutoCare. All rights reserved.</p>
			<p>Professional Automotive Care</p>
		</div>
	</div>
</footer>

<!-- =========================================================
     FLOATING ACTIONS
========================================================= -->

<div class="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
	{#if scrollY > 700}
		<button
			type="button"
			transition:fade={{ duration: 200 }}
			onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
			class="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg ring-1 ring-white/10 transition hover:bg-zinc-800"
			aria-label="Back to top"
		>
			<ArrowUp size={19} />
		</button>
	{/if}

	<a
		href={whatsappLink('Hello Mlera AutoCare!')}
		target="_blank"
		rel="noopener noreferrer"
		class="group flex h-14 items-center gap-2 rounded-full bg-green-500 pl-4 pr-4 text-white shadow-xl shadow-green-600/30 transition hover:bg-green-400 sm:pr-5"
		aria-label="Chat with us on WhatsApp"
	>
		<MessageCircle size={24} />
		<span class="hidden text-sm font-bold sm:inline">Chat with us</span>
	</a>
</div>

<!-- =========================================================
     STYLES
========================================================= -->

<style>
	.hero-slide {
		opacity: 0;
		transform: scale(1.1);
		transition:
			opacity 1.5s ease-in-out,
			transform 6s ease-out;
	}

	.hero-slide.active {
		opacity: 1;
		transform: scale(1);
	}

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

	.slide-dot.active-dot {
		width: 32px;
		background: rgb(239, 68, 68);
	}

	/* FAQ accordion: animates height with grid rows */
	.faq-panel {
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.3s ease;
	}

	.faq-panel.open {
		grid-template-rows: 1fr;
	}

	/* Scroll reveal (added by the reveal action; content stays visible without JS) */
	:global(.reveal) {
		opacity: 0;
		transform: translateY(24px);
		transition:
			opacity 0.7s ease,
			transform 0.7s ease;
	}

	:global(.reveal.is-visible) {
		opacity: 1;
		transform: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-slide,
		.hero-slide.active {
			transform: none;
			transition: opacity 0.3s ease;
		}

		.faq-panel {
			transition: none;
		}
	}
</style>