<script lang="ts">
	import { getCardFromId } from "$lib/game/card-list";

	let className = "";
	export { className as class };
	export let cardId: string;
	export let onClick: (cardId: string) => void | Promise<void> = () => {};

	$: card = getCardFromId(cardId);
	$: style =
		card?.fullImage && card?.imageUrl
			? `background-image: url("${card.imageUrl}");
			background-size: cover;
			background-position: center;`
			: "";
</script>

{#if card}
	<button
		on:click={() => {
			onClick(cardId);
		}}
	>
		<div
			class={`${className} card-style h-[300px] w-[200px] border-4 bg-black`}
			{style}
		>
			<h3>{card.displayNames[0]}</h3>
		</div>
	</button>
{/if}

<style>
	.card-style {
		border-style: outset;
	}
</style>
