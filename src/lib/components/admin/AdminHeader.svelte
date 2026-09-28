<script lang="ts">
	import {
		ArrowLeft,
		LogOut,
		CheckCircle2,
		ShieldCheck
	} from 'lucide-svelte';

	export let pageTitle = 'Admin Dashboard';
	export let pageLabel = 'Mlera Stores';

	let loggingOut = false;
	let logoutSuccessful = false;
	let logoutError = '';

	async function handleLogout() {
		if (loggingOut || logoutSuccessful) return;

		loggingOut = true;
		logoutError = '';

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
</script>

<header class="border-b border-zinc-800 bg-black text-white shadow-xl">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div
			class="flex min-h-[88px] flex-col justify-center gap-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:py-0"
		>
			<!-- BRAND -->
			<div class="flex items-center gap-4">
				<div
					class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-600/20"
				>
					<ShieldCheck size={23} strokeWidth={2.4} />
				</div>

				<div>
					<div class="flex items-center gap-2">
						<p
							class="text-xs font-bold uppercase tracking-[0.25em] text-red-500"
						>
							{pageLabel}
						</p>

						<span
							class="hidden rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-400 sm:inline-flex"
						>
							Admin
						</span>
					</div>

					<h1 class="mt-1 text-xl font-black tracking-tight sm:text-2xl">
						{pageTitle}
					</h1>
				</div>
			</div>

			<!-- ACTIONS -->
			<div class="flex items-center gap-2 sm:gap-3">
				<a
					href="/shop"
					class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm font-bold text-white transition hover:border-white/20 hover:bg-white/10 sm:px-4"
				>
					<ArrowLeft size={17} />
					<span>Back to Shop</span>
				</a>

				<button
					type="button"
					on:click={handleLogout}
					disabled={loggingOut || logoutSuccessful}
					class="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3.5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-600/10 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-80 sm:px-4"
				>
					{#if logoutSuccessful}
						<CheckCircle2 size={17} />
						<span>Logged Out</span>
					{:else if loggingOut}
						<span
							class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
						></span>
						<span>Logging Out...</span>
					{:else}
						<LogOut size={17} />
						<span>Logout</span>
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- LOGOUT ERROR -->
	{#if logoutError}
		<div class="border-t border-red-900/50 bg-red-950/40">
			<div class="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
				<div class="flex items-center gap-3 text-sm font-semibold text-red-300">
					<span
						class="h-2 w-2 shrink-0 rounded-full bg-red-500"
					></span>

					<span>{logoutError}</span>
				</div>
			</div>
		</div>
	{/if}

	<!-- LOGOUT SUCCESS -->
	{#if logoutSuccessful}
		<div class="border-t border-green-900/50 bg-green-950/40">
			<div class="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
				<div class="flex items-center gap-3 text-sm font-semibold text-green-300">
					<CheckCircle2 size={17} />
					<span>
						Logout successful. Redirecting to the admin login...
					</span>
				</div>
			</div>
		</div>
	{/if}
</header>
