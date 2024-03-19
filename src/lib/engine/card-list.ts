import type { Card } from "$lib/schemas/types";

import { DOMINION_CARDS } from "./dominion-card-list";

export const CARD_HEIGHT_PX = 210;
export const CARD_WIDTH_PX = Math.ceil((CARD_HEIGHT_PX / 3) * 2);
export const CARD_WIDTH_OVERLAP_PX = Math.ceil(CARD_WIDTH_PX * 0.7);

export const BASE_CARDS: { [key: string]: Card } = {
	copper: {
		types: ["treasure"],
		name: "copper",
		displayNames: ["Copper", "Coppers"],
		effects: [{ type: "coin", value: 1 }],
		imageUrl: "copper.png",
		fullImage: true,
		cost: 0,
	},
	silver: {
		types: ["treasure"],
		name: "silver",
		displayNames: ["Silver", "Silvers"],
		effects: [{ type: "coin", value: 2 }],
		imageUrl: "silver.png",
		fullImage: true,
		cost: 3,
	},
	gold: {
		types: ["treasure"],
		name: "gold",
		displayNames: ["Gold", "Golds"],
		effects: [{ type: "coin", value: 3 }],
		imageUrl: "gold.png",
		fullImage: true,
		cost: 6,
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
	back: {
		types: ["back"],
		name: "back",
		displayNames: ["", ""],
		effects: [],
		imageUrl: "favicon.png",
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
	...DOMINION_CARDS,
};

export const BASE_CARD_LIST = Object.keys(BASE_CARDS);
export const DOMINION_CARD_LIST = Object.keys(DOMINION_CARDS).sort((a, b) =>
	a.localeCompare(b),
);
export const KINGDOM_CARD_LIST = [...DOMINION_CARD_LIST].sort((a, b) =>
	a.localeCompare(b),
);

export function getCardFromId(cardId: string): Card | null {
	const [cardName] = cardId.split(":");

	const card = ALL_CARDS[cardName];

	return card || null;
}

const PILE_SIZES = [
	{ victory: 8, curse: 10, copper: 60, silver: 40, gold: 30 }, // 0
	{ victory: 8, curse: 10, copper: 60, silver: 40, gold: 30 }, // 1
	{ victory: 8, curse: 10, copper: 60, silver: 40, gold: 30 }, // 2
	{ victory: 12, curse: 20, copper: 60, silver: 40, gold: 30 }, // 3
	{ victory: 12, curse: 30, copper: 60, silver: 40, gold: 30 }, // 4
	{ victory: 12, curse: 40, copper: 120, silver: 80, gold: 60 }, // 5
	{ victory: 12, curse: 50, copper: 120, silver: 80, gold: 60 }, // 6
];
export function getCardPile(cardName: string, playerCount: number): string[] {
	const card = ALL_CARDS[cardName];

	if (!card) {
		return [];
	}

	let pileSize = 10;
	const usedCoppers = playerCount * 7;

	if (card.types.includes("victory")) {
		pileSize = PILE_SIZES[playerCount]?.victory || 12;

		if (cardName === "province") {
			if (playerCount === 5) {
				pileSize = 15;
			} else if (playerCount === 6) {
				pileSize = 18;
			}
		}
	} else if (card.types.includes("curse")) {
		pileSize = PILE_SIZES[playerCount]?.curse || 10;
	} else if (cardName === "copper") {
		pileSize = (PILE_SIZES[playerCount]?.copper || 60) - usedCoppers;
	} else if (cardName === "silver") {
		pileSize = PILE_SIZES[playerCount]?.silver || 40;
	} else if (cardName === "gold") {
		pileSize = PILE_SIZES[playerCount]?.gold || 30;
	}

	const pile = [];

	for (let i = 0; i < pileSize; i++) {
		pile.push(`${cardName}:${i}`);
	}

	return pile;
}
