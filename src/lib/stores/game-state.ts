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
