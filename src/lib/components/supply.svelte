<script lang="ts">
	import type { GameState, Coordinates } from "$lib/schemas/types";

	import {
		BASE_CARD_LIST,
		KINGDOM_CARD_LIST,
		CARD_WIDTH_PX,
	} from "$lib/engine/card-list";

	import SupplyPile from "./supply-pile.svelte";

	const style = `grid-template-columns: repeat(auto-fit, ${CARD_WIDTH_PX}px);`;

	export let gameState: GameState | null = null;
	export let onClick: (
		cardName: string,
		cardCenter: Coordinates,
	) => void | Promise<void> = () => {};

	// @todo(nick-ng): show buy confirmation
	// @todo(nick-ng): show your remaining buys and coins
	// @todo(nick-ng): show coins after you buy selected card?
</script>

{#if gameState}
	<div class="border-subtle">
		<h2 class="text-center">Supply</h2>
		<div class="m-2">
			<div class="supply-section" {style}>
				{#each BASE_CARD_LIST as cardName (cardName)}
					<SupplyPile
						{cardName}
						count={gameState.supply[cardName]?.length || 0}
						onClick={(cardName) => {
							console.log("buying", cardName);
						}}
					/>
				{/each}
			</div>
			<div class="supply-section mt-2" {style}>
				{#each KINGDOM_CARD_LIST as cardName (cardName)}
					<SupplyPile
						{cardName}
						count={gameState.supply[cardName]?.length || 0}
						sortByCost
						onClick={(cardName, cardCenter) => {
							onClick(cardName, cardCenter);
							console.log("buying", cardName);
						}}
					/>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	.supply-section {
		display: grid;
		gap: 1rem;
	}
</style>
