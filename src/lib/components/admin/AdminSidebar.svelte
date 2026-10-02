<script lang="ts">
	import logo from '$lib/assets/images/MleraAuto2.png';

	import {
		LayoutDashboard,
		FolderOpen,
		Package,
		Boxes,
		BarChart3,
		LogOut,
		ChevronLeft,
		ChevronRight,
		X
	} from 'lucide-svelte';

	export let collapsed = false;
	export let mobileOpen = false;

	const navigation = [
		{
			label: 'Dashboard',
			href: '/admin',
			icon: LayoutDashboard
		},
		{
			label: 'Categories',
			href: '/admin/categories',
			icon: FolderOpen
		},
		{
			label: 'Products',
			href: '/admin/products',
			icon: Package
		},
		{
			label: 'Inventory',
			href: '/admin/inventory',
			icon: Boxes
		},
		{
			label: 'Reports',
			href: '/admin/reports',
			icon: BarChart3
		}
	];

	function isActive(href: string) {
		if (typeof window === 'undefined') return false;

		if (href === '/admin') {
			return window.location.pathname === '/admin';
		}

		return window.location.pathname.startsWith(href);
	}

	function closeMobile() {
		mobileOpen = false;
	}
</script>

{#if mobileOpen}
	<button
		type="button"
		class="fixed inset-0 z-40 bg-black/50 lg:hidden"
		aria-label="Close navigation"
		on:click={closeMobile}
	></button>
{/if}

<aside
	class:lg:w-64={!collapsed}
	class:lg:w-20={collapsed}
	class="fixed left-0 top-0 z-50 flex h-screen w-72 -translate-x-full flex-col border-r border-zinc-800 bg-zinc-950 text-white shadow-2xl transition-all duration-300 lg:translate-x-0"
	class:translate-x-0={mobileOpen}
>
	<!-- BRAND -->
	<div class="flex h-20 shrink-0 items-center border-b border-zinc-800 px-4">
		<div class="flex min-w-0 flex-1 items-center gap-3">
			<div
				class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white"
			>
				<img
					src={logo}
					alt="Mlera AutoCare"
					class="h-full w-full object-contain p-0.5"
				/>
			</div>

			{#if !collapsed}
				<div class="min-w-0">
					<p class="truncate text-sm font-black text-white">
						Mlera Stores
					</p>
					<p class="truncate text-xs font-medium text-zinc-500">
						Admin Panel
					</p>
				</div>
			{/if}
		</div>

		<button
			type="button"
			class="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-white lg:hidden"
			aria-label="Close navigation"
			on:click={closeMobile}
		>
			<X size={19} />
		</button>
	</div>

	<!-- NAVIGATION -->
	<nav class="flex-1 overflow-y-auto px-3 py-5">
		<p
			class:hidden={collapsed}
			class="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600"
		>
			Navigation
		</p>

		<div class="space-y-1.5">
			{#each navigation as item}
				<a
					href={item.href}
					on:click={closeMobile}
					title={collapsed ? item.label : undefined}
					class:justify-center={collapsed}
					class:bg-red-600={isActive(item.href)}
					class:text-white={isActive(item.href)}
					class="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
				>
					<svelte:component
						this={item.icon}
						size={19}
						strokeWidth={2.1}
						class="shrink-0"
					/>

					{#if !collapsed}
						<span>{item.label}</span>
					{/if}
				</a>
			{/each}
		</div>
	</nav>

	<!-- BOTTOM -->
	<div class="shrink-0 border-t border-zinc-800 p-3">
		<button
			type="button"
			title={collapsed ? 'Logout' : undefined}
			class:justify-center={collapsed}
			class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-zinc-400 transition hover:bg-red-950/40 hover:text-red-400"
			on:click={async () => {
				await fetch('/api/admin/logout', { method: 'POST' });
				window.location.href = '/admin/login';
			}}
		>
			<LogOut size={19} strokeWidth={2.1} />

			{#if !collapsed}
				<span>Logout</span>
			{/if}
		</button>

		<button
			type="button"
			class="mt-2 hidden w-full items-center justify-center rounded-xl border border-zinc-800 py-2.5 text-zinc-500 transition hover:bg-zinc-900 hover:text-white lg:flex"
			aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
			title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
			on:click={() => (collapsed = !collapsed)}
		>
			{#if collapsed}
				<ChevronRight size={18} />
			{:else}
				<ChevronLeft size={18} />
			{/if}
		</button>
	</div>
</aside>
