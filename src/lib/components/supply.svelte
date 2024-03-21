<script lang="ts">
	import type { GameState, Coordinates } from "$lib/schemas/types";

	import {
		BASE_CARD_LIST,
		KINGDOM_CARD_LIST,
		CARD_WIDTH_PX,
	} from "$lib/engine/card-list";

	import SupplyPile from "./supply-pile.svelte";
	import Card from "./card.svelte";

	const style = `grid-template-columns: repeat(auto-fit, ${CARD_WIDTH_PX}px);`;

	export let gameState: GameState | null = null;
	export let onClick: (
		cardName: string,
		cardCenter: Coordinates,
	) => void | Promise<void> = () => {};
	export let onBuy: (
		cardName: string,
		cardCenter: Coordinates,
	) => void | Promise<void> = () => {};
	export let onHide: () => void | Promise<void> = () => {};

	let chosenCardName = "";
	let chosenCardCenter: Coordinates = { x: -1, y: -1 };

	// @todo(nick-ng): indicate cards you can't afford
	// @todo(nick-ng): show coins after you buy selected card?
</script>

{#if gameState}
	<div class="supply-template-cols grid gap-2 border-2 p-2">
		<div class="row-span-2 flex flex-col gap-2 border-r border-r-gray-600 pr-2">
			<button
				on:click={() => {
					onHide();
				}}>Hide Supply</button
			>
			<slot name="resource-display" />
			{#if chosenCardName}
				<div class="self-center">
					<Card cardId={`${chosenCardName}:supply-choice`} />
				</div>
				<button
					on:click={() => {
						onBuy(chosenCardName, chosenCardCenter);
					}}>Buy Card</button
				>
			{:else}
				<div class="text-center">Choose a card</div>
			{/if}
		</div>

		<h3 class="text-center">Supply</h3>
		<div class="overflow-x-auto overflow-y-visible py-2">
			<div class="flex flex-row gap-2" {style}>
				{#each BASE_CARD_LIST as cardName (cardName)}
					{#if gameState.supplyList.includes(cardName)}
						<SupplyPile
							{cardName}
							count={gameState.supply[cardName]?.length || 0}
							onClick={(cardNameB, cardCenter) => {
								chosenCardName = cardNameB;
								chosenCardCenter = cardCenter;
								onClick(chosenCardName, chosenCardCenter);
							}}
						/>
					{/if}
				{/each}
			</div>
			<div class="mt-2 flex flex-row gap-2" {style}>
				{#each KINGDOM_CARD_LIST as cardName (cardName)}
					{#if gameState.supplyList.includes(cardName)}
						<SupplyPile
							{cardName}
							count={gameState.supply[cardName]?.length || 0}
							sortByCost
							onClick={(cardNameB, cardCenter) => {
								chosenCardName = cardNameB;
								chosenCardCenter = cardCenter;
								onClick(chosenCardName, chosenCardCenter);
							}}
						/>
					{/if}
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	.supply-template-cols {
		grid-template-columns: min-content auto;
	}
</style>
