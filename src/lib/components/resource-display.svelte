<script lang="ts">
	import { coinEmoji } from "$lib/emojis";

	let className = "";
	export { className as class };
	export let actions: number;
	export let coins: number;
	export let buys: number;
	export let horizontal = false;
</script>

<table class={className}>
	{#if horizontal}
		<thead>
			<th class="border px-2 py-0.5 text-center">Actions</th>
			<th class="border px-2 py-0.5 text-center">Buys</th>
			<th class="border px-2 py-0.5 text-center">{coinEmoji}</th>
		</thead>
	{/if}
	<tbody>
		{#if horizontal}
			<tr>
				<td class="border px-2 py-0.5 text-center">{actions}</td>
				<td class="border px-2 py-0.5 text-center">{buys}</td>
				<td class="border px-2 py-0.5 text-center">{coins}</td>
			</tr>
		{:else}
			<tr>
				<td class="border px-2 py-0.5">Actions</td>
				<td class="border px-2 py-0.5">{actions}</td>
			</tr>
			<tr>
				<td class="border px-2 py-0.5">{coinEmoji}</td>
				<td class="border px-2 py-0.5">{coins}</td>
			</tr>
			<tr>
				<td class="border px-2 py-0.5">Buys</td>
				<td class="border px-2 py-0.5">{buys}</td>
			</tr>
		{/if}
	</tbody>
</table>
