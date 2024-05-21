import {
	CARD_HEIGHT_PX,
	CARD_WIDTH_PX,
	CARD_WIDTH_OVERLAP_PX,
} from "./src/lib/engine/card-list";

const mainBgHex = "#182018";
const mainBg1Hex = "#202820";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			colors: {
				"main-bg": mainBgHex,
				"main-bg-1": mainBg1Hex,
			},
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
			keyframes: {
				"next-action-here-keyframes": {
					"0%, 35%, 65%, 100%": {
						backgroundColor: "#a5f3fc",
					},
					"50%": {
						backgroundColor: mainBgHex,
						color: "#f3f4f6",
						borderColor: "#d1d5db",
					},
				},
				"nothing-to-do-keyframes": {
					"0%, 45%, 55%, 100%": {
						backgroundColor: "#22c55e",
					},
					"50%": {
						backgroundColor: "#166534",
					},
				},
			},
			animation: {
				"next-action-here": "next-action-here-keyframes 1.5s linear infinite",
				"nothing-to-do": "nothing-to-do-keyframes 3s linear infinite",
			},
		},
	},
	corePlugins: {
		backgroundOpacity: false,
	},
	plugins: [],
};
