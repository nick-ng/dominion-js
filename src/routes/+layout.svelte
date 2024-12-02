<script lang="ts">
	import { optionsStore } from "$lib/stores/options";

	import "../app.css";
	import OptionControls from "./option-controls.svelte";

	let rootEl: HTMLElement | null = null;
</script>

<svelte:head>
	<title>Jurisdiction</title>
</svelte:head>

<div
	bind:this={rootEl}
	class="flex h-screen max-h-screen flex-col justify-start px-2 pt-2"
>
	<nav class="mb-1 flex flex-row justify-between gap-2">
		<a class="button-default inline-block px-2 no-underline" href="simulator"
			>Simulator</a
		>
		<a class="button-default inline-block px-2 no-underline" href="card-list"
			>Card List</a
		>
		<div class="flex-grow"></div>
		{#if $optionsStore.showFullScreenButton && document.fullscreenEnabled}
			<button
				class="can-hover:hidden"
				on:click={() => {
					if (document.fullscreenElement) {
						document.exitFullscreen();
					} else if (rootEl) {
						rootEl.requestFullscreen();
					}
				}}
			>
				Toggle Full Screen
			</button>
		{/if}
		<OptionControls />
	</nav>
	<slot />
	<!-- All images copyright © 2024 Nick Ng -->
</div>
