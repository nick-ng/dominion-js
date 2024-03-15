import z from "zod";

export const playerStateSchema = z.object({
	actions: z.number(),
	coins: z.number(),
	buys: z.number(),
	ownedCards: z.string().array(),
	cardsInDeck: z.number(),
	deck: z.string().array(),
	topCardOfDiscard: z.string().nullable(),
	discardPile: z.string().array(),
	cardsInHand: z.string().array(),
	cardsInPlay: z.string().array(),
});

export const effectSchema = z.object({
	// "buy", "action", "coin", "card", "custom-<name-of-card>"
	type: z.string(),
	value: z.number().optional(),
});

export const cardSchema = z.object({
	types: z.string().array(),
	name: z.string(),
	displayNames: z.string().array(),
	effects: effectSchema.array(),
	description: z.string(),
	imageUrl: z.string().optional(),
	fullImage: z.boolean().optional(),
	cost: z.number(),
	victoryPoints: z.number().optional(),
	coins: z.number().optional(),
});
