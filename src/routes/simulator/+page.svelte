<script lang="ts">
	import type { PlayerState } from "$lib/schemas/types";
	import { playerStateSchema } from "$lib/schemas/game";
	import PlayArea from "$lib/components/play-area.svelte";

	const playerState0: PlayerState = {
		actions: 2,
		coins: 0,
		buys: 1,
		cardsInDeck: 3,
		ownedCards: [
			"estate:1",
			"estate:2",
			"estate:3",
			"copper:1",
			"copper:2",
			"copper:3",
			"copper:4",
			"copper:5",
			"copper:6",
			"copper:7",
		],
		deck: [],
		topCardOfDiscard: null,
		discardPile: [],
		cardsInHand: ["copper:1", "estate:1", "copper:2", "copper:3", "estate:2"],
		cardsInPlay: [],
	};

	let playerState = playerStateSchema.parse(playerState0);
</script>

<div>
	<PlayArea
		{playerState}
		onPlayCard={(cardId) => {
			playerState.cardsInHand = playerState.cardsInHand.filter(
				(c) => c !== cardId,
			);
			playerState.cardsInPlay = [...playerState.cardsInPlay, cardId];
		}}
	/>
	<button
		class="button-default"
		on:click={() => {
			playerState = playerStateSchema.parse(playerState0);
		}}>Reset</button
	>
</div>
