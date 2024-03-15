<script lang="ts">
	import type { Card } from "$lib/schemas/types";
	import CardFrame from "./card-frame.svelte";

	import Coin from "./symbols/coin.svelte";
	import VictoryPoint from "./symbols/victory-point.svelte";

	export let card: Card;

	$: isFullImage = card?.fullImage && card?.imageUrl;
	$: style = [
		isFullImage && `background-image: url("${card?.imageUrl}")`,
		isFullImage && "background-size: cover",
		isFullImage && "background-position: center",
	]
		.filter((a) => a)
		.join(";");
</script>

<CardFrame fullImageUrl={card?.fullImage && card?.imageUrl}>
	<h3 class="leading-none">{card.displayNames[0]}</h3>
	{#if isFullImage || !card.imageUrl}
		<div class="flex-grow" />
	{:else}
		<img src={card.imageUrl} alt={card.displayNames[0]} />
	{/if}
	{#each card.effects as effect}
		{#if effect.type === "action"}
			<div class="text-center font-bold">
				+{effect.value}
				{effect.value === 1 ? "Action" : "Actions"}
			</div>
		{:else}
			<div class="text-left"></div>
		{/if}
	{/each}
	{#if card.coins}
		<div><Coin /> {card.coins}</div>
	{/if}
	{#if card.victoryPoints}
		<div><VictoryPoint /> {card.victoryPoints}</div>
	{/if}
</CardFrame>
