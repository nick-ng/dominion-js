<script lang="ts">
	import { gameStateStore } from "$lib/stores/game-state";
	import { optionsStore } from "$lib/stores/options";
	import {
		getTest0PlayerState,
		getTest1PlayerState,
		getTest2PlayerState,
	} from "$lib/engine/player-states";
	import FullDisplay from "$lib/components/full-display.svelte";
	import Game from "$lib/engine/game";
	import { onMount } from "svelte";

	let name = "player 1";
	let playerId = "aaaaaa";
	let token = "a12345";
	let getPlayer = () => ({ name, playerId, token });
	let success = true;
	let reason = "";
	let game = new Game(getPlayer());

	$gameStateStore.gameState = game.getGameStateForPlayer(playerId);

	onMount(() => {
		game = new Game(getPlayer());
		const result = game.setSupply([
			"cellar",
			"moat",
			"village",
			"merchant",
			"workshop",
			"smithy",
			"remodel",
			"militia",
			"market",
			"mine",
		]);

		success = result.success;
		reason = result.reason || "";

		game.start();

		$gameStateStore.gameState = game.getGameStateForPlayer(playerId);
	});
</script>

<FullDisplay
	{playerId}
	onBuy={(cardName) => {
		const result = game.buyCard(playerId, cardName);
		success = result.success;
		reason = result.reason || "";
		$gameStateStore.gameState = game.getGameStateForPlayer(playerId);
	}}
	onPlayCard={(cardId) => {
		const result = game.playCard(playerId, cardId);
		success = result.success;
		reason = result.reason || "";
		$gameStateStore.gameState = game.getGameStateForPlayer(playerId);
	}}
	onEndPhase={(phaseName) => {
		const result = game.endPhase(playerId, phaseName);
		success = result.success;
		reason = result.reason || "";
		$gameStateStore.gameState = game.getGameStateForPlayer(playerId);
	}}
>
	<div class="flex flex-row items-start">
		<button
			class="button-default"
			on:click={() => {
				game = new Game(getPlayer());
				const result = game.setSupply([
					"cellar",
					"moat",
					"village",
					"merchant",
					"workshop",
					"smithy",
					"remodel",
					"militia",
					"market",
					"mine",
				]);

				success = result.success;
				reason = result.reason || "";

				game.start();

				$gameStateStore.gameState = game.getGameStateForPlayer(playerId);
			}}>Reset</button
		>
		<button
			class="button-default"
			on:click={() => {
				game = new Game(getPlayer());
				game.test();
				game.turnPhase = "action";
				game.playerStates[playerId] = getTest0PlayerState(playerId);
				$gameStateStore.gameState = game.getGameStateForPlayer(playerId);
			}}>Test0</button
		>
		<button
			class="button-default"
			on:click={() => {
				game = new Game(getPlayer());
				game.test();
				game.turnPhase = "action";
				game.playerStates[playerId] = getTest1PlayerState(playerId);
				$gameStateStore.gameState = game.getGameStateForPlayer(playerId);
			}}>Many Actions</button
		>
		<button
			class="button-default"
			on:click={() => {
				game = new Game(getPlayer());
				game.test();
				game.turnPhase = "action";
				game.playerStates[playerId] = getTest2PlayerState(playerId);
				$gameStateStore.gameState = game.getGameStateForPlayer(playerId);
			}}>Many In-Play</button
		>
		<button
			class="button-default"
			on:click={() => {
				game = new Game(getPlayer());
				game.addPlayer({
					name: "player 2",
					playerId: "bbbbbb",
					token: "b12345",
				});
				const result = game.setSupply([
					"cellar",
					"moat",
					"village",
					"merchant",
					"workshop",
					"smithy",
					"remodel",
					"militia",
					"market",
					"mine",
				]);

				success = result.success;
				reason = result.reason || "";

				game.start();

				$gameStateStore.gameState = game.getGameStateForPlayer(playerId);
			}}>2 Players</button
		>
		<div>
			<label class="ml-4 flex flex-col items-center">
				<div>Animation Speed</div>
				<input
					type="range"
					bind:value={$optionsStore.animationSpeed}
					min={1}
					max={11}
					step={1}
				/></label
			>
		</div>
		{#if !success}
			<div>{reason}</div>
		{/if}
		<div class="grow" />
	</div>
</FullDisplay>
<div class="absolute right-0 top-0 border bg-gray-800 px-2">
	<details>
		<summary>Debug: Full Game</summary>
		<pre>{JSON.stringify(game, null, "  ")}</pre>
	</details>
	<details>
		<summary>Debug: Visible Game</summary>
		<pre>{JSON.stringify(
				game.getGameStateForPlayer(playerId),
				null,
				"  ",
			)}</pre>
	</details>
	<details>
		<summary>Debug: Player State</summary>
		<pre>{JSON.stringify(
				$gameStateStore.gameState?.playerStates[playerId],
				null,
				"  ",
			)}</pre>
	</details>
</div>
