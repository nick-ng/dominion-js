import z from "zod";

import {
	playerSchema,
	playerStateSchema,
	cardSchema,
	gameStateSchema,
	effectSchema,
} from "./game";

export type PlayerState = z.infer<typeof playerStateSchema>;
export type Effect = z.infer<typeof effectSchema>;
export type Card = z.infer<typeof cardSchema>;

export type GameState = z.infer<typeof gameStateSchema>;
export type Player = z.infer<typeof playerSchema>;

export type ActionResult =
	| {
			success: true;
			reason?: string;
	  }
	| { success: false; reason: string };

export type Coordinates = { x: number; y: number };
