import type {
	GameState,
	Effect,
	QueueEffectAction,
	ChainResult,
} from "$lib/schemas/types";

import { coinEmoji } from "$lib/emojis";
import { getCardFromId } from "$lib/engine/card-list";
import { applyGainEffect } from "../standard";

export function applyMine0(
	prevGameState: GameState,
	cardEffect: Effect,
	playerId: string,
): ChainResult {
	if (!prevGameState.playerStates[playerId] || cardEffect.type !== "mine-0") {
		return { success: false, nextGameState: prevGameState, continue: true };
	}

	prevGameState.playerStates[playerId].queuedEffects.push({
		type: "mine-1",
		blocksPlayer: true,
		message: `Mine: You may trash a Treasure from your hand. Gain a Treasure costing up to ${coinEmoji}3 more than it.`,
	});

	return { success: true, nextGameState: prevGameState, continue: false };
}
