<script>
	import "../app.css";
</script>

<svelte:head>
	<title>Jurisdiction</title>
</svelte:head>

<div class="relative mx-2 mt-2">
	<nav class="mb-1">
		<a class="button-default inline-block px-2 no-underline" href="simulator"
			>Simulator</a
		>
		<a class="button-default inline-block px-2 no-underline" href="card-list"
			>Card List</a
		>
	</nav>
	<div class="mainarea">
		<slot />
	</div>
	<!-- All images copyright © 2024 Nick Ng -->
</div>

<style>
	.mainarea {
		min-height: calc(100vh - 4.25rem);
	}
</style>
