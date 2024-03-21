<script lang="ts">
	import type { GameState, Coordinates } from "$lib/schemas/types";

	import {
		gameStateStore,
		getActivePlayerId,
		getOpponentOrder,
	} from "$lib/stores/game-state";
	import { optionsStore } from "$lib/stores/options";
	import ResourceDisplay from "./resource-display.svelte";
	import PlayArea from "./play-area.svelte";
	import Supply from "./supply.svelte";
	import { onMount } from "svelte";

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
	let showMyBoard = true;
	let showSupply = false;
	let vignetteState = 0; // 0: not there, 1: faded out, 2: visible
	let vignetteClass = "";

	$: transitionDurationMs = $optionsStore.animationSpeed > 10 ? 0 : 100;
	$: transitionDurationStyle = `transition-duration: ${transitionDurationMs}ms;`;
	$: showStyle = `${transitionDurationStyle}flex-grow: 100; flex-shrink: 0.001;`;
	$: hideStyle = `${transitionDurationStyle}flex-grow: 0.001; flex-shrink: 100;`;
	$: myPlayerState = $gameStateStore.gameState?.playerStates[playerId];
	$: activePlayerId = getActivePlayerId($gameStateStore.gameState);
	$: activePlayer = $gameStateStore.gameState?.players[activePlayerId];
	$: {
		switch (vignetteState) {
			case 0: {
				// not there
				vignetteClass =
					"no-vignette -left-full right-full-2 pointer-events-none";
				break;
			}
			case 1: {
				// faded out
				vignetteClass = "no-vignette left-0 right-0 pointer-events-none";
				break;
			}
			case 2: {
				// visible
				vignetteClass = "vignette left-0 right-0";
				break;
			}
			default: {
				vignetteClass = "";
			}
		}
	}

	onMount(() => {
		// @todo(nick-ng): option to invert direction
		const wheelHandler = (e: WheelEvent) => {
			if (!e.shiftKey) {
				showMyBoard = e.deltaY > 0;
			}
		};

		window.addEventListener("wheel", wheelHandler);

		let prevTouchY = 0;
		const touchStartHandler = (e: TouchEvent) => {
			let totalY = 0;
			for (let i = 0; i < e.touches.length; i++) {
				totalY += e.touches[i].screenY;
			}

			if (!showSupply) {
				prevTouchY = totalY / e.touches.length;
			}
		};

		const touchHandler = (e: TouchEvent) => {
			let totalY = 0;
			for (let i = 0; i < e.touches.length; i++) {
				totalY += e.touches[i].screenY;
			}

			const newTouchY = totalY / e.touches.length;

			if (!showSupply) {
				showMyBoard = newTouchY < prevTouchY;
			}
		};

		window.addEventListener("touchstart", touchStartHandler);
		window.addEventListener("touchmove", touchHandler);

		return () => {
			window.removeEventListener("wheel", wheelHandler);
			window.removeEventListener("touchstart", touchStartHandler);
			window.removeEventListener("touchmove", touchHandler);
		};
	});
</script>

<div
	class="flex shrink grow flex-col items-stretch justify-start gap-2 overflow-hidden"
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
		<div class="flex flex-row justify-between">
			<h2 class="text-center">{activePlayer?.name}</h2>
			<!-- @todo(nick-ng): show various opponent info like deck size, hand size, active player, etc. -->
			{getOpponentOrder(playerId, $gameStateStore.gameState)
				.map((p) => $gameStateStore.gameState?.players[p].name)
				.join(", ")}
			<ResourceDisplay actions={0} buys={0} coins={0} horizontal />
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
				<div class="relative mb-2 flex flex-row items-stretch gap-2">
					<button
						on:click={() => {
							showSupply = true;
							vignetteState = 2;
						}}>Show Supply</button
					>
					<div class="grow" />
					<button
						on:click={() => {
							onEndPhase("buy-0");
						}}>End Actions</button
					>
					<button
						on:click={() => {
							onEndPhase("buy-1");
						}}>Buy Cards</button
					>
					<button>End Turn</button>
					<ResourceDisplay
						actions={myPlayerState.actions}
						buys={myPlayerState.buys}
						coins={myPlayerState.coins}
						horizontal
					/>
					<h2
						class="pointer-events-none absolute bottom-0 left-0 right-0 top-0 m-auto flex items-center justify-center"
					>
						You
					</h2>
				</div>
				<PlayArea
					gameState={$gameStateStore.gameState}
					{boughtCardCenter}
					{playerId}
					{onPlayCard}
				/>
			</div>
		{/if}
		<button
			class={`${vignetteClass} transition-some absolute bottom-0 top-0 m-0 h-full w-full border-none p-0`}
			style={transitionDurationStyle}
			on:click={(e) => {
				if (e.target === e.currentTarget) {
					showSupply = false;
					vignetteState = 1;
					setTimeout(() => {
						vignetteState = 0;
					}, transitionDurationMs);
				}
			}}
		>
			<div
				class={`${showSupply ? "left-4 right-4" : "-left-full right-full-2"} absolute bottom-0 top-0 my-auto flex h-min w-auto flex-col justify-center overflow-hidden bg-gray-800`}
				style={transitionDurationStyle}
			>
				<Supply
					gameState={$gameStateStore.gameState}
					onBuy={(cardName, cardCenter) => {
						boughtCardCenter = cardCenter;
						onBuy(cardName, cardCenter);
					}}
					onHide={() => {
						showSupply = false;
						vignetteState = 1;
						setTimeout(() => {
							vignetteState = 0;
						}, transitionDurationMs);
					}}
				>
					<svelte:fragment slot="resource-display">
						{#if myPlayerState}
							<ResourceDisplay
								actions={myPlayerState.actions}
								buys={myPlayerState.buys}
								coins={myPlayerState.coins}
								horizontal
							/>
						{/if}
					</svelte:fragment>
				</Supply>
			</div>
		</button>
	{/if}
</div>

<style>
	.vignette {
		background-color: #00000088;
	}

	.no-vignette {
		background-color: #00000000;
	}

	.transition-some {
		transition-property: background;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}
</style>
