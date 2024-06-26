<script lang="ts">
	import type {
		GameState,
		Coordinates,
		PlayerState,
		BlockingEffect,
	} from "$lib/schemas/types";

	import {
		BASE_CARD_LIST,
		KINGDOM_CARD_LIST,
		CARD_WIDTH_PX,
		getCardFromId,
	} from "$lib/engine/card-list";
	import { getActivePlayerId } from "$lib/helpers";
	import SupplyPile from "./supply-pile.svelte";
	import Card from "./card.svelte";
	import ResourceDisplay from "./resource-display.svelte";
	import { coinEmoji } from "$lib/emojis";

	const style = `grid-template-columns: repeat(auto-fit, ${CARD_WIDTH_PX}px);`;

	export let gameState: GameState | null = null;
	export let playerState: PlayerState | null = null;
	export let blockingEffect: BlockingEffect | null = null;
	export let onClick: (
		cardName: string,
		cardCenter: Coordinates,
	) => void | Promise<void> = () => {};
	export let onBuy: (
		cardName: string,
		cardCenter: Coordinates,
	) => void | Promise<void> = () => {};
	export let onCommitChoice: (
		cardName: string,
		cardCenter: Coordinates,
	) => void | Promise<void> = () => {};
	export let onHide: () => void | Promise<void> = () => {};

	let chosenCardName = "";
	let chosenCardCenter: Coordinates = { x: -1, y: -1 };
	let maxCost = Infinity;

	$: activePlayerId = gameState && getActivePlayerId(gameState);
	$: card = getCardFromId(chosenCardName);
	$: {
		if (blockingEffect) {
			maxCost = blockingEffect.maxCost;
		} else if (playerState) {
			maxCost = playerState.coins;
		} else {
			maxCost = Infinity;
		}
	}
</script>

{#if gameState}
	<div
		class={`${playerState ? "supply-template-cols" : "single-template-cols"} grid gap-2 border-2 p-2`}
	>
		{#if playerState && activePlayerId === playerState.playerId}
			<div
				class="row-span-2 flex flex-col gap-2 border-r border-r-gray-600 pr-2"
			>
				<ResourceDisplay
					actions={playerState.actions}
					buys={playerState.buys}
					coins={playerState.coins}
					horizontal
				/>
				{#if card}
					<div class="self-center">
						<Card cardId={`${chosenCardName}:supply-choice`} />
					</div>
					<button
						on:click={() => {
							if (blockingEffect) {
								onCommitChoice(chosenCardName, chosenCardCenter);
							} else {
								onBuy(chosenCardName, chosenCardCenter);
							}
							chosenCardName = "";
						}}
						>{blockingEffect?.confirmMessage?.replace(
							"%card-name%",
							card.displayNames[0],
						) || "Buy Card"}</button
					>
					{#if !blockingEffect}
						<div>
							<p>
								Coins after: {playerState.coins - card.cost}
							</p>
							{#if playerState.coins - card.cost < 0}
								<p>(Not enough {coinEmoji})</p>
							{/if}
						</div>
					{/if}
				{:else}
					<div class="text-center">Choose a card</div>
				{/if}
			</div>
		{/if}

		<div class="relative">
			<h3 class="text-center">
				{#if blockingEffect}
					{blockingEffect.message}
				{:else}
					Supply
				{/if}
			</h3>
			<button
				class={`${playerState?.buys === 0 ? "button-nothing-to-do" : "bg-main-bg text-gray-100"} absolute left-0 top-0 transition-all`}
				on:click={() => {
					onHide();
				}}>Hide Supply</button
			>
			<button
				class={`${playerState?.buys === 0 ? "button-nothing-to-do" : "bg-main-bg text-gray-100"} absolute right-0 top-0 transition-all`}
				on:click={() => {
					onHide();
				}}>Hide Supply</button
			>
		</div>
		<div class="overflow-x-auto overflow-y-visible py-2">
			<div class="flex flex-row gap-2" {style}>
				{#each BASE_CARD_LIST as cardName (cardName)}
					{#if gameState.supplyList.includes(cardName)}
						{@const supplyCard = getCardFromId(cardName)}
						{@const isDisabled =
							!playerState || (!!supplyCard && supplyCard.cost > maxCost)}
						<SupplyPile
							{cardName}
							count={gameState.supply[cardName]?.length || 0}
							onClick={(cardNameB, cardCenter) => {
								if (isDisabled) {
									return;
								}

								chosenCardName = cardNameB;
								chosenCardCenter = cardCenter;
								onClick(chosenCardName, chosenCardCenter);
							}}
							disabled={isDisabled}
						/>
					{/if}
				{/each}
			</div>
			<div class="mt-2 flex flex-row gap-2" {style}>
				{#each KINGDOM_CARD_LIST as cardName (cardName)}
					{#if gameState.supplyList.includes(cardName)}
						{@const supplyCard = getCardFromId(cardName)}
						{@const isDisabled =
							!playerState || (!!supplyCard && supplyCard.cost > maxCost)}
						<SupplyPile
							{cardName}
							count={gameState.supply[cardName]?.length || 0}
							sortByCost
							onClick={(cardNameB, cardCenter) => {
								if (isDisabled) {
									return;
								}

								chosenCardName = cardNameB;
								chosenCardCenter = cardCenter;
								onClick(chosenCardName, chosenCardCenter);
							}}
							disabled={isDisabled}
						/>
					{/if}
				{/each}
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	.supply-template-cols {
		grid-template-columns: min-content auto;
	}

	.single-template-cols {
		grid-template-columns: auto;
	}
</style>
