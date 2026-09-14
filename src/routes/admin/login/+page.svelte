<script lang="ts">
	import { LockKeyhole, Mail, ArrowLeft, ShieldCheck } from 'lucide-svelte';

	let email = '';
	let password = '';
	let showPassword = false;
</script>

<svelte:head>
	<title>Mlera Stores | Admin Login</title>

	<meta
		name="description"
		content="Secure administrator login for Mlera Stores."
	/>
</svelte:head>

<div class="min-h-screen bg-zinc-100 text-zinc-900">
	<!-- TOP BRAND AREA -->
	<header class="border-b border-zinc-800 bg-black text-white">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
			<div>
				<p class="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
					Mlera Stores
				</p>

				<h1 class="mt-1 text-xl font-black">
					Admin Portal
				</h1>
			</div>

			<a
				href="/shop"
				class="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:border-red-500/50 hover:bg-white/10"
			>
				<ArrowLeft size={17} />
				Back to Shop
			</a>
		</div>
	</header>

	<!-- LOGIN AREA -->
	<main class="flex min-h-[calc(100vh-89px)] items-center justify-center px-6 py-12">
		<div class="w-full max-w-md">
			<!-- INTRO -->
			<div class="mb-8 text-center">
				<div
					class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600"
				>
					<ShieldCheck size={30} />
				</div>

				<p class="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-red-600">
					Administrator Access
				</p>

				<h2 class="mt-2 text-3xl font-black tracking-tight">
					Welcome back
				</h2>

				<p class="mt-2 text-sm leading-6 text-zinc-500">
					Sign in to manage your products, inventory and store operations.
				</p>
			</div>

			<!-- LOGIN CARD -->
			<div class="rounded-2xl border border-zinc-300 bg-zinc-50 p-7 shadow-xl shadow-zinc-200/50 sm:p-8">
				<form class="space-y-5">
					<!-- EMAIL -->
					<div>
						<label
							for="email"
							class="mb-2 block text-sm font-bold text-zinc-800"
						>
							Email address
						</label>

						<div class="relative">
							<Mail
								size={18}
								class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
							/>

							<input
								id="email"
								type="email"
								bind:value={email}
								placeholder="admin@mlerastores.com"
								autocomplete="username"
								class="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-11 pr-4 text-sm font-medium text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
							/>
						</div>
					</div>

					<!-- PASSWORD -->
					<div>
						<div class="mb-2 flex items-center justify-between">
							<label
								for="password"
								class="block text-sm font-bold text-zinc-800"
							>
								Password
							</label>
						</div>

						<div class="relative">
							<LockKeyhole
								size={18}
								class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
							/>

							<input
								id="password"
								type={showPassword ? 'text' : 'password'}
								bind:value={password}
								placeholder="Enter your password"
								autocomplete="current-password"
								class="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-11 pr-20 text-sm font-medium text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
							/>

							<button
								type="button"
								on:click={() => (showPassword = !showPassword)}
								class="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-bold text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
							>
								{showPassword ? 'Hide' : 'Show'}
							</button>
						</div>
					</div>

					<!-- SUBMIT -->
					<button
						type="submit"
						class="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/20"
					>
						<LockKeyhole size={18} />
						Sign In
					</button>
				</form>

				<!-- SECURITY NOTE -->
				<div class="mt-6 flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3.5">
					<ShieldCheck
						size={17}
						class="mt-0.5 shrink-0 text-zinc-500"
					/>

					<p class="text-xs leading-5 text-zinc-500">
						Administrator access is restricted to authorized Mlera Stores
						staff.
					</p>
				</div>
			</div>

			<!-- FOOTER -->
			<p class="mt-6 text-center text-xs font-medium text-zinc-400">
				Mlera Stores · Administration
			</p>
		</div>
	</main>
</div>
