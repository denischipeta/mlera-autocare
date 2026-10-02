
<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ArrowLeft,
		LogOut,
		CheckCircle2,
		ShieldCheck,
		UserCircle,
		ChevronDown,
		User,
		Mail,
		Shield
	} from 'lucide-svelte';

	export let pageTitle = 'Admin Dashboard';
	export let pageLabel = 'Mlera Stores';

	type AdminUser = {
		id?: string;
		full_name?: string;
		fullName?: string;
		email?: string;
		role?: string;
	};

	let userMenuOpen = false;
	let adminUser: AdminUser | null = null;
	let loadingUser = true;

	let loggingOut = false;
	let logoutSuccessful = false;
	let logoutError = '';

	async function loadAdminUser() {
		try {
			const response = await fetch('/api/admin/me');

			if (!response.ok) {
				throw new Error('Unable to load user');
			}

			const data = await response.json();

			adminUser = data.user ?? data;
		} catch (error) {
			console.error('Unable to load admin user:', error);
		} finally {
			loadingUser = false;
		}
	}

	function toggleUserMenu() {
		if (loggingOut || logoutSuccessful) return;

		userMenuOpen = !userMenuOpen;
	}

	function closeUserMenu() {
		userMenuOpen = false;
	}

	function handleDocumentClick(event: MouseEvent) {
		const target = event.target as HTMLElement;

		if (!target.closest('[data-user-menu]')) {
			closeUserMenu();
		}
	}

	async function handleLogout() {
		if (loggingOut || logoutSuccessful) return;

		loggingOut = true;
		logoutError = '';
		userMenuOpen = false;

		try {
			const response = await fetch('/api/admin/logout', {
				method: 'POST'
			});

			if (!response.ok) {
				throw new Error('Logout failed');
			}

			logoutSuccessful = true;

			setTimeout(() => {
				window.location.replace('/admin/login');
			}, 1200);
		} catch (error) {
			console.error('Logout failed:', error);
			logoutError = 'Unable to log out. Please try again.';
			loggingOut = false;
		}
	}

	$: displayName =
		adminUser?.full_name ||
		adminUser?.fullName ||
		'Administrator';

	$: displayEmail = adminUser?.email || 'Administrator account';

	$: displayRole =
		adminUser?.role
			? adminUser.role.charAt(0).toUpperCase() + adminUser.role.slice(1)
			: 'Administrator';

	$: userInitial =
		displayName
			.split(' ')
			.map((part) => part.charAt(0))
			.slice(0, 2)
			.join('')
			.toUpperCase();

	onMount(() => {
		loadAdminUser();

		document.addEventListener('click', handleDocumentClick);

		return () => {
			document.removeEventListener('click', handleDocumentClick);
		};
	});
