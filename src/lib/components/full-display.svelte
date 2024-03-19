<script lang="ts">
	import type { Coordinates } from "$lib/schemas/types";

	import { gameStateStore } from "$lib/stores/game-state";
	import PlayArea from "./play-area.svelte";
	import Supply from "./supply.svelte";

	export let playerId: string;
	export let onBuy: (
		cardName: string,
		cardCenter: Coordinates,
	) => void | Promise<void> = () => {};
	export let onPlayCard: (
		cardName: string,
		cardCenter: Coordinates,
	) => void | Promise<void> = () => {};
	export let onEndPhase: (phaseName: string) => void | Promise<void> = () => {};

	let boughtCardCenter: Coordinates = { x: -1, y: -1 };
</script>

{#if $gameStateStore.gameState}
	<Supply
		gameState={$gameStateStore.gameState}
		onClick={(cardName, cardCenter) => {
			boughtCardCenter = cardCenter;
			onBuy(cardName, cardCenter);
		}}
	/>
	<PlayArea
		gameState={$gameStateStore.gameState}
		{boughtCardCenter}
		{playerId}
		{onPlayCard}
		{onEndPhase}
	/>
{/if}
