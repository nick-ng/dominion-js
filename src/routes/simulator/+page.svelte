<script lang="ts">
	import type { PlayerState } from "$lib/schemas/types";
	import PlayArea from "$lib/components/play-area.svelte";

	const playerState: PlayerState = {
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
	};
</script>

<div>
	<PlayArea {playerState} />
</div>
