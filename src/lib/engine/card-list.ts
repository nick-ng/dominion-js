import type { Card } from "$lib/schemas/types";

import { BASE_GAME_CARDS } from "./base-game-card-list";

export const CARD_HEIGHT_PX = 210;
export const CARD_WIDTH_PX = Math.ceil((CARD_HEIGHT_PX / 3) * 2);
export const CARD_WIDTH_OVERLAP_PX = Math.ceil(CARD_WIDTH_PX * 0.7);

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

export const SPECIAL_CARDS: { [key: string]: Card } = {
	unknown: {
		types: ["unknown"],
		name: "unknown",
		displayNames: ["Unknown", "Unknowns"],
		effects: [
			{
				type: "unknown-0",
				description: "You haven't seen this card yet.",
			},
		],
		imageUrl: "unknown.png",
		fullImage: true,
		cost: 0,
		victoryPoints: 0,
	},

	cellary: {
		types: ["action"],
		name: "cellary",
		displayNames: ["Cellary", "Cellaries"],
		imageUrl: "cellar.png",
		effects: [
			{ type: "action", value: 1 },
			{
				type: "cellar-0",
				description:
					"Discard any number of cards. +1 Card per card discarded. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
			},
		],
		cost: 2,
	},
};

export const ALL_CARDS: { [key: string]: Card } = {
	...BASE_CARDS,
	...SPECIAL_CARDS,
	...BASE_GAME_CARDS,
};

export const BASE_GAME_CARD_LIST = Object.keys(BASE_GAME_CARDS);
export const KINGDOM_CARD_LIST = [...BASE_GAME_CARD_LIST];

export function getCardFromId(cardId: string): Card | null {
	const [cardName] = cardId.split(":");

	const card = ALL_CARDS[cardName];

	return card || null;
}
