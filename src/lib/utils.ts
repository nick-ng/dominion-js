import type { GameState } from "./schemas/types";
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

export function getTurnSeed(gameState: GameState, adjustment?: number): number {
	const playerStates = Object.values(gameState.playerStates);

	let cardsInPlay = 0;
	for (let i = 0; i < playerStates.length; i++) {
		cardsInPlay += playerStates[i].inPlay.length;
	}

	const temp = `${adjustment || 0}${gameState.turn}${cardsInPlay}${gameState.gameSeed}`;

	return parseInt(temp, 10);
}
