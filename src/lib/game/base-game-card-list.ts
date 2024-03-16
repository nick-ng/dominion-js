import type { Card } from "$lib/schemas/types";

export const BASE_GAME_CARDS: { [key: string]: Card } = {
	cellar: {
		types: ["action"],
		name: "cellar",
		displayNames: ["Cellar", "Cellars"],
		imageUrl: "favicon.png",
		effects: [
			{ type: "action", value: 1 },
			{
				type: "cellar-0",
				description: "Discard any number of cards. +1 Card per card discarded",
			},
		],
		cost: 2,
	},
};
