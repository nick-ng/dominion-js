<script lang="ts">
	import type { GameState, Coordinates } from "$lib/schemas/types";

	import {
		CARD_WIDTH_OVERLAP_PX,
		CARD_WIDTH_PX,
		getCardFromId,
	} from "$lib/engine/card-list";

	import Card from "./card.svelte";
	import { onMount } from "svelte";
	import { optionsStore } from "$lib/stores/options";

	let className = "";
	export { className as class };
	export let gameState: GameState;
	export let playerId: string;
	export let onPlayCard: (
		cardId: string,
		cardCenter: Coordinates,
	) => void | Promise<void> = () => {};
	export let onPlayAllTreasures: () => void | Promise<void> = () => {};
	export let boughtCardCenter: Coordinates = { x: -1, y: -1 };
	export let opponent = false;

	let isThreshold = false;
	let playedCardCenters: { [cardId: string]: Coordinates } = {};
	let playZoneEl: HTMLElement | null = null;
	let deckEl: HTMLElement | null = null;
	let discardEl: HTMLElement | null = null;

	let deckCenter = { x: -1, y: -1 };
	let discardCenter = { x: -1, y: -1 };
	let playZoneWidthPx = 0;

	// @todo(nick-ng): make an array of centers then make discard cards for each one
	let inPlayEls: Record<number, HTMLElement> = {};
	let handEls: Record<number, HTMLElement> = {};

	$: playerState = gameState.playerStates[playerId];
	$: playZoneBasisPx = Math.min(
		CARD_WIDTH_OVERLAP_PX * playerState.inPlay.length,
		playZoneWidthPx - CARD_WIDTH_PX,
	);
	$: allTreasureCards = playerState.hand
		.map((cardId, i) => {
			const card = getCardFromId(cardId);
			if (card && card.types.includes("treasure")) {
				const cardEl = handEls[i] || handEls[0];
				const cardRect = cardEl.getBoundingClientRect();
				const cardCenter = {
					x: (cardRect.left + cardRect.right) / 2,
					y: (cardRect.top + cardRect.bottom) / 2,
				};

				return {
					cardId,
					card,
					cardCenter,
				};
			}

			return null;
		})
		.filter((c) => c);

	onMount(() => {
		if (deckEl) {
			const deckRect = deckEl.getBoundingClientRect();
			deckCenter.x = (deckRect.left + deckRect.right) / 2;
			deckCenter.y = (deckRect.top + deckRect.bottom) / 2;
		}

		if (discardEl) {
			const discardRect = discardEl.getBoundingClientRect();
			discardCenter.x = (discardRect.left + discardRect.right) / 2;
			discardCenter.y = (discardRect.top + discardRect.bottom) / 2;
		}

		if (playZoneEl) {
			const playZoneRect = playZoneEl.getBoundingClientRect();
			playZoneWidthPx = playZoneRect.right - playZoneRect.left;
		}
	});
</script>

<div
	class={`${className} border-subtle flex flex-col items-stretch gap-2 bg-gray-800 transition-all`}
>
	<!-- In Play -->
	<div class={`${opponent ? "order-2" : ""}`}>
		<div class="flex flex-row items-stretch justify-start px-2">
			<div class="pr-1">
				<div class="text-center">Discard</div>
				<div
					class="border-subtle box-content h-card w-card border-2 border-dashed"
					bind:this={discardEl}
				>
					{#if playerState.discardPile.length > 0}
						<Card
							cardId={playerState.discardPile[
								playerState.discardPile.length - 1
							]}
							initialCenter={boughtCardCenter}
							upsideDown={opponent && $optionsStore.opponentAllUpsideDown}
						/>
					{/if}
				</div>
			</div>
			<div class="px-1">
				<div class="text-center">Deck: {playerState.deck.length}</div>
				<div
					class="border-subtle relative box-content h-card w-card border-2 border-dashed"
					bind:this={deckEl}
				>
					{#each playerState.deck as _cardId (_cardId)}
						<Card
							class="absolute bottom-0 left-0"
							cardId="back:0"
							initialCenter={discardCenter}
							upsideDown={opponent}
						/>
					{/each}
				</div>
			</div>
			<div class="relative flex-grow pl-1">
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
						class={`flex h-full flex-shrink flex-row items-center justify-start`}
						style={`flex-basis: ${playZoneBasisPx}px`}
					>
						{#each playerState.inPlay as cardId, i (cardId)}
							<div
								class="relative h-card flex-shrink flex-grow basis-card-overlap"
								bind:this={inPlayEls[i]}
							>
								<Card
									class="absolute left-0"
									wiggle
									{cardId}
									hoverFront
									hoverGrow
									initialCenter={playedCardCenters[cardId] ?? {
										x: -1,
										y: -1,
									}}
									upsideDown={opponent && $optionsStore.opponentAllUpsideDown}
								/>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- Hand -->
	<div class={`${opponent ? "order-1" : ""} flex flex-row justify-between`}>
		<div>
			<!-- @todo(nick-ng): put "set-aside" cards here -->
		</div>
		<div
			class={`flex h-card flex-shrink ${opponent ? "flex-row-reverse" : "flex-row"}`}
			style={`flex-basis: ${CARD_WIDTH_OVERLAP_PX * playerState.hand.length}px`}
		>
			<!-- @todo(nick-ng): indicate cards you can't play -->
			{#each playerState.hand as cardId, i (cardId)}
				<div
					class="relative h-card flex-shrink-0 flex-grow basis-card-overlap"
					bind:this={handEls[i]}
				>
					<Card
						class="absolute left-0"
						cardId={opponent ? `back:h${i}` : cardId}
						initialCenter={deckCenter}
						hoverFront
						hoverGrow
						draggable={!opponent}
						dragTarget={playZoneEl}
						upsideDown={opponent}
						wiggle
						onDragThresholdChange={(_cardId, newIsThreshold) => {
							isThreshold = newIsThreshold;
						}}
						onDrag={(cardId, cardCenter) => {
							playedCardCenters = { [cardId]: cardCenter };
							onPlayCard(cardId, cardCenter);
						}}
					/>
				</div>
			{/each}
		</div>
		<div>
			{#if gameState.turnPhase === "buy-0"}
				<button
					on:click={() => {
						let playedACard = false;
						allTreasureCards.forEach((c) => {
							if (c) {
								const { cardId, cardCenter } = c;
								onPlayCard(cardId, cardCenter);
								playedACard = true;
							}
						});

						if (playedACard) {
							onPlayAllTreasures();
						}
					}}>Play all Treasures</button
				>
			{/if}
		</div>
	</div>
</div>
