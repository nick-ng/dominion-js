import type {
	GameState,
	Effect,
	QueueEffectAction,
	ChainResult,
} from "$lib/schemas/types";

import { coinEmoji } from "$lib/emojis";
import { getCardFromId } from "$lib/engine/card-list";
import { applyGainEffect } from "../standard";

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

	prevGameState.playerStates[playerId].queuedEffects.push({
		type: "remodel-1",
		blocksPlayer: true,
		message: `Remodel: Trash a card from your hand. Gain a card costing up to ${coinEmoji}2 more than it.`,
	});

	return { success: true, nextGameState: prevGameState, continue: false };
}

export function applyRemodel1(
	prevGameState: GameState,
	effect: QueueEffectAction,
): ChainResult {
	const { playerId, payloadArray } = effect;

	// validate action
	const effectIndex = prevGameState.playerStates[
		playerId
	].queuedEffects.findIndex((qe) => qe.type === "remodel-1");
	if (effectIndex < 0) {
		return {
			success: false,
			nextGameState: prevGameState,
			reason: "effect not queued",
			continue: true,
		};
	}

	const chosenCardId = payloadArray.pop();

	if (!chosenCardId) {
		// @todo(nick-ng): trashing a card is mandatory but there may not be any cards in your hand.
		// return {
		// 	success: false,
		// 	nextGameState: prevGameState,
		// 	reason: "You have to choose a card.",
		// 	continue: false,
		// };

		prevGameState.playerStates[playerId].queuedEffects.splice(effectIndex, 1);

		return {
			success: true,
			nextGameState: prevGameState,
			continue: false,
		};
	}

	if (payloadArray.length !== 0) {
		return {
			success: false,
			nextGameState: prevGameState,
			reason: "You can only trash 1 card.",
			continue: false,
		};
	}

	const chosenCard = getCardFromId(chosenCardId);
	if (!chosenCard) {
		return {
			success: false,
			nextGameState: prevGameState,
			reason: `There is no such card.`,
			continue: false,
		};
	}

	const cardIndex =
		prevGameState.playerStates[playerId].hand.indexOf(chosenCardId);
	if (cardIndex < 0) {
		return {
			success: false,
			nextGameState: prevGameState,
			reason: `${chosenCard.displayNames[0]} isn't in your hand.`,
			continue: false,
		};
	}

	// apply action
	const maxCost = chosenCard.cost + 2;
	prevGameState.playerStates[playerId].queuedEffects.push({
		type: "remodel-2",
		blocksPlayer: true,
		params: {
			maxCost,
			cardId: chosenCardId,
		},
		message: `Remodel: Gain a card costing up to ${coinEmoji}${maxCost}.`,
	});

	prevGameState.playerStates[playerId].hand.splice(cardIndex, 1);
	prevGameState.trash.push(chosenCardId);
	prevGameState.playerStates[playerId].queuedEffects.splice(effectIndex, 1);

	return {
		success: true,
		nextGameState: prevGameState,
		continue: false,
	};
}

export function applyRemodel2(
	prevGameState: GameState,
	effect: QueueEffectAction,
): ChainResult {
	const { playerId, payloadArray } = effect;

	// validate action
	const effectIndex = prevGameState.playerStates[
		playerId
	].queuedEffects.findIndex((qe) => qe.type === "remodel-2");
	if (effectIndex < 0) {
		return {
			success: false,
			nextGameState: prevGameState,
			reason: "effect not queued",
			continue: true,
		};
	}

	const remodel2Effect =
		prevGameState.playerStates[playerId].queuedEffects[effectIndex];

	if (remodel2Effect.type !== "remodel-2") {
		return {
			success: false,
			nextGameState: prevGameState,
			reason: "effect not queued",
			continue: true,
		};
	}

	const chosenCardName = payloadArray.pop();

	if (!chosenCardName) {
		// @todo(nick-ng): gaining a card is mandatory but there may not be a card that costs 4 or fewer coins.
		// return {
		// 	success: false,
		// 	nextGameState: prevGameState,
		// 	reason: "You have to choose a card.",
		// 	continue: false,
		// };

		prevGameState.playerStates[playerId].queuedEffects.splice(effectIndex, 1);

		return {
			success: true,
			nextGameState: prevGameState,
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

	const maxCost = remodel2Effect.params?.maxCost;

	if (chosenCard.cost > maxCost) {
		const trashedCard = getCardFromId(remodel2Effect.params?.cardId || "");
		return {
			success: false,
			nextGameState: prevGameState,
			reason: `You can only gain a card that costs up to ${coinEmoji}${maxCost} because you trashed ${trashedCard?.displayNames[2]}.`,
			continue: false,
		};
	}

	// apply action
	const result = applyGainEffect(prevGameState, playerId, chosenCardName);

	if (!result.success) {
		return {
			success: true,
			nextGameState: result.nextGameState,
			reason: "Something went wrong",
			continue: false,
		};
	}

	prevGameState.playerStates[playerId].queuedEffects.splice(effectIndex, 1);

	return {
		success: true,
		nextGameState: result.nextGameState,
		continue: false,
	};
}
