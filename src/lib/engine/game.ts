import type {
	GameState,
	PlayerState,
	Player,
	Effect,
	ActionResult,
} from "$lib/schemas/types";

import {
	BASE_CARD_LIST,
	KINGDOM_CARD_LIST,
	getCardFromId,
	getCardPile,
} from "$lib/engine/card-list";
import { getRandomGameSeed, shuffle } from "$lib/utils";
import { getStartingPlayerState } from "./player-states";
import { applyPlusEffect } from "./effects/standard";

export default class Game {
	constructor(host: Player, gameId?: string) {
		this.players = {
			[host.playerId]: host,
		};
		this.hostId = host.playerId;
		this.turnOrder = [host.playerId];

		if (gameId) {
			this.gameId = gameId;
		} else {
			this.gameId = (Math.random() * 10000).toString(16).replace(".", "-");
		}
	}

	gameId: GameState["gameId"];
	inProgress: boolean = false;
	players: GameState["players"] = {};
	hostId: GameState["hostId"];
	// kingdomCards: string[] = [];
	playerStates: GameState["playerStates"] = {};
	supplyList: GameState["supplyList"] = [];
	supply: GameState["supply"] = {};
	trash: GameState["trash"] = [];
	turnOrder: GameState["turnOrder"] = [];
	turn: GameState["turn"] = 0;
	turnAdjustment: GameState["turnAdjustment"] = 0;
	turnPhase: GameState["turnPhase"] = "lobby";
	gameSeed: GameState["gameSeed"] = getRandomGameSeed();

	addPlayer(player: Player) {
		this.players[player.playerId] = player;
		this.turnOrder.push(player.playerId);
	}

	test() {
		this.playerStates = {};

		Object.values(this.players).forEach((player) => {
			this.playerStates[player.playerId] = getStartingPlayerState(
				player.playerId,
			);
		});

		this.supplyList = [
			"copper",
			"silver",
			"gold",
			"estate",
			"duchy",
			"province",
			"curse",
			"cellar",
			"moat",
			"village",
			"merchant",
			"workshop",
			"smithy",
			"remodel",
			"militia",
			"market",
			"mine",
		];

		this.turn = 0;
		this.turnAdjustment = 0;
		this.turnPhase = "action";
		this.gameSeed = getRandomGameSeed();
	}

	reset() {
		this.playerStates = {};

		this.inProgress = false;
		// players: Record<string, Player> = {};
		// hostId: string;
		// kingdomCards: string[] = [];
		// playerStates: Record<string, PlayerState> = {};
		// supply: Record<string, string[]> = {};
		// trash: string[] = [];
		this.turnOrder;
		this.turn = 0;
		this.turnAdjustment = 0;
		this.turnPhase = "lobby";
		this.gameSeed = getRandomGameSeed();
	}

	setSupply(kingdomCards: string[]): ActionResult {
		const validKingdomCards = kingdomCards.filter((cardName) =>
			KINGDOM_CARD_LIST.includes(cardName),
		);

		if (validKingdomCards.length < 10) {
			return {
				success: false,
				reason: "Not enough valid Kingdom cards",
			};
		} else if (validKingdomCards.length > 10) {
			return {
				success: false,
				reason: "Too many Kingdom cards.",
			};
		}

		this.supplyList = [];
		this.supply = {};

		[...BASE_CARD_LIST, ...validKingdomCards].forEach((cardName) => {
			const cardPile = getCardPile(cardName, Object.keys(this.players).length);

			this.supplyList.push(cardName);
			this.supply[cardName] = cardPile;
		});

		return {
			success: true,
		};
	}

	start() {
		this.turn = 0;
		this.turnAdjustment = 0;
		this.turnPhase = "action";
		this.turnOrder = shuffle(Object.keys(this.players), getRandomGameSeed());

		this.playerStates = {};
		Object.keys(this.players).forEach((playerId, i) => {
			console.log("playerId", playerId);
			this.playerStates[playerId] = getStartingPlayerState(playerId);
			this.applyEffect(playerId, { type: "card", value: 5 }, i);
		});
	}

	applyEffect(playerId: string, effect: Effect, adjustment?: number) {
		// resolve effects here
		switch (effect.type) {
			default: {
				const { playerStates } = applyPlusEffect(
					this.getGameState(),
					effect,
					playerId,
					adjustment,
				);

				this.playerStates = playerStates;

				break;
			}
		}
	}

