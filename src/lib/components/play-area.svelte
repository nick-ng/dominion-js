<script lang="ts">
	import type { PlayerState } from "$lib/schemas/types";
	import Card from "./card.svelte";

	import ResourceDisplay from "./resource-display.svelte";

	export let playerState: PlayerState;
	export let clickedCard = "";
</script>

<div class="border-subtle">
	<div class="flex flex-row justify-start">
		<ResourceDisplay
			class="m-1"
			actions={playerState.actions}
			coins={playerState.coins}
			buys={playerState.buys}
			horizontal
		/>
		<div>{clickedCard}</div>
	</div>
	<div class="flex flex-row justify-center">
		<div
			class="flex flex-shrink flex-row"
			style={`flex-basis: ${200 * playerState.cardsInHand.length * 0.8}px`}
		>
			{#each playerState.cardsInHand as cardId}
				<div class="relative h-[300px] flex-shrink-0 flex-grow basis-[110px]">
					<Card
						class="absolute bottom-0 left-0 transition-all hover:z-10 hover:scale-110"
						{cardId}
						onClick={(cardId) => {
							clickedCard = cardId;
						}}
					/>
				</div>
			{/each}
		</div>
	</div>
</div>
