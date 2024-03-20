<script lang="ts">
	import type { GameState, Coordinates } from "$lib/schemas/types";

	import {
		gameStateStore,
		getActivePlayerId,
		getOpponentOrder,
	} from "$lib/stores/game-state";
	import ResourceDisplay from "./resource-display.svelte";
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
	export let onEndPhase: (
		phaseName: GameState["turnPhase"],
	) => void | Promise<void> = () => {};

	let boughtCardCenter: Coordinates = { x: -1, y: -1 };

	const showStyle = "flex-grow: 100; flex-shrink: 0.001;";
	const hideStyle = "flex-grow: 0.001; flex-shrink: 100;";

	$: showMyBoard = true;
	$: myPlayerState = $gameStateStore.gameState?.playerStates[playerId];
	$: activePlayerId = getActivePlayerId($gameStateStore.gameState);
	$: activePlayer = $gameStateStore.gameState?.players[activePlayerId];
</script>

<div
	class="relative flex shrink grow flex-col items-stretch justify-start overflow-hidden"
>
	<slot />
	{#if $gameStateStore.gameState}
		<div
			class="relative overflow-hidden border-b border-b-gray-600 transition-all"
			style={showMyBoard ? hideStyle : showStyle}
		>
			<PlayArea
				class="mb-[-1px]"
				gameState={$gameStateStore.gameState}
				{boughtCardCenter}
				playerId={activePlayerId !== playerId
					? activePlayerId
					: getActivePlayerId($gameStateStore.gameState, -1)}
				opponent
			/>
		</div>
		<h2 class="text-center">{activePlayer?.name}</h2>
		<div>
			<!-- @todo(nick-ng): show various opponent info like deck size, hand size, active player, etc. -->
			{getOpponentOrder(playerId, $gameStateStore.gameState)
				.map((p) => $gameStateStore.gameState?.players[p].name)
				.join(", ")}
		</div>
		<button
			on:click={() => {
				showMyBoard = !showMyBoard;
			}}>Toggle</button
		>
		{#if myPlayerState}
			<div
				class="overflow-hidden transition-all"
				style={showMyBoard ? showStyle : hideStyle}
			>
				<h2 class="text-center">You</h2>
				<ResourceDisplay
					actions={myPlayerState.actions}
					buys={myPlayerState.buys}
					coins={myPlayerState.coins}
					horizontal
				/>
				<PlayArea
					gameState={$gameStateStore.gameState}
					{boughtCardCenter}
					{playerId}
					{onPlayCard}
					{onEndPhase}
				/>
			</div>
		{/if}
		<div
			class="left:0 absolute bottom-0 top-0 my-auto flex w-0 flex-col justify-center overflow-hidden bg-gray-800"
		>
			<!-- @todo(nick-ng): control to slide supply in from the side -->
			<Supply
				gameState={$gameStateStore.gameState}
				onClick={(cardName, cardCenter) => {
					boughtCardCenter = cardCenter;
					onBuy(cardName, cardCenter);
				}}
			/>
		</div>
	{/if}
</div>