	playCard(playerId: string, cardId: string): ActionResult {
		if (this.getActivePlayerId() !== playerId) {
			return {
				success: false,
				reason: "It's not your turn.",
			};
		}

		if (!this.playerStates[playerId]?.hand.includes(cardId)) {
			return {
				success: false,
				reason: "That card is not in your hand.",
			};
		}

		const card = getCardFromId(cardId);

		if (!card) {
			return { success: false, reason: "Invalid card" };
		}

		switch (this.turnPhase) {
			case "action": {
				if (!card.types.includes("action")) {
					return {
						success: false,
						reason:
							"You can only play cards with the Action type in the Action phase.",
					};
				}
				if (this.playerStates[playerId]?.actions === 0) {
					return {
						success: false,
						reason: "You need Actions to play cards in the Action phase.",
					};
				}

				this.playerStates[playerId].actions =
					this.playerStates[playerId].actions - 1;

				break;
			}
			case "buy-0": {
				if (!card.types.includes("treasure")) {
					return {
						success: false,
						reason:
							"You can only play cards with the Treasure type in the Buy phase.",
					};
				}

				break;
			}
			case "buy-1": {
				if (card.types.includes("treasure")) {
					return {
						success: false,
						reason:
							"You cannot play Treasure cards in the Buy phase once you've started buying cards.",
					};
				}

				return {
					success: false,
					reason: "You cannot play non-Treasure cards in the buy phase.",
				};
			}
			case "cleanup": {
				return {
					success: false,
					reason: "You cannot play cards during the Clean-up phase.",
				};
			}
			case "lobby": {
				return {
					success: false,
					reason: "The game hasn't started yet.",
				};
			}
			case "over": {
				return {
					success: false,
					reason: "The game is over.",
				};
			}
		}

		this.playerStates[playerId].hand = this.playerStates[playerId].hand.filter(
			(c) => c !== cardId,
		);
		this.playerStates[playerId].inPlay = this.playerStates[
			playerId
		].inPlay.concat([cardId]);

		for (let i = 0; i < card.effects.length; i++) {
			this.applyEffect(playerId, card.effects[i]);
		}

		return {
			success: true,
		};
	}

	endPhase(playerId: string, phaseName: GameState["turnPhase"]): ActionResult {
		if (this.getActivePlayerId() !== playerId) {
			return {
				success: false,
				reason: "It's not your turn.",
			};
		}

		const [f, ...rest] = this.turnPhase.split("");
		const properPhaseName = [f.toUpperCase(), ...rest].join("");

		if (this.turnPhase !== phaseName) {
			return {
				success: false,
				reason: `It's not the ${properPhaseName} phase`,
			};
		}

		switch (this.turnPhase) {
			case "action": {
				this.turnPhase = "buy-0";
				break;
			}
			case "buy-0": {
				this.turnPhase = "buy-1";
				break;
			}
			case "cleanup": {
				this.turnPhase = "action";
				break;
			}
			default: {
				return {
					success: false,
					reason: `You cannot end the ${properPhaseName} phase normally.`,
				};
			}
		}

		return {
			success: true,
		};
	}

	getActivePlayerId(): string {
		const playerIndex =
			(this.turn - this.turnAdjustment) % this.turnOrder.length;

		return this.turnOrder[playerIndex];
	}

	getGameState(): GameState {
		return {
			gameId: this.gameId,
			supplyList: this.supplyList,
			supply: this.supply,
			trash: this.trash,
			playerStates: this.playerStates,
			turnOrder: this.turnOrder,
			players: this.players,
			hostId: this.hostId,
			turn: this.turn,
			gameSeed: this.gameSeed,
			turnAdjustment: this.turnAdjustment,
			turnPhase: this.turnPhase,
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
			tempPlayerStates[playerState.playerId] = newPlayerState;
		});

		return structuredClone({
			gameId: this.gameId,
			supplyList: this.supplyList,
			supply: this.supply,
			trash: this.trash,
			playerStates: tempPlayerStates,
			turnOrder: this.turnOrder,
			players: this.players,
			hostId: this.hostId,
			turn: this.turn,
			gameSeed: this.gameSeed,
			turnAdjustment: this.turnAdjustment,
			turnPhase: this.turnPhase,
		});
	}
}
