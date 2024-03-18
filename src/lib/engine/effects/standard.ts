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

export function applyPlusSomething(
	prevGameState: GameState,
	cardEffect: Effect,
	playerId: string,
): GameState {
	if (
		!prevGameState.playerStates[playerId] ||
		typeof cardEffect.value !== "number"
	) {
		return prevGameState;
	}

	switch (cardEffect.type) {
		case "card": {
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
			break;
		}
		case "action": {
			prevGameState.playerStates[playerId].actions =
				prevGameState.playerStates[playerId].actions + cardEffect.value;
			break;
		}
		case "buy": {
			prevGameState.playerStates[playerId].buys =
				prevGameState.playerStates[playerId].buys + cardEffect.value;
			break;
		}
		case "coin": {
			prevGameState.playerStates[playerId].coins =
				prevGameState.playerStates[playerId].coins + cardEffect.value;
			break;
		}
	}

	return prevGameState;
}
