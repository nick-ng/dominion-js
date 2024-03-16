<script lang="ts">
	let className = "";
	export { className as class };
	export let fullImageUrl: string | null | false = null;

	let style = fullImageUrl
		? `background-image: url("${fullImageUrl}");background-size: contain;background-repeat: no-repeat;background-position: center;`
		: "";
</script>

<div
	class={`${className} flex h-card w-card flex-col items-stretch border-2 border-solid bg-black px-1 py-1`}
	{style}
>
	<slot />
</div>
