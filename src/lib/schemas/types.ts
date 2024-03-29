import z from "zod";

import {
	playerSchema,
	playerStateSchema,
	cardSchema,
	gameStateSchema,
	effectSchema,
	queueEffectActionSchema,
} from "./game";

export type PlayerState = z.infer<typeof playerStateSchema>;
export type Effect = z.infer<typeof effectSchema>;
export type Card = z.infer<typeof cardSchema>;

export type GameState = z.infer<typeof gameStateSchema>;
export type Player = z.infer<typeof playerSchema>;
export type QueueEffectAction = z.infer<typeof queueEffectActionSchema>;

export type ActionResult =
	| {
			success: true;
			reason?: string;
	  }
	| { success: false; reason: string };

export type Coordinates = { x: number; y: number };

export type BlockingEffect = {
	message: string;
	type: QueueEffectAction["type"];
	selectSource: "hand" | "discard";
	selectCount: number;
	confirmText: string;
};

export type ChainResult = {
	success: boolean;
	nextGameState: GameState;
	reason?: string; // can be shown to the user
	continue: boolean;
};
