<script lang="ts">
	import PlayArea from "$lib/components/play-area.svelte";
	import { gameStateStore } from "$lib/stores/game-state";
	import { optionsStore } from "$lib/stores/options";
	import {
		getTest0PlayerState,
		getTest1PlayerState,
		getTest2PlayerState,
	} from "$lib/engine/player-states";
	import Game from "$lib/engine/game";
	import Supply from "$lib/components/supply.svelte";

	let name = "player 1";
	let playerId = "aaaaaa";
	let token = "a12345";
	let getPlayer = () => ({ name, playerId, token });
	let success = true;
	let reason = "";
	let game = new Game(getPlayer());
	game.test();
	game.turnPhase = "action";
	game.playerStates[playerId] = getTest0PlayerState(playerId);

	$gameStateStore.gameState = game.getGameStateForPlayer(playerId);
</script>

<div class="relative">
	<div class="flex flex-row items-start">
		<button
			class="button-default"
			on:click={() => {
				game = new Game(getPlayer());
				game.test();
				game.turnPhase = "action";
				game.playerStates[playerId] = getTest0PlayerState(playerId);
				$gameStateStore.gameState = game.getGameStateForPlayer(playerId);
			}}>Reset</button
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
				<div>
					Animation Speed: {$optionsStore.animationSpeed}
				</div>
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
	{#if $gameStateStore.gameState}
		<Supply gameState={$gameStateStore.gameState} />
		<PlayArea
			gameState={$gameStateStore.gameState}
			{playerId}
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
		/>
	{/if}
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
</div>
