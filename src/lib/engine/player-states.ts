import type { PlayerState } from "$lib/schemas/types";

export function getStartingPlayerState(playerId: string): PlayerState {
	return {
		playerId,
		actions: 1,
		coins: 0,
		buys: 1,
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
		deck: ["copper:7"],
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
		],
		hand: [
			"village:0",
			"merchant:0",
			"smithy:0",
			"smithy:1",
			"market:0",
			"militia:0",
		],
		inPlay: [],
	};

	return {
		...tempState,
		ownedCards: [
			...tempState.deck,
			...tempState.discardPile,
			...tempState.hand,
			...tempState.inPlay,
		].sort((a, b) => a.localeCompare(b)),
	};
}

export function getTest1PlayerState(playerId: string): PlayerState {
	const tempState: Omit<PlayerState, "ownedCards"> = {
		playerId,
		actions: 1,
		coins: 0,
		buys: 0,
		deck: [],
		discardPile: [
			"village:1",
			"merchant:1",
			"smithy:1",
			"market:1",
			"village:2",
			"merchant:2",
			"smithy:2",
			"market:2",
			"village:3",
			"merchant:3",
			"smithy:3",
			"market:3",
			"village:4",
			"merchant:4",
			"smithy:4",
			"market:4",
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
		].sort((a, b) => a.localeCompare(b)),
	};
}

export function getTest2PlayerState(playerId: string): PlayerState {
	const tempState: Omit<PlayerState, "ownedCards"> = {
		playerId,
		actions: 1,
		coins: 0,
		buys: 0,
		deck: [],
		discardPile: [],
		hand: ["village:0", "merchant:0", "smithy:0", "market:0", "militia:0"],
		inPlay: [
			"village:1",
			"merchant:1",
			"smithy:1",
			"market:1",
			"village:2",
			"merchant:2",
			"smithy:2",
			"market:2",
			"village:3",
			"merchant:3",
			"smithy:3",
			"market:3",
			"village:4",
			"merchant:4",
			"smithy:4",
			"market:4",
		],
	};

	return {
		...tempState,
		ownedCards: [
			...tempState.deck,
			...tempState.discardPile,
			...tempState.hand,
			...tempState.inPlay,
		].sort((a, b) => a.localeCompare(b)),
	};
}
