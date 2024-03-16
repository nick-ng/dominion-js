<script lang="ts">
	import { ALL_CARDS } from "$lib/game/card-list";
	import Card from "$lib/components/card.svelte";
</script>

<div>
	{#each Object.values(ALL_CARDS) as card}
		<Card cardId={`${card.name}:0`} />
	{/each}
</div>
