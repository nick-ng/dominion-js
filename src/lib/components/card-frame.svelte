<script lang="ts">
	let className = "";
	export { className as class };
	export let fullImageUrl: string | null | false = null;
	export let disabled = false;

	$: style = fullImageUrl
		? `background-image: url("${fullImageUrl}");background-size: contain;background-repeat: no-repeat;background-position: center;`
		: "";
</script>

<div
	class={`${className} ${disabled ? "border-gray-600" : ""} flex h-card w-card flex-col items-stretch rounded-xl border-2 border-solid  bg-black px-1 py-1`}
	{style}
>
	<slot />
</div>
