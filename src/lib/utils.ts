import { randomNumbers } from "./random-numbers";

export function getRandomGameSeed() {
	return Math.floor(Math.random() * randomNumbers.length * 2);
}

export function* randomGenerator(seed: number) {
	const temp = seed % (randomNumbers.length * 2);
	const offset = Math.floor(seed) % randomNumbers.length;
	let index = 0;

	if (temp < randomNumbers.length) {
		for (let i = 0; i < randomNumbers.length; i++) {
			index = (i + offset) % randomNumbers.length;

			yield randomNumbers[index];
		}
	} else {
		for (let i = 0; i < randomNumbers.length; i++) {
			index = (i + offset) % randomNumbers.length;

			yield randomNumbers[randomNumbers.length - index - 1];
		}
	}

	return randomNumbers[offset];
}

export function shuffle<T>(deck: T[], seed: number): T[] {
	let random = randomGenerator(seed);

	const shuffledDeck = deck
		.map((card) => {
			let temp = random.next();
			if (temp.done) {
				random = randomGenerator(temp.value || seed);

				temp = random.next();
			}

			return {
				order: temp.value,
				card,
			};
		})
		.sort((a, b) => a.order - b.order);

	return shuffledDeck.map(({ card }) => card);
}
