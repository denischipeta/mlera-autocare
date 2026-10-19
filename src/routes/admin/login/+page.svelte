<script lang="ts">
	import { LockKeyhole, Mail, ShieldCheck, CheckCircle2, Eye, EyeOff } from 'lucide-svelte';
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

	<meta name="description" content="Secure administrator login for Mlera Stores." />
</svelte:head>

<!--
	Layout
	- Phones:  photo strip on top, login card underneath, page scrolls normally
	           (so the on-screen keyboard never hides the fields)
	- Tablets: same, centred and a little roomier
	- Desktop: card on the left, tall photo on the right
-->

<div class="min-h-[100dvh] overflow-x-clip bg-zinc-200/90 text-zinc-900">
	<main
		class="mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col px-4 py-4 sm:px-6 sm:py-8 lg:justify-center lg:py-10"
	>
		<div class="grid w-full grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 lg:items-center lg:gap-10">
			<!-- PHOTO STRIP (phones and tablets only) -->

			<div class="mx-auto w-full max-w-md overflow-hidden rounded-3xl lg:hidden">
				<img
					src={LoginFoto}
					alt=""
					class="h-32 w-full object-cover sm:h-44"
					aria-hidden="true"
				/>
			</div>

			<!-- LOGIN CONTENT -->

			<div class="mx-auto w-full min-w-0 max-w-md lg:mx-0 lg:justify-self-end">
				<!-- MAIN LOGIN CARD -->

				<div
					class="rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-300/50 sm:p-8"
				>
					<!-- MLERA STORES LOGO -->

					<div class="mb-5 flex justify-center sm:mb-8">
						<img
							src={MleraLogo}
							alt="Mlera Stores"
							class="h-14 w-auto max-w-full object-contain sm:h-20 lg:h-24"
						/>
					</div>

					<!-- INTRO -->

					<div class="mb-6 text-center sm:mb-8">
						<p
							class="text-xs font-bold uppercase tracking-[0.2em] text-red-600 sm:text-sm"
						>
							Administrator Access
						</p>

						<h1 class="mt-2 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
							{loginSuccessful ? 'Login Successful' : 'Welcome back'}
						</h1>

						<p class="mt-2 text-sm leading-6 text-zinc-500 sm:mt-3 sm:text-base sm:leading-7">
							{#if loginSuccessful}
								Welcome back. Redirecting you to the admin dashboard...
							{:else}
								Sign in to manage your products, inventory and store operations.
							{/if}
						</p>
					</div>

					<!-- LOGIN FORM -->

					<div>
						{#if loginSuccessful}
							<!-- SUCCESS STATE -->

							<div
								class="flex flex-col items-center justify-center py-6 text-center sm:py-8"
								role="status"
								aria-live="polite"
							>
								<div
									class="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600"
								>
									<CheckCircle2 size={36} class="success-icon" />
								</div>

								<h2 class="mt-5 text-lg font-black text-zinc-900 sm:text-xl">
									Login Successful
								</h2>

								<p class="mt-2 max-w-xs text-sm leading-6 text-zinc-500 sm:text-base">
									Your credentials have been verified successfully. Redirecting to the admin
									dashboard...
								</p>

								<div class="mt-6 flex items-center gap-2 text-sm font-bold text-zinc-400">
									<span class="h-2 w-2 animate-pulse rounded-full bg-red-600"></span>

									Opening Admin Dashboard
								</div>
							</div>
						{:else}
							<form class="space-y-4 sm:space-y-5" on:submit|preventDefault={handleLogin}>
								<!-- EMAIL -->

								<div>
									<label
										for="email"
										class="mb-2 block text-sm font-bold text-zinc-800 sm:text-base"
									>
										Email address
									</label>

									<div class="relative">
										<Mail
											size={19}
											class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
										/>

										<!-- text-base (16px) stops iPhones from zooming in when the field is tapped -->
										<input
											id="email"
											type="email"
											inputmode="email"
											autocapitalize="none"
											autocorrect="off"
											spellcheck="false"
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
										class="mb-2 block text-sm font-bold text-zinc-800 sm:text-base"
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
											type={showPassword ? 'text' : 'password'}
											autocapitalize="none"
											autocorrect="off"
											spellcheck="false"
											bind:value={password}
											placeholder="Enter your password"
											autocomplete="current-password"
											disabled={loading}
											class="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-11 pr-14 text-base font-medium text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
										/>

										<!-- 44px tap target, icon instead of text so it fits narrow phones -->
										<button
											type="button"
											on:click={() => (showPassword = !showPassword)}
											disabled={loading}
											aria-label={showPassword ? 'Hide password' : 'Show password'}
											aria-pressed={showPassword}
											class="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
										>
											{#if showPassword}
												<EyeOff size={19} />
											{:else}
												<Eye size={19} />
											{/if}
										</button>
									</div>
								</div>

								<!-- ERROR -->

								{#if errorMessage}
									<div
										class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700 sm:text-base"
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
								class="mt-5 flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 sm:mt-6 sm:py-3.5"
							>
								<ShieldCheck size={18} class="mt-0.5 shrink-0 text-zinc-500" />

								<p class="text-xs leading-5 text-zinc-500 sm:text-sm sm:leading-6">
									Administrator access is restricted to authorized Mlera Stores staff.
								</p>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- LOGIN IMAGE (desktop) -->

			<div class="hidden w-full min-w-0 lg:block lg:justify-self-start">
				<div class="overflow-hidden rounded-3xl">
					<img
						src={LoginFoto}
						alt="Mlera Stores"
						class="h-[min(620px,calc(100dvh-5rem))] w-full object-cover"
					/>
				</div>
			</div>
		</div>
	</main>
</div>

<style>
	:global(.success-icon) {
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