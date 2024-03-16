<script lang="ts">
	import PlayArea from "$lib/components/play-area.svelte";
	import { getStartingPlayerState, getTest0PlayerState } from "./player-states";

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
</div>
