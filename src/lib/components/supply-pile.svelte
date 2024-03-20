<script lang="ts">
	import type { Coordinates } from "$lib/schemas/types";

	import { ALL_CARDS } from "$lib/engine/card-list";
	import Card from "./card.svelte";

	export let cardName: string;
	export let count: number;
	export let sortByCost = false;
	export let onClick: (
		cardName: string,
		cardCenter: Coordinates,
	) => void | Promise<void> = () => {};

	$: card = ALL_CARDS[cardName];
</script>

{#if count > 0 && card}
	<div class="hover:z-10" style={sortByCost ? `order: ${card.cost}` : ""}>
		<div class="text-center">
			{count === 1 ? card.displayNames[0] : card.displayNames[1]}: {count}
		</div>
		<Card
			cardId={`${cardName}:s`}
			hoverGrow
			onClick={(cardId, cardCenter) => {
				const [cardNameB] = cardId.split(":");
				onClick(cardNameB, cardCenter);
			}}
		/>
	</div>
{/if}
