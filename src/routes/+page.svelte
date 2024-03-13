<script>
	import { PUBLIC_API_HOST } from "$env/static/public";
</script>

<div>
	<h1>V2 Site!</h1>
	<p>API Host: {PUBLIC_API_HOST}</p>
	<button
		on:click={async () => {
			const res = await fetch(`${PUBLIC_API_HOST}/hello`);
			const resText = await res.text();

			console.log("resText", resText);
		}}>Click!</button
	>
</div>
