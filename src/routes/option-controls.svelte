<script lang="ts">
	import { optionsStore } from "$lib/stores/options";

	let isOpen = false;
	let summaryEl: HTMLElement | null = null;
</script>

<details bind:open={isOpen}>
	<summary bind:this={summaryEl} class="button-default no-underline"
		>Options</summary
	>
	{#if isOpen}
		<button
			class="vignette absolute bottom-0 left-0 right-0 top-0 z-10 border-none"
			aria-label="close-vignette"
			on:click={() => {
				if (summaryEl) {
					summaryEl.click();
				}
			}}
		></button>
	{/if}
	<div class="relative">
		<div
			class="absolute right-0 z-20 border border-gray-300 bg-main-bg p-0 can-hover:top-full-1 cannot-hover:top-full-2"
		>
			<table class="options-table border-separate border-spacing-2">
				<tbody>
					<tr>
						<td>Animation Speed</td>
						<td
							><input
								type="range"
								bind:value={$optionsStore.animationSpeed}
								min={1}
								max={11}
								step={1}
							/></td
						>
					</tr>
					<tr>
						<td
							><label for="opponentAllUpsideDownControl"
								>Opponent Upside Down</label
							></td
						>
						<td
							><input
								id="opponentAllUpsideDownControl"
								type="checkbox"
								bind:checked={$optionsStore.opponentAllUpsideDown}
							/></td
						>
					</tr>
					<tr>
						<td
							><label for="dragCardFromCenterControl">
								Drag Cards From Centre
							</label>
						</td>
						<td
							><input
								id="dragCardFromCenterControl"
								type="checkbox"
								bind:checked={$optionsStore.dragCardFromCenter}
							/></td
						>
					</tr>
					<tr>
						<td
							><label for="invertScrollDirectionControl"
								>Invert Scroll Direction</label
							></td
						>
						<td
							><input
								id="invertScrollDirectionControl"
								type="checkbox"
								bind:checked={$optionsStore.invertScrollDirection}
							/></td
						>
					</tr>
					<tr class="can-hover:hidden"
						><td
							><label for="showFullScreenButtonControl"
								>Full Screen Button</label
							></td
						><td
							><input
								id="showFullScreenButtonControl"
								type="checkbox"
								bind:checked={$optionsStore.showFullScreenButton}
							/></td
						></tr
					>
				</tbody>
			</table>
			<hr />
			<div class="px-3 py-1">
				<a href="https://github.com/nick-ng/dominion-js" target="_blank"
					>GitHub</a
				>
			</div>
		</div>
	</div>
</details>

<style lang="postcss">
	.options-table td {
		@apply select-none whitespace-nowrap;
	}

	.options-table td:first-child {
		@apply text-right;
	}

	.options-table label,
	.options-table input[type="checkbox"] {
		@apply cursor-pointer;
	}
</style>
