import type { GameState, Effect } from "../../schemas/types";

import { shuffle, getTurnSeed } from "../../utils";

export function shuffleDiscard(
	prevGameState: GameState,
	playerId: string,
): GameState {
	const prevDiscardPile = prevGameState.playerStates[playerId]?.discardPile;
	const prevDeck = prevGameState.playerStates[playerId]?.deck;

	if (!prevDiscardPile || !prevDeck) {
		return prevGameState;
	}

	const shuffledDiscardPile = shuffle(
		prevDiscardPile,
		getTurnSeed(prevGameState),
	);

	prevGameState.playerStates[playerId].discardPile = [];
	prevGameState.playerStates[playerId].deck =
		prevDeck.concat(shuffledDiscardPile);

	return prevGameState;
}

export function applyPlusCard(
	prevGameState: GameState,
	cardEffect: Effect,
	playerId: string,
): GameState {
	if (
		!prevGameState.playerStates[playerId] ||
		cardEffect.type !== "card" ||
		typeof cardEffect.value !== "number"
	) {
		return prevGameState;
	}

	for (let i = 0; i < cardEffect.value; i++) {
		if (prevGameState.playerStates[playerId].deck.length === 0) {
			shuffleDiscard(prevGameState, playerId);
		}

		const cardId = prevGameState.playerStates[playerId].deck.shift();
		if (!cardId) {
			// discard pile has been shuffled into the deck. if there are still no cards, shuffling won't do anything
			break;
		}

		prevGameState.playerStates[playerId].hand.push(cardId);
	}

	return prevGameState;
}

export function applyPlusAction(
	prevGameState: GameState,
	cardEffect: Effect,
	playerId: string,
): GameState {
	if (
		!prevGameState.playerStates[playerId] ||
		cardEffect.type !== "action" ||
		typeof cardEffect.value !== "number"
	) {
		return prevGameState;
	}

	prevGameState.playerStates[playerId].actions =
		prevGameState.playerStates[playerId].actions + cardEffect.value;

	return prevGameState;
}
