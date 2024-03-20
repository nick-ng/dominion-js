<script>
	import "../app.css";
</script>

<svelte:head>
	<title>Jurisdiction</title>
</svelte:head>

<div class="flex h-screen max-h-screen flex-col justify-start px-2 pt-2">
	<nav class="mb-1">
		<a class="button-default inline-block px-2 no-underline" href="simulator"
			>Simulator</a
		>
		<a class="button-default inline-block px-2 no-underline" href="card-list"
			>Card List</a
		>
	</nav>
	<slot />
	<!-- All images copyright © 2024 Nick Ng -->
</div>
