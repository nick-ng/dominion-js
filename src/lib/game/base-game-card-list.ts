import type { Card } from "$lib/schemas/types";

import { coinEmoji } from "../emojis";

export const BASE_GAME_CARDS: { [key: string]: Card } = {
	cellar: {
		types: ["action"],
		name: "cellar",
		displayNames: ["Cellar", "Cellars"],
		imageUrl: "cellar.png",
		effects: [
			{ type: "action", value: 1 },
			{
				type: "cellar-0",
				description: "Discard any number of cards. +1 Card per card discarded.",
			},
		],
		cost: 2,
	},
	moat: {
		types: ["action", "reaction"],
		name: "moat",
		displayNames: ["Moat", "Moats"],
		imageUrl: "favicon.png",
		effects: [
			{ type: "action", value: 1 },
			{ type: "line" },
			{
				type: "moat-0",
				description:
					"When another player plays an Attack card, you may first reveal this from your hand, to be unaffected by it.",
			},
		],
		cost: 2,
	},
	village: {
		types: ["action"],
		name: "village",
		displayNames: ["Village", "Villages"],
		imageUrl: "favicon.png",
		effects: [
			{ type: "card", value: 1 },
			{ type: "action", value: 2 },
		],
		cost: 3,
	},
	merchant: {
		types: ["action"],
		name: "merchant",
		displayNames: ["Merchant", "Merchants"],
		imageUrl: "favicon.png",
		effects: [
			{ type: "card", value: 1 },
			{ type: "action", value: 1 },
			{
				type: "merchant-0",
				description: `The first time you play a Silver this turn, +${coinEmoji} 1`,
			},
		],
		cost: 3,
	},
	workshop: {
		types: ["action"],
		name: "workshop",
		displayNames: ["Workshop", "Workshops"],
		imageUrl: "favicon.png",
		effects: [
			{
				type: "workshop-0",
				description: `Gain a card costing up to ${coinEmoji} 4`,
			},
		],
		cost: 3,
	},
	smithy: {
		types: ["action"],
		name: "smithy",
		displayNames: ["Smithy", "Smithies"],
		imageUrl: "favicon.png",
		effects: [{ type: "card", value: 3 }],
		cost: 4,
	},
	remodel: {
		types: ["action"],
		name: "remodel",
		displayNames: ["Remodel", "Remodels"],
		imageUrl: "favicon.png",
		effects: [
			{
				type: "remodel-0",
				description: `Trash a card from your hand. Gain a card costing up to ${coinEmoji} 2 more than it.`,
			},
		],
		cost: 4,
	},
	militia: {
		types: ["action", "attack"],
		name: "militia",
		displayNames: ["Militia", "Militias"],
		imageUrl: "favicon.png",
		effects: [
			{ type: "coin", value: 2 },
			{
				type: "militia-0",
				description: `Each other player discards down to 3 cards in hand.`,
			},
		],
		cost: 4,
	},
	market: {
		types: ["action", "attack"],
		name: "market",
		displayNames: ["Market", "Markets"],
		imageUrl: "favicon.png",
		effects: [
			{ type: "card", value: 1 },
			{ type: "action", value: 1 },
			{ type: "buy", value: 1 },
			{ type: "coin", value: 1 },
		],
		cost: 5,
	},
	mine: {
		types: ["action"],
		name: "mine",
		displayNames: ["Mine", "Mines"],
		imageUrl: "favicon.png",
		effects: [
			{
				type: "mine-0",
				description: `You may trash a Treasure from your hand. Gain a Treasure to your hand costing up to ${coinEmoji} 3 more than it.`,
			},
		],
		cost: 4,
	},
};
