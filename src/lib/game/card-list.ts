import type { Card } from "$lib/schemas/types";

import { BASE_GAME_CARDS } from "./base-game-card-list";

export const CARD_HEIGHT_PX = 210;
export const CARD_WIDTH_PX = Math.ceil((CARD_HEIGHT_PX / 3) * 2);

export const BASE_CARDS: { [key: string]: Card } = {
	copper: {
		types: ["treasure"],
		name: "copper",
		displayNames: ["Copper", "Coppers"],
		effects: [],
		imageUrl: "copper.png",
		fullImage: true,
		cost: 0,
		coins: 1,
	},
	silver: {
		types: ["treasure"],
		name: "silver",
		displayNames: ["Silver", "Silvers"],
		effects: [],
		imageUrl: "silver.png",
		fullImage: true,
		cost: 3,
		coins: 2,
	},
	gold: {
		types: ["treasure"],
		name: "gold",
		displayNames: ["Gold", "Golds"],
		effects: [],
		imageUrl: "gold.png",
		fullImage: true,
		cost: 6,
		coins: 3,
	},
	estate: {
		types: ["victory"],
		name: "estate",
		displayNames: ["Estate", "Estates"],
		effects: [],
		imageUrl: "estate.png",
		fullImage: true,
		cost: 2,
		victoryPoints: 1,
	},
	duchy: {
		types: ["victory"],
		name: "duchy",
		displayNames: ["Duchy", "Duchies"],
		effects: [],
		imageUrl: "duchy.png",
		fullImage: true,
		cost: 5,
		victoryPoints: 3,
	},
	province: {
		types: ["victory"],
		name: "province",
		displayNames: ["Province", "Provinces"],
		effects: [],
		imageUrl: "province.png",
		fullImage: true,
		cost: 8,
		victoryPoints: 6,
	},
	curse: {
		types: ["curse"],
		name: "curse",
		displayNames: ["Curse", "Curses"],
		effects: [],
		imageUrl: "curse.png",
		fullImage: true,
		cost: 0,
		victoryPoints: -1,
	},
};

export const CARD_LIST: { [key: string]: Card } = {
	...BASE_CARDS,
	...BASE_GAME_CARDS,
};

export function getCardFromId(cardId: string): Card | null {
	const [cardName] = cardId.split(":");

	const card = CARD_LIST[cardName];

	return card || null;
}
