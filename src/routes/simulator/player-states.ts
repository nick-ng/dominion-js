import type { PlayerState } from "$lib/schemas/types";

export function getStartingPlayerState(): PlayerState {
	return {
		actions: 0,
		coins: 0,
		buys: 0,
		deckCount: 0,
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
		topCardOfDiscard: "copper:7",
		discardPile: [
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
		hand: [],
		handCount: 0,
		inPlay: [],
	};
}

export function getTest0PlayerState(): PlayerState {
	const tempState: Omit<
		PlayerState,
		"deckCount" | "handCount" | "topCardOfDiscard"
	> = {
		actions: 0,
		coins: 0,
		buys: 0,
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
		discardPile: [
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
		hand: [],
		inPlay: [],
	};

	return {
		...tempState,
		deckCount: tempState.deck.length,
		handCount: tempState.hand.length,
		topCardOfDiscard:
			tempState.discardPile[tempState.discardPile.length - 1] || null,
	};
}
