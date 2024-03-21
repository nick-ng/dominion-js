import { writable } from "svelte/store";
import { browser } from "$app/environment";

const OPTIONS_LOCAL_STORAGE_KEY = "PUX_JURISDICTION_OPTIONS";

type Options = { animationSpeed: number; opponentAllUpsideDown: boolean };

let storedOptions: Options = {
	animationSpeed: 5,
	opponentAllUpsideDown: false,
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
	} catch (_e) {
		// noop
	}
}

export const optionsStore = writable<Options>(storedOptions);

if (browser) {
	optionsStore.subscribe((newOptions) => {
		localStorage.setItem(OPTIONS_LOCAL_STORAGE_KEY, JSON.stringify(newOptions));
	});
}
