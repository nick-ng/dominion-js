<script lang="ts">
	import type { PlayerState } from "$lib/schemas/types";
	import Card from "./card.svelte";

	import ResourceDisplay from "./resource-display.svelte";

	export let playerState: PlayerState;
	export let clickedCard = "";

	let isThreshold = false;
</script>

<div class="border-subtle">
	<div class="py-2">
		<div class="mb-2 px-2">
			<ResourceDisplay
				actions={playerState.actions}
				coins={playerState.coins}
				buys={playerState.buys}
				horizontal
			/>
		</div>
		<div class="flex h-[300px] flex-row items-stretch justify-start px-2">
			<div>Discard</div>
			<div>Deck</div>
			<div
				class={`flex-grow border border-dashed px-1 ${isThreshold ? "border-yellow-200" : "border-subtle"}`}
			>
				<div>In Play</div>
				<div>{clickedCard}</div>
			</div>
		</div>
	</div>
	<div class="flex flex-row justify-center">
		<div
			class="flex flex-shrink flex-row"
			style={`flex-basis: ${200 * playerState.cardsInHand.length * 0.8}px`}
		>
			{#each playerState.cardsInHand as cardId}
				<div class="relative h-[300px] flex-shrink-0 flex-grow basis-[110px]">
					<Card
						class="absolute left-0"
						{cardId}
						hoverFront
						hoverGrow
						draggable
						dragThresholdY={200}
						onDragThresholdChange={(_cardId, newIsThreshold) => {
							isThreshold = newIsThreshold;
						}}
						onDrag={(cardId) => {
							clickedCard = cardId;
						}}
					/>
				</div>
			{/each}
		</div>
	</div>
</div>
