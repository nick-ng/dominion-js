<script lang="ts">
	import type { GameState, Coordinates } from "$lib/schemas/types";

	import { CARD_WIDTH_OVERLAP_PX, CARD_WIDTH_PX } from "$lib/engine/card-list";

	import Card from "./card.svelte";
	import { onMount } from "svelte";

	let className = "";
	export { className as class };
	export let gameState: GameState;
	export let playerId: string;
	export let onPlayCard: (
		cardName: string,
		cardCenter: Coordinates,
	) => void | Promise<void> = () => {};
	export let onEndPhase: (
		phaseName: GameState["turnPhase"],
	) => void | Promise<void> = () => {};
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

<div class={`${className} border-subtle bg-gray-800 transition-all`}>
	<!-- In Play -->
	<div class="mb-2">
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
		<div class="grid grid-cols-1 gap-2 px-2">
			<button
				disabled={gameState.turnPhase !== "action"}
				on:click={() => {
					if (gameState.turnPhase !== "action") {
						return;
					}

					onEndPhase("action");
				}}>End Action Phase</button
			>
		</div>
		<div
			class="flex h-card flex-shrink flex-row"
			style={`flex-basis: ${CARD_WIDTH_OVERLAP_PX * playerState.hand.length}px`}
		>
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
		<div class="grid grid-cols-1 gap-2 px-2">
			<button>Buy Cards</button>
			<button>End Turn</button>
		</div>
	</div>
</div>