</script>
<header class="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950 text-white shadow-lg">
		<div
			class="flex min-h-[82px] items-center justify-between gap-4 py-4"
		>
			<!-- BRAND / PAGE TITLE -->
			<div class="flex min-w-0 items-center gap-3.5">
				<div class="min-w-0">
					<div class="flex items-center gap-2">
						<p
							class="truncate text-[11px] font-bold uppercase tracking-[0.22em] text-red-500"
						>
							{pageLabel}
						</p>

						<span
							class="hidden rounded-full border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-400 sm:inline-flex"
						>
							Admin
						</span>
					</div>

					<h1
						class="mt-0.5 truncate text-xl font-extrabold tracking-tight text-white sm:text-2xl"
					>
						{pageTitle}
					</h1>
				</div>
			</div>

			<!-- ACCOUNT AREA -->
			<div class="relative shrink-0" data-user-menu>
				<button
					type="button"
					on:click={toggleUserMenu}
					aria-label="Open user menu"
					aria-expanded={userMenuOpen}
					class="group flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 px-2.5 py-2 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-500/30 sm:px-3"
				>
					<!-- USER AVATAR -->
					<div
						class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-extrabold text-white shadow-md shadow-red-600/20"
					>
						{#if loadingUser}
							<span
								class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
							></span>
						{:else}
							{userInitial}
						{/if}
					</div>

					<!-- USER NAME -->
					<div class="hidden min-w-0 text-left sm:block">
						<p
							class="max-w-[150px] truncate text-sm font-bold text-white"
						>
							{loadingUser ? 'Loading...' : displayName}
						</p>

						<p class="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
							{loadingUser ? 'Account' : displayRole}
						</p>
					</div>

					<ChevronDown
	size={16}
	class={`hidden text-zinc-500 transition-transform duration-200 sm:block ${
		userMenuOpen ? 'rotate-180' : ''
	}`}
/>
				</button>

				<!-- USER POPUP -->
				{#if userMenuOpen}
					<div
						class="absolute right-0 top-[calc(100%+10px)] z-50 w-[290px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/40"
					>
						<!-- USER PROFILE -->
						<div class="border-b border-zinc-800 bg-zinc-900/70 p-4">
							<div class="flex items-center gap-3">
								<div
									class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-extrabold text-white"
								>
									{userInitial}
								</div>

								<div class="min-w-0">
									<p class="truncate text-sm font-bold text-white">
										{displayName}
									</p>

									<p class="truncate text-xs text-zinc-500">
										{displayRole}
									</p>
								</div>
							</div>
						</div>

						<!-- USER DETAILS -->
						<div class="space-y-1 p-3">
							<div
								class="flex items-center gap-3 rounded-lg px-2.5 py-2.5"
							>
								<div
									class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400"
								>
									<User size={15} />
								</div>

								<div class="min-w-0">
									<p class="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
										Name
									</p>

									<p class="truncate text-xs font-medium text-zinc-300">
										{displayName}
									</p>
								</div>
							</div>

							<div
								class="flex items-center gap-3 rounded-lg px-2.5 py-2.5"
							>
								<div
									class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400"
								>
									<Mail size={15} />
								</div>

								<div class="min-w-0">
									<p class="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
										Email
									</p>

									<p class="truncate text-xs font-medium text-zinc-300">
										{displayEmail}
									</p>
								</div>
							</div>

							<div
								class="flex items-center gap-3 rounded-lg px-2.5 py-2.5"
							>
								<div
									class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400"
								>
									<Shield size={15} />
								</div>

								<div class="min-w-0">
									<p class="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
										Access Level
									</p>

									<p class="text-xs font-semibold text-zinc-300">
										{displayRole}
									</p>
								</div>
							</div>
						</div>

						<!-- ACTIONS -->
						<div class="border-t border-zinc-800 p-3">
							<a
								href="/shop"
								on:click={closeUserMenu}
								class="mb-2 flex w-full items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
							>
								<ArrowLeft size={16} />
								<span>Back to Shop</span>
							</a>

							<button
								type="button"
								on:click={handleLogout}
								disabled={loggingOut || logoutSuccessful}
								class="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 disabled:cursor-not-allowed disabled:opacity-75"
							>
								{#if logoutSuccessful}
									<CheckCircle2 size={16} />
									<span>Logged Out</span>
								{:else if loggingOut}
									<span
										class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
									></span>
									<span>Logging Out...</span>
								{:else}
									<LogOut size={16} />
									<span>Logout</span>
								{/if}
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>

	<!-- LOGOUT ERROR -->
	{#if logoutError}
		<div class="border-t border-red-900/40 bg-red-950/50">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="flex min-h-[42px] items-center gap-3 text-sm font-medium text-red-300">
					<span class="h-2 w-2 shrink-0 rounded-full bg-red-500"></span>
					<span>{logoutError}</span>
				</div>
			</div>
		</div>
	{/if}

	<!-- LOGOUT SUCCESS -->
	{#if logoutSuccessful}
		<div class="border-t border-emerald-900/40 bg-emerald-950/50">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="flex min-h-[42px] items-center gap-3 text-sm font-medium text-emerald-300">
					<CheckCircle2 size={16} strokeWidth={2.2} />
					<span>
						Logout successful. Redirecting to the admin login...
					</span>
				</div>
			</div>
		</div>
	{/if}
</header>