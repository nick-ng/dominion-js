<script lang="ts">
	import type { Coordinates } from "$lib/schemas/types";

	import { ALL_CARDS } from "$lib/engine/card-list";
	import Card from "./card.svelte";

	export let cardName: string;
	export let count: number;
	export let sortByCost = false;
	export let disabled = false;
	export let onClick: (
		cardName: string,
		cardCenter: Coordinates,
	) => void | Promise<void> = () => {};

	$: card = ALL_CARDS[cardName];
</script>

{#if card}
	<div class="hover:z-10" style={sortByCost ? `order: ${card.cost}` : ""}>
		<div class={`${disabled ? "text-gray-500" : ""} text-center`}>
			{count === 1 ? card.displayNames[0] : card.displayNames[1]}: {count}
		</div>
		{#if count > 0}
			<Card
				cardId={`${cardName}:s`}
				onClick={(cardId, cardCenter) => {
					const [cardNameB] = cardId.split(":");
					onClick(cardNameB, cardCenter);
				}}
				{disabled}
			/>
		{:else}
			<div
				class="border-subtle font flex h-card w-card items-center justify-center rounded-xl border-2 border-dashed"
			/>
		{/if}
	</div>
{/if}
