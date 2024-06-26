import z from "zod";

import {
	playerSchema,
	playerStateSchema,
	cardSchema,
	gameStateSchema,
	effectSchema,
	queuedEffectSchema,
	queueEffectActionSchema,
} from "./game";

export type PlayerState = z.infer<typeof playerStateSchema>;
export type Effect = z.infer<typeof effectSchema>;
export type Card = z.infer<typeof cardSchema>;

export type GameState = z.infer<typeof gameStateSchema>;
export type Player = z.infer<typeof playerSchema>;
export type QueuedEffect = z.infer<typeof queuedEffectSchema>;
export type QueueEffectAction = z.infer<typeof queueEffectActionSchema>;

export type ActionResult =
	| {
			success: true;
			reason?: string;
	  }
	| { success: false; reason: string };

export type Coordinates = { x: number; y: number };
export type Dimensions = { width: number; height: number };

type BlockingEffectButton = {
	text: string;
	className?: string;
	args?: (string | number)[];
	onClick?: () => void | Promise<void>;
	disabled?: boolean;
};

export type BlockingEffect = {
	message: string;
	confirmMessage?: string;
	type: QueueEffectAction["type"];
	selectSource: "hand" | "discard" | "supply";
	selectCount: number;
	minCost: number;
	maxCost: number;
	buttons?: BlockingEffectButton[];
};

export type ChainResult = {
	success: boolean;
	nextGameState: GameState;
	reason?: string; // can be shown to the user
	continue: boolean;
	log?: string;
};
