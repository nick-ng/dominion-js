<script lang="ts">
	import { CARD_LIST } from "$lib/game/card-list";
	import Card from "$lib/components/card.svelte";
</script>

<div>
	{#each Object.values(CARD_LIST) as card}
		<Card cardId={`${card.name}:0`} />
	{/each}
</div>
