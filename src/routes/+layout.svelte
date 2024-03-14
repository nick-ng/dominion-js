<script>
	import "../app.css";
</script>

<svelte:head>
	<title>Jurisdiction</title>
</svelte:head>

<div class="relative mx-2 mt-2">
	<nav>
		<a href="simulator">Simulator</a>
	</nav>
	<div class="mainarea">
		<slot />
	</div>
	<p class="mb-2 text-center">All images copyright © 2024 Nick Ng</p>
</div>

<style>
	.mainarea {
		min-height: calc(100vh - 4rem);
	}
</style>
