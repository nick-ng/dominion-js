<script lang="ts">
	import type { PlayerState } from "$lib/schemas/types";

	import { CARD_HEIGHT_PX, CARD_WIDTH_PX } from "$lib/game/card-list";

	import Card from "./card.svelte";
	import ResourceDisplay from "./resource-display.svelte";

	export let playerState: PlayerState;
	export let clickedCard = "";
	export let onPlayCard: (cardId: string) => void | Promise<void> = () => {};

	let isThreshold = false;
	let playedCardCentres: { [cardId: string]: { x: number; y: number } } = {};
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
		<div class="flex flex-row items-stretch justify-start px-2">
			<div class="px-1">
				<div class="text-center">Discard</div>
				<div
					class="border-subtle h-card w-card box-content border-2 border-dashed"
				></div>
			</div>
			<div class="px-1">
				<div class="text-center">Deck</div>
				<div
					class="border-subtle h-card w-card box-content border-2 border-dashed"
				></div>
			</div>
			<div class="relative flex-grow px-1">
				<div class="text-center">Played Cards</div>
				<div
					class="absolute bottom-0 top-0 m-auto flex h-full w-full items-center justify-center"
				>
					Drag cards here to play
				</div>
				<div
					class={`h-card box-content flex flex-row justify-start border-2 border-dashed ${isThreshold ? "border-yellow-200" : "border-subtle"}`}
				>
					<div
						class={`flex h-full flex-row items-center justify-start`}
						style={`flex-basis: ${CARD_WIDTH_PX * playerState.cardsInPlay.length * 0.8}px`}
					>
						{#each playerState.cardsInPlay as cardId (cardId)}
							<div
								class="h-card basis-card-overlap relative flex-shrink-0 flex-grow"
							>
								<Card
									class="absolute left-0"
									{cardId}
									hoverFront
									hoverGrow
									initialCentre={playedCardCentres[cardId] ?? { x: -1, y: -1 }}
								/>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="flex flex-row justify-center">
		<div
			class="h-card flex flex-shrink flex-row"
			style={`flex-basis: ${CARD_WIDTH_PX * playerState.cardsInHand.length * 0.8}px`}
		>
			{#each playerState.cardsInHand as cardId (cardId)}
				<div class="h-card basis-card-overlap relative flex-shrink-0 flex-grow">
					<Card
						class="absolute left-0"
						{cardId}
						hoverFront
						hoverGrow
						draggable
						dragThresholdY={CARD_HEIGHT_PX * 0.6}
						onDragThresholdChange={(_cardId, newIsThreshold) => {
							isThreshold = newIsThreshold;
						}}
						onDrag={(cardId, cardCentre) => {
							clickedCard = cardId;
							// @todo(nick-ng): figure out how/when to clear card centres
							playedCardCentres[cardId] = cardCentre;
							onPlayCard(cardId);
						}}
					/>
				</div>
			{/each}
		</div>
	</div>
</div>
