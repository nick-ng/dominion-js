<script lang="ts">
	import type { PlayerState } from "$lib/schemas/types";

	import { CARD_WIDTH_OVERLAP_PX } from "$lib/engine/card-list";

	import Card from "./card.svelte";
	import ResourceDisplay from "./resource-display.svelte";
	import { onMount } from "svelte";
	import CardFrame from "./card-frame.svelte";

	export let playerState: PlayerState;
	export let onPlayCard: (cardId: string) => void | Promise<void> = () => {};

	let isThreshold = false;
	let playedCardCenters: { [cardId: string]: { x: number; y: number } } = {};
	let playZoneEl: HTMLElement | null = null;
	let deckEl: HTMLElement | null = null;

	let deckCenter = { x: -1, y: -1 };

	onMount(() => {
		if (deckEl) {
			const deckRect = deckEl.getBoundingClientRect();
			deckCenter.x = (deckRect.left + deckRect.right) / 2;
			deckCenter.y = (deckRect.top + deckRect.bottom) / 2;
		}
	});
</script>

<div class="border-subtle">
	<!-- In Play -->
	<div class="my-2">
		<div class="flex flex-row items-stretch justify-start px-2">
			<div class="px-1">
				<div class="text-center">Discard</div>
				<div
					class="border-subtle box-content h-card w-card border-2 border-dashed"
				>
					{#if playerState.discardPile.length > 0}
						<Card
							cardId={playerState.discardPile[
								playerState.discardPile.length - 1
							]}
						/>
					{/if}
				</div>
			</div>
			<div class="px-1">
				<div class="text-center">Deck: {playerState.deck.length}</div>
				<div
					class="border-subtle box-content h-card w-card border-2 border-dashed"
					bind:this={deckEl}
				>
					{#if playerState.deck.length > 0}
						<!-- @todo(nick-ng): make a cardback component -->
						<CardFrame fullImageUrl="favicon.png" />
					{/if}
				</div>
			</div>
			<div class="relative flex-grow px-1">
				<div class="text-center">Played Cards</div>
				<div
					class="absolute bottom-0 top-0 m-auto flex h-full w-full items-center justify-center"
				>
					Drag cards here to play
				</div>
				<div
					class={`box-content flex h-card flex-row justify-start border-2 border-dashed ${isThreshold ? "border-yellow-200" : "border-subtle"}`}
					bind:this={playZoneEl}
				>
					<div
						class={`flex h-full flex-row items-center justify-start`}
						style={`flex-basis: ${CARD_WIDTH_OVERLAP_PX * playerState.inPlay.length}px`}
					>
						{#each playerState.inPlay as cardId (cardId)}
							<div
								class="relative h-card flex-shrink-0 flex-grow basis-card-overlap"
							>
								<Card
									class="absolute left-0"
									{cardId}
									hoverFront
									hoverGrow
									initialCenter={playedCardCenters[cardId] ?? { x: -1, y: -1 }}
								/>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- Hand -->
	<div class="mb-2 flex flex-row justify-between">
		<div class="mb-2 px-2">
			<ResourceDisplay
				actions={playerState.actions}
				coins={playerState.coins}
				buys={playerState.buys}
			/>
		</div>
		<div
			class="flex h-card flex-shrink flex-row"
			style={`flex-basis: ${CARD_WIDTH_OVERLAP_PX * playerState.hand.length}px`}
		>
			{#each playerState.hand as cardId (cardId)}
				<div class="relative h-card flex-shrink-0 flex-grow basis-card-overlap">
					<Card
						class="absolute left-0"
						{cardId}
						initialCenter={deckCenter}
						hoverFront
						hoverGrow
						draggable
						dragTarget={playZoneEl}
						onDragThresholdChange={(_cardId, newIsThreshold) => {
							isThreshold = newIsThreshold;
						}}
						onDrag={(cardId, cardCenter) => {
							playedCardCenters = { [cardId]: cardCenter };
							onPlayCard(cardId);
						}}
					/>
				</div>
			{/each}
		</div>
		<div>
			<!-- Hack to have space on sides of cards -->
		</div>
	</div>
</div>
