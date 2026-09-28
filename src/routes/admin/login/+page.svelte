<script lang="ts">
	import {
		LockKeyhole,
		Mail,
		ShieldCheck,
		CheckCircle2
	} from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import LoginFoto from '$lib/assets/images/Login-photo.png';
	import MleraLogo from '$lib/assets/images/MleraAuto2.png';

	let email = '';
	let password = '';
	let showPassword = false;
	let loading = false;
	let loginSuccessful = false;
	let errorMessage = '';

	async function handleLogin() {
		errorMessage = '';

		if (!email.trim() || !password) {
			errorMessage = 'Please enter your email address and password.';
			return;
		}

		loading = true;

		try {
			const response = await fetch('/api/admin/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: email.trim(),
					password
				})
			});

			const result = await response.json();

			if (!response.ok || !result.success) {
				errorMessage = result.message || 'Invalid email or password.';
				loading = false;
				return;
			}

			loginSuccessful = true;
			loading = false;

			setTimeout(() => {
				goto('/admin', { replaceState: true });
			}, 1200);
		} catch (error) {
			console.error('Login request failed:', error);
			errorMessage = 'Unable to connect to the server. Please try again.';
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Mlera Stores | Admin Login</title>

	<meta
		name="description"
		content="Secure administrator login for Mlera Stores."
	/>
</svelte:head>

<div class="min-h-screen bg-zinc-200/90 text-zinc-900">
	<main class="flex min-h-screen items-center justify-center px-6 py-10">
		<div
			class="grid w-full max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2"
		>
			<!-- LOGIN CONTENT -->
			<div
				class="min-w-0 w-full max-w-md justify-self-center lg:justify-self-end lg:-translate-y-8"
			>
				<!-- MAIN LOGIN CARD -->
				<div
					class="rounded-3xl border border-zinc-200 bg-white p-7 shadow-xl shadow-zinc-300/50 sm:p-8"
				>
					<!-- MLERA STORES LOGO -->
					<div class="mb-8 flex justify-center">
						<img
							src={MleraLogo}
							alt="Mlera Stores"
							class="h-20 w-auto object-contain sm:h-24"
						/>
					</div>

					<!-- INTRO -->
					<div class="mb-8 text-center">
						<p
							class="text-base font-bold uppercase tracking-[0.2em] text-red-600"
						>
							Administrator Access
						</p>

						<h2 class="mt-2 text-4xl font-black tracking-tight">
							{loginSuccessful ? 'Login Successful' : 'Welcome back'}
						</h2>

						<p class="mt-3 text-base leading-7 text-zinc-500">
							{#if loginSuccessful}
								Welcome back. Redirecting you to the admin dashboard...
							{:else}
								Sign in to manage your products, inventory and store
								operations.
							{/if}
						</p>
					</div>

					<!-- LOGIN FORM -->
					<div>
						{#if loginSuccessful}
							<!-- SUCCESS STATE -->
							<div
								class="flex flex-col items-center justify-center py-8 text-center"
								role="status"
								aria-live="polite"
							>
								<div
									class="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600"
								>
									<CheckCircle2
										size={36}
										class="success-icon"
									/>
								</div>

								<h3
									class="mt-5 text-xl font-black text-zinc-900"
								>
									Login Successful
								</h3>

								<p
									class="mt-2 max-w-xs text-base leading-6 text-zinc-500"
								>
									Your credentials have been verified successfully.
									Redirecting to the admin dashboard...
								</p>

								<div
									class="mt-6 flex items-center gap-2 text-sm font-bold text-zinc-400"
								>
									<span
										class="h-2 w-2 animate-pulse rounded-full bg-red-600"
									></span>

									Opening Admin Dashboard
								</div>
							</div>
						{:else}
							<form
								class="space-y-5"
								on:submit|preventDefault={handleLogin}
							>
								<!-- EMAIL -->
								<div>
									<label
										for="email"
										class="mb-2 block text-base font-bold text-zinc-800"
									>
										Email address
									</label>

									<div class="relative">
										<Mail
											size={19}
											class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
										/>

										<input
											id="email"
											type="email"
											bind:value={email}
											placeholder="admin@mlerastores.com"
											autocomplete="username"
											disabled={loading}
											class="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-11 pr-4 text-base font-medium text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
										/>
									</div>
								</div>

								<!-- PASSWORD -->
								<div>
									<label
										for="password"
										class="mb-2 block text-base font-bold text-zinc-800"
									>
										Password
									</label>

									<div class="relative">
										<LockKeyhole
											size={19}
											class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
										/>

										<input
											id="password"
											type={showPassword
												? 'text'
												: 'password'}
											bind:value={password}
											placeholder="Enter your password"
											autocomplete="current-password"
											disabled={loading}
											class="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-11 pr-20 text-base font-medium text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
										/>

										<button
											type="button"
											on:click={() =>
												(showPassword =
													!showPassword)}
											disabled={loading}
											class="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-sm font-bold text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
										>
											{showPassword ? 'Hide' : 'Show'}
										</button>
									</div>
								</div>

								<!-- ERROR -->
								{#if errorMessage}
									<div
										class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-base font-medium leading-6 text-red-700"
										role="alert"
									>
										{errorMessage}
									</div>
								{/if}

								<!-- SUBMIT -->
								<button
									type="submit"
									disabled={loading}
									class="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-base font-black text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-70"
								>
									<LockKeyhole size={19} />

									{loading ? 'Signing In...' : 'Sign In'}
								</button>
							</form>

							<!-- SECURITY NOTE -->
							<div
								class="mt-6 flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3.5"
							>
								<ShieldCheck
									size={18}
									class="mt-0.5 shrink-0 text-zinc-500"
								/>

								<p class="text-sm leading-6 text-zinc-500">
									Administrator access is restricted to authorized
									Mlera Stores staff.
								</p>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- LOGIN IMAGE -->
			<div
	class="hidden min-w-0 w-full justify-self-start lg:block lg:-translate-y-8"
>
				<div class="overflow-hidden rounded-3xl">
					<img
						src={LoginFoto}
						alt="Mlera Stores"
						class="h-[620px] w-full object-cover"
					/>
				</div>
			</div>
		</div>
	</main>
</div>

<style>
	.success-icon {
		animation: successPop 0.4s ease-out;
	}

	@keyframes successPop {
		0% {
			transform: scale(0.5);
			opacity: 0;
		}

		70% {
			transform: scale(1.1);
		}

		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>