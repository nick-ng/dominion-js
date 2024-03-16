import type { Card } from "$lib/schemas/types";

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
	cellary: {
		types: ["action"],
		name: "cellary",
		displayNames: ["Cellary", "Cellars"],
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
