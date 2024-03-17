import type { GameState, Card } from "../schemas/types";

import { ALL_CARDS } from "./card-list";

/**
 * Assumes the player is authorized to perform this action
 */
export function playCard(
	prevGameState: GameState,
	cardName: string,
	playerId: string,
): GameState {
	const card = ALL_CARDS[cardName];

	if (!card) {
		return prevGameState;
	}
}
