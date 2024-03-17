<script lang="ts">
	import PlayArea from "$lib/components/play-area.svelte";
	import { getTest0PlayerState } from "$lib/game/player-states";

	let playerState = getTest0PlayerState();
</script>

<div>
	<PlayArea
		{playerState}
		onPlayCard={(cardId) => {
			playerState.hand = playerState.hand.filter((c) => c !== cardId);
			playerState.inPlay = [...playerState.inPlay, cardId];
		}}
	/>
	<button
		class="button-default"
		on:click={() => {
			playerState = getTest0PlayerState();
		}}>Reset 0</button
	>
	<details>
		<summary>Debug</summary>
		<pre>
			{JSON.stringify(playerState, null, "  ")}
		</pre>
	</details>
</div>
