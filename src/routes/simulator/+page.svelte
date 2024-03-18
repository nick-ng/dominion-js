<script lang="ts">
	import PlayArea from "$lib/components/play-area.svelte";
	import { getTest0PlayerState } from "$lib/engine/player-states";
	import Game from "$lib/engine/game";

	let player = { name: "player 1", playerId: "aaaaaa", token: "a12345" };
	let success = true;
	let reason = "";
	let game = new Game([player], player.playerId);
	game.reset();
	game.playerStates[player.playerId] = getTest0PlayerState(player.playerId);

	let gameState = game.getGameStateForPlayer(player.playerId);
</script>

<div>
	<PlayArea
		playerState={gameState.playerStates[player.playerId]}
		onPlayCard={(cardId) => {
			const result = game.playCard(player.playerId, cardId);
			success = result.success;
			reason = result.reason;
			gameState = game.getGameStateForPlayer(player.playerId);
		}}
	/>
	<div>
		<button
			class="button-default"
			on:click={() => {
				game = new Game(
					[{ name: "player 1", playerId: player.playerId, token: "a12345" }],
					player.playerId,
				);
				game.reset();
				game.playerStates[player.playerId] = getTest0PlayerState(
					player.playerId,
				);
				gameState = game.getGameStateForPlayer(player.playerId);
			}}>Reset 0</button
		>
		{#if !success}
			<div>{reason}</div>
		{/if}
	</div>
	<details>
		<summary>Debug</summary>
		<pre>
			{JSON.stringify(game, null, "  ")}
			{JSON.stringify(gameState.playerStates[player.playerId], null, "  ")}
		</pre>
	</details>
</div>
