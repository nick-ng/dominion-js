<script lang="ts">
	import { gameStateStore } from "$lib/stores/game-state";
	import {
		getTestMerchantState,
		getTestInPlayState,
		getTestActionsState,
		getTestCellarState,
		getTestWorkshopState,
		getTestBrowserCrashState,
	} from "$lib/engine/player-states";
	import FullDisplay from "$lib/components/full-display.svelte";
	import Game from "$lib/engine/game";
	import { onMount } from "svelte";
	import type { PlayerState } from "$lib/schemas/types";

	const testCases: {
		[key: string]: ((playerId: string) => PlayerState) | undefined;
	} = {
		["Workshop Test"]: getTestWorkshopState,
		["Merchant Test"]: getTestMerchantState,
		["Cellar Test"]: getTestCellarState,
		["Many Actions"]: getTestActionsState,
		["Many In-Play"]: getTestInPlayState,
		["Browser Crash: Play Smithy to crash"]: getTestBrowserCrashState,
	};
	const name = "Player 1";
	const playerId = "aaaaaa";
	const token = "a12345";
	const getPlayer = () => ({ name, playerId, token });

	let success = true;
	let reason = "";
	let game = new Game(getPlayer());
	let chosenTestCase = "";

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
	onPlayEffect={(effect) => {
		const result = game.doQueuedEffect(effect);
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
			}}>Default</button
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
		<select
			class="button-default block"
			bind:value={chosenTestCase}
			on:change={(e) => {
				const value = e.currentTarget.value;
				const func = testCases[value];
				if (func) {
					game = new Game(getPlayer());
					game.test();
					game.turnPhase = "action";

					game.playerStates[playerId] = func(playerId);
				}

				$gameStateStore.gameState = game.getGameStateForPlayer(playerId);

				chosenTestCase = "";
			}}
		>
			<option value="">Choose a test case</option>
			{#each Object.entries(testCases) as t}
				<option value={t[0]}>{t[0]}</option>
			{/each}
		</select>
		<div>{chosenTestCase}</div>
		{#if !success}
			<div>{reason}</div>
		{/if}
		<div class="grow" />
	</div>
</FullDisplay>
<div
	class="absolute right-0 max-h-screen w-max overflow-y-auto border bg-main-bg px-2 can-hover:top-10 cannot-hover:top-14"
>
	<details class="w-max">
		<summary>Debug: Full Game</summary>
		<pre class="w-max">{JSON.stringify(game, null, "  ")}</pre>
	</details>
	<details>
		<summary>Debug: Visible Game</summary>
		<pre class="w-max">{JSON.stringify(
				game.getGameStateForPlayer(playerId),
				null,
				"  ",
			)}</pre>
	</details>
	<details>
		<summary>Debug: Player State</summary>
		<pre class="w-max">{JSON.stringify(
				$gameStateStore.gameState?.playerStates[playerId],
				null,
				"  ",
			)}</pre>
	</details>
</div>
