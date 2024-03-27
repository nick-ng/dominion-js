import { coinEmoji } from "$lib/emojis";
import type {
	GameState,
	Effect,
	QueueEffectAction,
	ChainResult,
} from "$lib/schemas/types";
import { getCardFromId } from "../card-list";

import { applyGainEffect, applyPlusEffect } from "./standard";

export const dominionCardEffectFunctions = [
	applyMerchant0,
	applyCellar0,
	applyWorkshop0,
];

function applyMerchant0(
	prevGameState: GameState,
	cardEffect: Effect,
	playerId: string,
): ChainResult {
	if (
		!prevGameState.playerStates[playerId] ||
		cardEffect.type !== "merchant-0"
	) {
		return { success: false, nextGameState: prevGameState, continue: true };
	}

	prevGameState.playerStates[playerId].queuedEffects.push({
		type: "merchant-1",
		expiryTurn: -1,
	});

	return { success: true, nextGameState: prevGameState, continue: false };
}

function applyCellar0(
	prevGameState: GameState,
	cardEffect: Effect,
	playerId: string,
): ChainResult {
	if (!prevGameState.playerStates[playerId] || cardEffect.type !== "cellar-0") {
		return { success: false, nextGameState: prevGameState, continue: true };
	}

	prevGameState.playerStates[playerId].queuedEffects.push({
		type: "cellar-1",
		blocksPlayer: true,
		message: "Cellar: Choose cards to discard.",
	});

	return { success: true, nextGameState: prevGameState, continue: false };
}

function applyWorkshop0(
	prevGameState: GameState,
	cardEffect: Effect,
	playerId: string,
): ChainResult {
	if (
		!prevGameState.playerStates[playerId] ||
		cardEffect.type !== "workshop-0"
	) {
		return { success: false, nextGameState: prevGameState, continue: true };
	}

	prevGameState.playerStates[playerId].queuedEffects.push({
		type: "workshop-1",
		blocksPlayer: true,
		message: `Workshop: Gain a card costing up to ${coinEmoji}4.`,
	});

	return { success: true, nextGameState: prevGameState, continue: false };
}

export function applyDominionTriggeredEffects(
	prevGameState: GameState,
	playerId: string,
): ChainResult {
	const result = applyMerchant1(prevGameState, playerId);

	return result;
}

export function applyMerchant1(
	prevGameState: GameState,
	playerId: string,
): ChainResult {
	if (!prevGameState.playerStates[playerId]) {
		return { success: false, nextGameState: prevGameState, continue: true };
	}

	const lastPlayedCard = prevGameState.playerStates[playerId].inPlay.slice(-1);

	if (!lastPlayedCard) {
		return { success: false, nextGameState: prevGameState, continue: true };
	}

	const silversPlayed = prevGameState.playerStates[playerId].inPlay.filter(
		(c) => {
			const [cardName] = c.split(":");

			return cardName === "silver";
		},
	);

	if (silversPlayed.length !== 1) {
		return { success: false, nextGameState: prevGameState, continue: true };
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

	return { success: true, nextGameState: prevGameState, continue: false };
}

// @todo(nick-ng): use this return signature more
export function applyDominionChoiceEffects(
	prevGameState: GameState,
	effect: QueueEffectAction,
): ChainResult {
	switch (effect.type) {
		case "cellar-1": {
			return applyCellar1(prevGameState, effect);
		}
	}

	return {
		success: false,
		nextGameState: prevGameState,
		reason: "not an effect from the dominion set",
		continue: true,
	};
}

export function applyCellar1(
	prevGameState: GameState,
	effect: QueueEffectAction,
): ChainResult {
	const { playerId, payloadArray } = effect;

	if (
		prevGameState.playerStates[playerId].queuedEffects.filter(
			(q) => q.type === "cellar-1",
		).length === 0
	) {
		return {
			success: false,
			nextGameState: prevGameState,
			reason: "effect not queued",
			continue: true,
		};
	}

	const handAfterDiscard = prevGameState.playerStates[playerId].hand.filter(
		(cardId) => !payloadArray.includes(cardId),
	);

	const cardsDiscarded =
		prevGameState.playerStates[playerId].hand.length - handAfterDiscard.length;

	if (cardsDiscarded !== payloadArray.length) {
		return {
			success: false,
			nextGameState: prevGameState,
			reason: "You don't have some of those cards.",
			continue: false,
		};
	}

	prevGameState.playerStates[playerId].hand = handAfterDiscard;
	prevGameState.playerStates[playerId].discardPile =
		prevGameState.playerStates[playerId].discardPile.concat(payloadArray);
	prevGameState.playerStates[playerId].queuedEffects =
		prevGameState.playerStates[playerId].queuedEffects.filter(
			(q) => q.type !== "cellar-1",
		);

	const result = applyPlusEffect(
		prevGameState,
		{ type: "card", value: cardsDiscarded },
		playerId,
	);

	if (result.success) {
		return {
			success: true,
			nextGameState: result.nextGameState,
			continue: false,
		};
	}

	return {
		success: false,
		nextGameState: result.nextGameState,
		reason: "Something went wrong",
		continue: false,
	};
}

export function applyWorkshop1(
	prevGameState: GameState,
	effect: QueueEffectAction,
): ChainResult {
	const { playerId, payloadArray } = effect;

	if (
		prevGameState.playerStates[playerId].queuedEffects.filter(
			(q) => q.type === "workshop-1",
		).length === 0
	) {
		return {
			success: false,
			nextGameState: prevGameState,
			reason: "effect not queued",
			continue: true,
		};
	}

	const chosenCardName = payloadArray.pop();

	if (!chosenCardName) {
		return {
			success: false,
			nextGameState: prevGameState,
			reason: "You have to choose a card.",
			continue: false,
		};
	}

	if (payloadArray.length !== 0) {
		return {
			success: false,
			nextGameState: prevGameState,
			reason: "You can only choose 1 card.",
			continue: false,
		};
	}

	const chosenCard = getCardFromId(chosenCardName);
	if (!chosenCard) {
		return {
			success: false,
			nextGameState: prevGameState,
			reason: `There is no such card.`,
			continue: false,
		};
	}

	if (prevGameState.supply[chosenCardName].length < 1) {
		return {
			success: false,
			nextGameState: prevGameState,
			reason: `There aren't anymore ${chosenCard.displayNames[1]} in the supply.`,
			continue: false,
		};
	}

	if (chosenCard.cost > 4) {
		return {
			success: false,
			nextGameState: prevGameState,
			reason: `You can only gain a card that costs up to ${coinEmoji}4 with a Workshop.`,
			continue: false,
		};
	}

	const result = applyGainEffect(prevGameState, playerId, chosenCardName);

	if (!result.success) {
		return {
			success: true,
			nextGameState: result.nextGameState,
			reason: "Something went wrong",
			continue: false,
		};
	}

	prevGameState.playerStates[playerId].queuedEffects =
		prevGameState.playerStates[playerId].queuedEffects.filter(
			(q) => q.type !== "workshop-1",
		);

	return {
		success: true,
		nextGameState: result.nextGameState,
		continue: false,
	};
}
