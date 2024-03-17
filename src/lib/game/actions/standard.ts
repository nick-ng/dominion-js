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

	const shuffledDiscardPile = shuffle(prevDeck, getTurnSeed(prevGameState));

	prevGameState.playerStates[playerId].discardPile = [];
	prevGameState.playerStates[playerId].topCardOfDiscard = null;
	prevGameState.playerStates[playerId].deck =
		prevDeck.concat(shuffledDiscardPile);
	prevGameState.playerStates[playerId].deckCount =
		prevGameState.playerStates[playerId].deck.length;

	return prevGameState;
}

export function applyPlusCard(
	prevGameState: GameState,
	plusCardEffect: Effect,
	playerId: string,
): GameState {
	prevGameState;
}
