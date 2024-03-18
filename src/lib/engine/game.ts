import type { GameState, PlayerState, Player } from "$lib/schemas/types";

import { ALL_CARDS, getCardFromId } from "$lib/engine/card-list";
import { getRandomGameSeed } from "$lib/utils";
import { getStartingPlayerState } from "./player-states";
import { applyPlusAction, applyPlusCard } from "./effects/standard";

export default class Game {
	constructor(players: Player[], hostId: string) {
		this.setPlayers(players);

		this.hostId = hostId;
	}

	inProgress: boolean = false;
	players: Record<string, Player> = {};
	hostId: string;
	kingdomCards: string[] = [];
	playerStates: Record<string, PlayerState> = {};
	supply: Record<string, string[]> = {};
	trash: string[] = [];
	turnOrder: string[] = [];
	turn: number = 0;
	turnAdjustment: number = 0;
	gameSeed: number = getRandomGameSeed();

	setPlayers(players: Player[]) {
		this.players = {};
		for (let i = 0; i < players.length; i++) {
			const player = players[i];
			this.players[player.playerId] = player;
		}
	}

	reset() {
		this.playerStates = {};

		Object.values(this.players).forEach((player) => {
			this.playerStates[player.playerId] = getStartingPlayerState(
				player.playerId,
			);
		});

		this.inProgress = false;
		// players: Record<string, Player> = {};
		// hostId: string;
		// kingdomCards: string[] = [];
		// playerStates: Record<string, PlayerState> = {};
		// supply: Record<string, string[]> = {};
		// trash: string[] = [];
		this.turnOrder = [];
		this.turn = 0;
		this.turnAdjustment = 0;
		this.gameSeed = getRandomGameSeed();
	}

	getGameState(): GameState {
		return {
			supply: this.supply,
			trash: this.trash,
			playerStates: this.playerStates,
			turnOrder: this.turnOrder,
			players: this.players,
			hostId: this.hostId,
			turn: this.turn,
			gameSeed: this.gameSeed,
			turnAdjustment: this.turnAdjustment,
		};
	}

	getGameStateForPlayer(playerId: string): GameState {
		const tempPlayerStates: Record<string, PlayerState> = {};

		Object.values(this.playerStates).forEach((playerState) => {
			const { discardPile } = playerState;
			const newPlayerState = {
				...playerState,
				deck: playerState.deck.map((_, i) => `unknown:d${i}`),
				discardPile: discardPile.length === 0 ? [] : discardPile.slice(-1),
			};

			if (playerState.playerId !== playerId) {
				newPlayerState.hand = newPlayerState.hand.map(
					(_, i) => `unknown:h${i}`,
				);
			}
			tempPlayerStates[playerId] = newPlayerState;
		});

		return structuredClone({
			supply: this.supply,
			trash: this.trash,
			playerStates: tempPlayerStates,
			turnOrder: this.turnOrder,
			players: this.players,
			hostId: this.hostId,
			turn: this.turn,
			gameSeed: this.gameSeed,
			turnAdjustment: this.turnAdjustment,
		});
	}

	playCard(
		playerId: string,
		cardId: string,
	): { success: boolean; reason: string } {
		if (!this.playerStates[playerId]?.hand.includes(cardId)) {
			return {
				success: false,
				reason: "That card is not in your hand.",
			};
		}

		if (this.playerStates[playerId]?.actions === 0) {
			return {
				success: false,
				reason: "You need Actions to play cards.",
			};
		}

		this.playerStates[playerId].actions =
			this.playerStates[playerId].actions - 1;

		this.playerStates[playerId].hand = this.playerStates[playerId].hand.filter(
			(c) => c !== cardId,
		);
		this.playerStates[playerId].inPlay = this.playerStates[
			playerId
		].inPlay.concat([cardId]);

		const card = getCardFromId(cardId);

		if (!card) {
			return { success: false, reason: "Invalid card" };
		}

		for (let i = 0; i < card.effects.length; i++) {
			console.log("card.effects[i].type", card.effects[i].type);
			// resolve effects here
			switch (card.effects[i].type) {
				case "card": {
					const { playerStates } = applyPlusCard(
						this.getGameState(),
						card.effects[i],
						playerId,
					);

					this.playerStates = playerStates;

					break;
				}
				case "action": {
					const { playerStates } = applyPlusAction(
						this.getGameState(),
						card.effects[i],
						playerId,
					);

					this.playerStates = playerStates;

					break;
				}
			}
		}

		return {
			success: true,
			reason: "",
		};
	}
}
