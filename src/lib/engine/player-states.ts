import type { PlayerState } from "$lib/schemas/types";

export function getStartingPlayerState(playerId: string): PlayerState {
	return {
		playerId,
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
}

export function getTest0PlayerState(playerId: string): PlayerState {
	const tempState: Omit<PlayerState, "ownedCards"> = {
		playerId,
		actions: 1,
		coins: 0,
		buys: 0,
		deck: ["moat:0", "mine:0", "remodel:0", "cellar:0"],
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
		hand: ["village:0", "merchant:0", "smithy:0", "market:0", "militia:0"],
		inPlay: [],
	};

	return {
		...tempState,
		ownedCards: [
			...tempState.deck,
			...tempState.discardPile,
			...tempState.hand,
			...tempState.inPlay,
		],
	};
}
