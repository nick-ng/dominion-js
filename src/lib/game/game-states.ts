import type { GameState } from "$lib/schemas/types";

import { shuffle } from "../utils";
import { getStartingPlayerState } from "./player-states";

export function getStartingGameState(
	players: GameState["players"],
	kingdomCards: string[],
	hostId: string,
	gameSeed?: number,
): GameState {
	const playerStates: GameState["playerStates"] = {};

	for (let i = 0; i < Object.values(players).length; i++) {
		const player = Object.values(players)[i];
		playerStates[player.playerId] = getStartingPlayerState();
	}

	return structuredClone({
		supply: {},
		trash: [],
		playerStates,
		turnOrder: shuffle(Object.keys(players), Math.random() * 10000),
		players,
		hostId: hostId,
		turn: 0,
		gameSeed: gameSeed || 0,
		turnAdjustment: 0,
	});
}
