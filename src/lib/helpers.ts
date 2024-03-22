import type { GameState } from "./schemas/types";

export function getTurnSeed(gameState: GameState, adjustment?: number): number {
	const playerStates = Object.values(gameState.playerStates);

	let cardsInPlay = 0;
	for (let i = 0; i < playerStates.length; i++) {
		cardsInPlay += playerStates[i].inPlay.length;
	}

	const temp = `${adjustment || 0}${gameState.turn}${cardsInPlay}${gameState.gameSeed}`;

	return parseInt(temp, 10);
}

export function getActivePlayerId(
	gameState?: Pick<GameState, "turn" | "turnOrder" | "turnAdjustment">,
	adjustment: number = 0,
): string {
	if (!gameState) {
		return "";
	}

	const temp = gameState.turn + gameState.turnAdjustment + adjustment;

	let i = temp % gameState.turnOrder.length;

	while (i < 0) {
		i += gameState.turnOrder.length;
	}

	return gameState.turnOrder[i];
}

export function getOpponentOrder(
	playerId: string,
	gameState?: Pick<GameState, "turnOrder">,
): string[] {
	if (!gameState) {
		return [];
	}

	const temp = [...gameState.turnOrder, ...gameState.turnOrder];

	const result = [];
	let found = false;
	let i = 0;

	while (result.length < gameState.turnOrder.length - 1) {
		const id = temp[i];
		if (found) {
			result.push(id);
		} else if (id === playerId) {
			found = true;
		}

		i++;
	}

	return result;
}
