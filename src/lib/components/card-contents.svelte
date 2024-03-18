<script lang="ts">
	import { coinEmoji, victoryPointEmoji } from "$lib/emojis";
	import type { Card } from "$lib/schemas/types";
	import CardFrame from "./card-frame.svelte";

	import Coin from "./symbols/coin.svelte";
	import VictoryPoint from "./symbols/victory-point.svelte";

	export let card: Card;

	$: isFullImage = card.fullImage && card?.imageUrl;

	let imageStyle = card.imageUrl
		? `background-image: url("${card.imageUrl}");background-size: cover;background-repeat: no-repeat;background-position: center;`
		: "";
</script>

<CardFrame
	fullImageUrl={card?.fullImage && card?.imageUrl}
	class="relative leading-tight"
>
	<h4 class="mb-1 leading-none">{card.displayNames[0]}</h4>
	{#if isFullImage || !card.imageUrl}
		<div class="flex-grow" />
	{:else}
		<div class="mx-1 mb-0 flex-shrink basis-16 border" style={imageStyle} />
	{/if}
	{#each card.effects as effect}
		{#if effect.type === "card"}
			<div class="text-center text-sm">
				+{effect.value}
				{effect.value === 1 ? "Card" : "Cards"}
			</div>
		{:else if effect.type === "action"}
			<div class="text-center text-sm">
				+{effect.value}
				{effect.value === 1 ? "Action" : "Actions"}
			</div>
		{:else if effect.type === "buy"}
			<div class="text-center text-sm">
				+{effect.value}
				{effect.value === 1 ? "Buy" : "Buyss"}
			</div>
		{:else if effect.type === "coin"}
			<div class="text-center text-sm">
				+{coinEmoji}{effect.value}
			</div>
		{:else if effect.type === "line"}
			<hr />
		{:else}
			<div class="text-center text-xs">{effect.description}</div>
		{/if}
	{/each}
	{#if card.coins}
		<div>+{coinEmoji}{card.coins}</div>
	{/if}
	{#if card.victoryPoints}
		<div>{victoryPointEmoji}{card.victoryPoints}</div>
	{/if}
	{#if !isFullImage && card.imageUrl}
		<div class="flex-grow" />
	{/if}
	<div
		class="mt-1 flex flex-row justify-between border-t pt-0.5 text-left text-xs"
	>
		<div>
			{coinEmoji}{card.cost}
		</div>
		<div class="capitalize">{card.types.join(", ")}</div>
	</div>
</CardFrame>
