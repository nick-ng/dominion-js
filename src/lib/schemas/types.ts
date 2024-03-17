import z from "zod";

import {
	playerStateSchema,
	cardSchema,
	gameStateSchema,
	effectSchema,
} from "./game";

export type PlayerState = z.infer<typeof playerStateSchema>;
export type Effect = z.infer<typeof effectSchema>;
export type Card = z.infer<typeof cardSchema>;

export type GameState = z.infer<typeof gameStateSchema>;
