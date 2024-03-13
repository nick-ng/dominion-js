import z from "zod";

import { playerStateSchema, cardSchema } from "./game";

export type PlayerState = z.infer<typeof playerStateSchema>;

export type Card = z.infer<typeof cardSchema>;
