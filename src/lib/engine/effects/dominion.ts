import type { GameState, Effect } from "$lib/schemas/types";

import { applyPlusEffect } from "./standard";

export function applyDominionEffect(
	prevGameState: GameState,
	cardEffect: Effect,
	playerId: string,
): { success: boolean; nextGameState: GameState } {
	switch (cardEffect.type) {
		case "merchant-0": {
			return applyMerchant0(prevGameState, cardEffect, playerId);
		}
		case "cellar-0": {
			return applyCellar0(prevGameState, cardEffect, playerId);
		}
		default: {
			return { success: false, nextGameState: prevGameState };
		}
	}
}

export function applyMerchant0(
	prevGameState: GameState,
	cardEffect: Effect,
	playerId: string,
): { success: boolean; nextGameState: GameState } {
	if (
		!prevGameState.playerStates[playerId] ||
		cardEffect.type !== "merchant-0"
	) {
		return { success: false, nextGameState: prevGameState };
	}

	prevGameState.playerStates[playerId].queuedEffects.push({
		type: "merchant-1",
		expiryTurn: -1,
	});

	return { success: true, nextGameState: prevGameState };
}

export function applyCellar0(
	prevGameState: GameState,
	cardEffect: Effect,
	playerId: string,
): { success: boolean; nextGameState: GameState } {
	if (!prevGameState.playerStates[playerId] || cardEffect.type !== "cellar-0") {
		return { success: false, nextGameState: prevGameState };
	}

	prevGameState.playerStates[playerId].queuedEffects.push({
		type: "cellar-1",
		blocksPlayer: true,
		message: "Cellar: Choose cards to discard.",
	});

	return { success: true, nextGameState: prevGameState };
}

export function applyDominionTriggeredEffects(
	prevGameState: GameState,
	playerId: string,
): { success: boolean; nextGameState: GameState } {
	let success = false;
	const result = applyMerchant1(prevGameState, playerId);
	if (result.success) {
		success = true;
	}
	const nextGameState = result.nextGameState;

	return { success, nextGameState };
}

export function applyMerchant1(
	prevGameState: GameState,
	playerId: string,
): { success: boolean; nextGameState: GameState } {
	if (!prevGameState.playerStates[playerId]) {
		return { success: false, nextGameState: prevGameState };
	}

	const lastPlayedCard = prevGameState.playerStates[playerId].inPlay.slice(-1);

	if (!lastPlayedCard) {
		return { success: false, nextGameState: prevGameState };
	}

	const silversPlayed = prevGameState.playerStates[playerId].inPlay.filter(
		(c) => {
			const [cardName] = c.split(":");

			return cardName === "silver";
		},
	);

	if (silversPlayed.length !== 1) {
		return { success: false, nextGameState: prevGameState };
	}

	const merchant1Effects = prevGameState.playerStates[
		playerId
	].queuedEffects.filter((e) => e.type === "merchant-1");

	for (let i = 0; i < merchant1Effects.length; i++) {
		applyPlusEffect(prevGameState, { type: "coin", value: 1 }, playerId);
	}

	prevGameState.playerStates[playerId].queuedEffects =
		prevGameState.playerStates[playerId].queuedEffects.filter(
			(e) => e.type !== "merchant-1",
		);

	return { success: true, nextGameState: prevGameState };
}

export function applyDominionChoiceEffects(): {
	success: boolean;
	nextGameState: GameState;
} {}
