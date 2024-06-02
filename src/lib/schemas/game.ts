import z from "zod";

const queuedEffectTypes = z.enum([
	"cellar-1",
	"merchant-1",
	"workshop-1",
	"remodel-1",
	"remodel-2",
	"mine-1",
	"mine-2",
]);

export const queuedEffectSchema = z.object({
	type: queuedEffectTypes,
	blocksPlayer: z.boolean().optional(),
	blocksEveryone: z.boolean().optional(),
	expiryTurn: z.number().optional(),
	params: z.record(z.string(), z.any()).optional(),
	message: z.string().optional(),
});

export const cellarEffect1ActionSchema = z.object({
	type: queuedEffectTypes,
	playerId: z.string(),
	payloadArray: z.string().array(),
});

/**
 * The payload array will be an array of cardIds and/or cardNames.
 * The effect handler will know how to interpret the array.
 *
 * Examples:
 * Cellar: cardIds of cards in hand to discard
 * Mine: cardId of treasure in hand to trash and cardName of treasure to gain
 */
export const queueEffectActionSchema = z.object({
	type: queuedEffectSchema.shape.type,
	playerId: z.string(),
	payloadArray: z.string().array(),
});

export const playerStateSchema = z.object({
	playerId: z.string(),
	actions: z.number(),
	coins: z.number(),
	buys: z.number(),
	ownedCards: z.string().array(),
	deck: z.string().array(), // top card is last in array
	discardPile: z.string().array(), // top card is last in array
	hand: z.string().array(),
	inPlay: z.string().array(),
	queuedEffects: queuedEffectSchema.array(),
});

export const effectSchema = z.object({
	// "buy", "action", "coin", "card", "<name-of-card>-<number>"
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
});

export const playerSchema = z.object({
	name: z.string(),
	playerId: z.string(),
	token: z.string(),
});

export const gameStateSchema = z.object({
	gameId: z.string(),
	supplyList: z.string().array(),
	supply: z.record(z.string(), z.string().array()), // { [cardName]: cardIds[] }
	trash: z.string().array(), // cardId[]
	playerStates: z.record(z.string(), playerStateSchema), // { [playerId]: playerState }
	turnOrder: z.string().array(), // playerId[]
	players: z.record(z.string(), playerSchema), // { [playerId]: { name, id, token } }
	hostId: z.string(), // playerId
	turn: z.number(),
	gameSeed: z.number(),
	turnAdjustment: z.number(),
	turnPhase: z.enum(["action", "buy-0", "buy-1", "cleanup", "over", "lobby"]),
});
