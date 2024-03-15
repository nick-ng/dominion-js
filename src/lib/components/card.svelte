<script lang="ts">
	import { getCardFromId } from "$lib/game/card-list";
	import { onMount } from "svelte";

	let className = "";
	export { className as class };
	export let cardId: string;
	export let hoverGrow = false;
	export let hoverUp = false;
	export let hoverFront = false;
	export let draggable = false;
	export let dragThresholdX = 0;
	export let dragThresholdY = 300;
	export let onClick: (cardId: string) => void | Promise<void> = () => {};
	export let onDragThresholdChange: (
		cardId: string,
		isThreshold: boolean,
	) => void | Promise<void> = () => {};
	export let onDrag: (cardId: string) => void | Promise<void> = () => {};

	const checkThreshold = (
		currentX: number,
		currentY: number,
		dragThresholdX: number,
		dragThresholdY: number,
	) => {
		if (dragThresholdX < 0 && currentX > dragThresholdX) {
			return false;
		} else if (dragThresholdX > 0 && currentX < dragThresholdX) {
			return false;
		}

		if (dragThresholdY < 0 && currentY > dragThresholdY) {
			return false;
		} else if (dragThresholdY > 0 && currentY < dragThresholdY) {
			return false;
		}

		return true;
	};

	let hoverClass = "";
	if (hoverGrow) {
		hoverClass = `${hoverClass} hover:scale-110`;
	}
	if (hoverUp) {
		hoverClass = `${hoverClass} hover:bottom-2`;
	}
	if (hoverFront) {
		hoverClass = `${hoverClass} hover:z-10`;
	}

	let isMouseDown = false;
	let startX = 0;
	let startY = 0;
	let currentX = 0;
	let currentY = 0;
	let isThreshold = false;

	$: card = getCardFromId(cardId);
	$: isFullImage = card?.fullImage && card?.imageUrl;
	$: buttonStyle = [
		draggable && isMouseDown && `left: ${currentX}px`,
		draggable && isMouseDown && `bottom: ${currentY}px`,
	]
		.filter((a) => a)
		.join(";");
	$: style = [
		isFullImage && `background-image: url("${card?.imageUrl}")`,
		isFullImage && "background-size: cover",
		isFullImage && "background-position: center",
	]
		.filter((a) => a)
		.join(";");

	onMount(() => {
		// It's possible to have the mouse move off the card while dragging
		// Listen for a global "mouseup" event
		window.addEventListener("mouseup", () => {
			isMouseDown = false;
			currentX = hoverUp ? 10 : 0;
			currentY = 0;
		});
	});

	// @todo(nick-ng): add tooltip to cards for extra rules
</script>

{#if card}
	<button
		class={`${className} ${hoverClass} bottom-0 border-0 p-0 ${draggable && isMouseDown ? "" : "transition-all"}`}
		style={buttonStyle}
		on:click={() => {
			onClick(cardId);
		}}
		on:mousedown={(e) => {
			startX = e.screenX;
			startY = e.screenY;

			isMouseDown = true;
		}}
		on:mousemove={(e) => {
			if (isMouseDown) {
				currentX = -(startX - e.screenX);
				currentY = startY - e.screenY;

				let newIsThreshold = checkThreshold(
					currentX,
					currentY,
					dragThresholdX,
					dragThresholdY,
				);

				if (isThreshold !== newIsThreshold) {
					onDragThresholdChange(cardId, newIsThreshold);
				}

				isThreshold = newIsThreshold;
			} else {
				startX = e.screenX;
				startY = e.screenY;
			}
		}}
		on:mouseup={(e) => {
			currentX = -(startX - e.screenX);
			currentY = startY - e.screenY;

			const isThreshold = checkThreshold(
				currentX,
				currentY,
				dragThresholdX,
				dragThresholdY,
			);

			if (isThreshold) {
				onDrag(cardId);
				onDragThresholdChange(cardId, false);
			}

			currentX = 0;
			currentY = 0;
			isMouseDown = false;
		}}
	>
		<div class="h-[300px] w-[200px] border-2 border-solid bg-black" {style}>
			<h3>{card.displayNames[0]}</h3>
		</div>
	</button>
{/if}
