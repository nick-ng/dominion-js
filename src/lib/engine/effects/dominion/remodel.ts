import type {
	GameState,
	Effect,
	QueueEffectAction,
	ChainResult,
} from "$lib/schemas/types";

import { coinEmoji } from "$lib/emojis";
import { getCardFromId } from "$lib/engine/card-list";

export function applyRemodel0(
	prevGameState: GameState,
	cardEffect: Effect,
	playerId: string,
): ChainResult {
	if (
		!prevGameState.playerStates[playerId] ||
		cardEffect.type !== "remodel-0"
	) {
		return { success: false, nextGameState: prevGameState, continue: true };
	}

	return { success: false, nextGameState: prevGameState, continue: true };
}
