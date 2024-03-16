import {
	CARD_HEIGHT_PX,
	CARD_WIDTH_PX,
	CARD_WIDTH_OVERLAP_PX,
} from "./src/lib/game/card-list";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			screens: {
				"can-hover": { raw: "(hover: hover)" },
				"cannot-hover": { raw: "(hover: none)" },
			},
			height: {
				card: `${CARD_HEIGHT_PX}px`,
			},
			width: {
				prose: "65ch",
				card: `${CARD_WIDTH_PX}px`,
				"card-overlap": `${CARD_WIDTH_OVERLAP_PX}px`,
			},
			flexBasis: {
				prose: "65ch",
				"card-overlap": `${CARD_WIDTH_OVERLAP_PX}px`,
			},
			fontFamily: {
				good: '"Comic Sans MS", sans-serif',
			},
			spacing: {
				"full-1": "calc(100% + 0.25rem)",
				"full-1.5": "calc(100% + 0.375rem)",
				"full-2": "calc(100% + 0.5rem)",
			},
			border: {
				outset: "outset",
			},
		},
	},
	plugins: [],
};
