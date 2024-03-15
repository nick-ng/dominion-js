<script lang="ts">
	export let fullImageUrl: string | null | false = null;

	let style = fullImageUrl
		? `background-image: url("${fullImageUrl}");background-size: cover;background-position: center;`
		: "";
</script>

<div
	class="flex h-card w-card flex-col items-stretch border-2 border-solid bg-black px-1 py-2"
	{style}
>
	<slot />
</div>
