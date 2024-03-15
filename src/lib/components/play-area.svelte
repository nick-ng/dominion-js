<script lang="ts">
	import type { PlayerState } from "$lib/schemas/types";
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
					class="border-subtle box-content h-[300px] w-[200px] border-2 border-dashed"
				></div>
			</div>
			<div class="px-1">
				<div class="text-center">Deck</div>
				<div
					class="border-subtle box-content h-[300px] w-[200px] border-2 border-dashed"
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
					class={`box-content flex h-[300px] flex-row justify-start border-2 border-dashed ${isThreshold ? "border-yellow-200" : "border-subtle"}`}
				>
					<div
						class={`flex h-full flex-row items-center justify-start`}
						style={`flex-basis: ${200 * playerState.cardsInPlay.length * 0.8}px`}
					>
						{#each playerState.cardsInPlay as cardId (cardId)}
							<div
								class="relative h-[300px] flex-shrink-0 flex-grow basis-[110px]"
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
			class="flex h-[300px] flex-shrink flex-row"
			style={`flex-basis: ${200 * playerState.cardsInHand.length * 0.8}px`}
		>
			{#each playerState.cardsInHand as cardId (cardId)}
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
