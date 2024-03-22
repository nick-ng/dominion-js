import type { GameState, Effect } from "../../schemas/types";

import { shuffle } from "../../utils";
import { getTurnSeed } from "../../helpers";

export function shuffleDiscard(
	prevGameState: GameState,
	playerId: string,
	adjustment?: number,
): GameState {
	const prevDiscardPile = prevGameState.playerStates[playerId]?.discardPile;
	const prevDeck = prevGameState.playerStates[playerId]?.deck;

	if (!prevDiscardPile || !prevDeck) {
		return prevGameState;
	}

	const shuffledDiscardPile = shuffle(
		prevDiscardPile,
		getTurnSeed(prevGameState, adjustment),
	);

	prevGameState.playerStates[playerId].discardPile = [];
	prevGameState.playerStates[playerId].deck =
		prevDeck.concat(shuffledDiscardPile);

	return prevGameState;
}

export function applyPlusEffect(
	prevGameState: GameState,
	cardEffect: Effect,
	playerId: string,
	seedAdjustment?: number,
): { success: boolean; nextGameState: GameState } {
	if (
		!prevGameState.playerStates[playerId] ||
		typeof cardEffect.value !== "number"
	) {
		return { success: false, nextGameState: prevGameState };
	}

	switch (cardEffect.type) {
		case "card": {
			for (let i = 0; i < cardEffect.value; i++) {
				if (prevGameState.playerStates[playerId].deck.length === 0) {
					shuffleDiscard(prevGameState, playerId, seedAdjustment);
				}

				const cardId = prevGameState.playerStates[playerId].deck.pop();
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

	return { success: true, nextGameState: prevGameState };
}

export function applyGainEffect(
	prevGameState: GameState,
	playerId: string,
	cardName: string,
	destination: string = "discard",
): { success: boolean; nextGameState: GameState } {
	if (!prevGameState.supply[cardName]) {
		return { success: false, nextGameState: prevGameState };
	}

	if (!prevGameState.playerStates[playerId]) {
		return { success: false, nextGameState: prevGameState };
	}

	const gainedCardId = prevGameState.supply[cardName].pop();

	if (!gainedCardId) {
		return { success: false, nextGameState: prevGameState };
	}

	prevGameState.playerStates[playerId].ownedCards.push(gainedCardId);

	switch (destination) {
		case "deck":
		case "deck-top": {
			prevGameState.playerStates[playerId].deck.push(gainedCardId);
			break;
		}
		case "deck-bottom": {
			prevGameState.playerStates[playerId].deck.unshift(gainedCardId);
			break;
		}
		case "hand": {
			prevGameState.playerStates[playerId].hand.push(gainedCardId);
			break;
		}
		default: {
			prevGameState.playerStates[playerId].discardPile.push(gainedCardId);
		}
	}

	return { success: true, nextGameState: prevGameState };
}
