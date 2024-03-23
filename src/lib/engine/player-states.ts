import type { PlayerState } from "$lib/schemas/types";

export function getStartingPlayerState(
	playerId: string,
	playerNumber = 0,
): PlayerState {
	const coppers = [];
	for (let i = 0; i < 7; i++) {
		coppers.push(`copper:${i}p${playerNumber}`);
	}
	const estates = [];
	for (let i = 0; i < 3; i++) {
		estates.push(`estate:${i}p${playerNumber}`);
	}

	return {
		playerId,
		actions: 1,
		coins: 0,
		buys: 1,
		ownedCards: [...estates, ...coppers],
		deck: [],
		discardPile: [...estates, ...coppers],
		hand: [],
		inPlay: [],
		queuedEffects: [],
	};
}

export function getTest0PlayerState(playerId: string): PlayerState {
	const coppers = [];
	for (let i = 0; i < 7; i++) {
		coppers.push(`copper:${i}t0`);
	}
	const estates = [];
	for (let i = 0; i < 3; i++) {
		estates.push(`estate:${i}t0`);
	}

	const tempState: Omit<PlayerState, "ownedCards"> = {
		playerId,
		actions: 1,
		coins: 0,
		buys: 1,
		deck: ["smithy:0"],
		discardPile: [...estates, ...coppers],
		hand: ["merchant:0", "merchant:1", "silver:0", "silver:1", "militia:0"],
		inPlay: [],
		queuedEffects: [],
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
		buys: 1,
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
		queuedEffects: [],
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
		queuedEffects: [],
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
