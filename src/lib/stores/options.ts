import { writable } from "svelte/store";
import { browser } from "$app/environment";

const OPTIONS_LOCAL_STORAGE_KEY = "PUX_JURISDICTION_OPTIONS";

type Options = {
	animationSpeed: number;
	opponentAllUpsideDown: boolean;
	dragCardFromCenter: boolean;
	showFullScreenButton: boolean;
	invertScrollDirection: boolean;
};

let storedOptions: Options = {
	animationSpeed: 5,
	opponentAllUpsideDown: false,
	dragCardFromCenter: false,
	showFullScreenButton: true,
	invertScrollDirection: false,
};

if (browser) {
	try {
		const storedOptionsString = localStorage.getItem(OPTIONS_LOCAL_STORAGE_KEY);

		if (storedOptionsString) {
			storedOptions = {
				...storedOptions,
				...JSON.parse(storedOptionsString),
			};
		}
	} catch (e) {
		console.error("could not load options", e);
	}
}

export const optionsStore = writable<Options>(storedOptions);

if (browser) {
	optionsStore.subscribe((newOptions) => {
		localStorage.setItem(OPTIONS_LOCAL_STORAGE_KEY, JSON.stringify(newOptions));
	});
}
