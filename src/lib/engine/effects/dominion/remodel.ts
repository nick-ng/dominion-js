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

	prevGameState.playerStates[playerId].queuedEffects.push({
		type: "remodel-1",
		expiryTurn: -1,
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
	].queuedEffects.findIndex((qe) => {
		qe.type === "remodel-1";
	});
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
	// 10: queue remodel-2 with max cost of card you can gain
	const maxCost = chosenCard.cost + 2;
	prevGameState.playerStates[playerId].queuedEffects.push({
		type: "remodel-2",
		blocksPlayer: true,
		params: {
			maxCost,
		},
		message: `Remodel: Gain a card costing up to ${coinEmoji}${maxCost}.`,
	});

	// 20: trash selected card from hand
	prevGameState.playerStates[playerId].hand.splice(cardIndex, 1);
	prevGameState.trash.push(chosenCardId);

	// 30: remove remodel-1 action from queue
	prevGameState.playerStates[playerId].queuedEffects.splice(effectIndex, 1);

	return {
		success: true,
		nextGameState: prevGameState,
		continue: false,
	};
}
