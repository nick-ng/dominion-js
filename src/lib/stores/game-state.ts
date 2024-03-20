import type { GameState } from "$lib/schemas/types";
import { writable } from "svelte/store";
import { browser } from "$app/environment";

type GameStateStore = { gameState?: GameState; gameId?: string };

/**
 * Connect to a game with `gameStateStore.set({ gameId: <game-id> })
 * Access the game state with $gameStateStore.gameState as normal
 */
export const gameStateStore = writable<GameStateStore>({});

if (browser) {
	let prevGameId = "";

	gameStateStore.subscribe((newGameState) => {
		if (newGameState.gameId && prevGameId !== prevGameId) {
			// @todo(nick-ng): connect to websocket here
			// @todo(nick-ng): should websocket stuff be in a .svelte file instead?

			prevGameId = newGameState.gameId;
		}
	});
}

export function getActivePlayerId(
	gameState?: GameState,
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
	gameState?: GameState,
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

		console.log(result, found);

		i++;
	}

	return result;
}
