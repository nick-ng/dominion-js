<script lang="ts">
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

<CardFrame fullImageUrl={card?.fullImage && card?.imageUrl} class="relative">
	<h4 class="mb-1 leading-none">{card.displayNames[0]}</h4>
	{#if isFullImage || !card.imageUrl}
		<div class="flex-grow" />
	{:else}
		<div class="mx-1 mb-1 flex-shrink basis-16 border" style={imageStyle} />
	{/if}
	{#each card.effects as effect}
		{#if effect.type === "action"}
			<div class="text-center text-sm">
				+{effect.value}
				{effect.value === 1 ? "Action" : "Actions"}
			</div>
		{:else}
			<div class="text-left text-xs">{effect.description}</div>
		{/if}
	{/each}
	{#if card.coins}
		<div><Coin /> +{card.coins}</div>
	{/if}
	{#if card.victoryPoints}
		<div><VictoryPoint /> {card.victoryPoints}</div>
	{/if}
	{#if !isFullImage && card.imageUrl}
		<div class="flex-grow" />
	{/if}
	<div
		class="mt-1 flex flex-row justify-between border-t pt-0.5 text-left text-sm"
	>
		<div>
			<Coin />
			{card.cost}
		</div>
		<div class="capitalize">{card.types.join(" - ")}</div>
	</div>
</CardFrame>
