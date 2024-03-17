import z from "zod";

export const playerStateSchema = z.object({
	actions: z.number(),
	coins: z.number(),
	buys: z.number(),
	ownedCards: z.string().array(),
	deckCount: z.number(),
	deck: z.string().array(),
	topCardOfDiscard: z.string().nullable(),
	discardPile: z.string().array(),
	hand: z.string().array(),
	handCount: z.number(),
	inPlay: z.string().array(),
});

export const effectSchema = z.object({
	// "buy", "action", "coin", "card", "custom-<name-of-card>"
	type: z.string(),
	value: z.number().optional(),
	description: z.string().optional(),
});

export const cardSchema = z.object({
	types: z.string().array(),
	name: z.string(),
	displayNames: z.string().array(),
	effects: effectSchema.array(),
	hints: z.string().optional(),
	imageUrl: z.string().optional(),
	fullImage: z.boolean().optional(),
	cost: z.number(),
	victoryPoints: z.number().optional(),
	coins: z.number().optional(),
});

export const playerSchema = z.object({
	name: z.string(),
	playerId: z.string(),
	token: z.string(),
});

export const gameStateSchema = z.object({
	supply: z.record(z.string(), z.string().array()), // { [cardName]: cardIds[] }
	trash: z.string().array(), // cardId[]
	playerStates: z.record(z.string(), playerStateSchema), // { [playerId]: playerState }
	turnOrder: z.string().array(), // playerId[]
	players: z.record(z.string(), playerSchema), // { [playerId]: { name, id, token } }
	hostId: z.string(), // playerId
	turn: z.number(),
	gameSeed: z.number(),
	turnAdjustment: z.number(),
});
