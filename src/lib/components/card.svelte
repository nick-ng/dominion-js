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

	const getCursorXY = (e: TouchEvent | MouseEvent) => {
		// check MouseEvent because TouchEvent only exists on touch devices
		if (e instanceof MouseEvent) {
			return { x: e.screenX, y: e.screenY };
		}

		let averageX = 0;
		let averageY = 0;

		for (let i = 0; i < e.touches.length; i++) {
			averageX += e.touches[i].screenX;
			averageY += e.touches[i].screenY;
		}

		return {
			x: averageX / e.touches.length,
			y: averageY / e.touches.length,
		};
	};

	let isMouseDown = false;
	let startX = 0;
	let startY = 0;
	let currentX = 0;
	let currentY = 0;
	let isThreshold = false;
	let hoverClass = "";

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
	$: {
		hoverClass = "";
		if (hoverGrow) {
			if (isMouseDown) {
				hoverClass = `${hoverClass} scale-110`;
			} else {
				hoverClass = `${hoverClass} hover:scale-110`;
			}
		}
		if (hoverUp) {
			if (isMouseDown) {
				hoverClass = `${hoverClass} bottom-2`;
			} else {
				hoverClass = `${hoverClass} hover:bottom-2`;
			}
		}
		if (hoverFront) {
			if (isMouseDown) {
				hoverClass = `${hoverClass} z-10`;
			} else {
				hoverClass = `${hoverClass} hover:z-10`;
			}
		}
	}

	function startHandler(e: TouchEvent | MouseEvent) {
		const { x, y } = getCursorXY(e);
		startX = x;
		startY = y;
		currentX = 0;
		currentY = hoverUp ? 10 : 0;

		isMouseDown = true;
	}

	function moveHandler(e: TouchEvent | MouseEvent) {
		const { x, y } = getCursorXY(e);

		if (isMouseDown) {
			currentX = -(startX - x);
			currentY = startY - y;

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
			startX = x;
			startY = y;
		}
	}

	function endHandler() {
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
		currentY = hoverUp ? 10 : 0;
		isMouseDown = false;
	}

	onMount(() => {
		// It's possible to have the mouse move off the card while dragging
		// Listen for a global "mouseup" event
		window.addEventListener("mouseup", endHandler);
	});

	// @todo(nick-ng): add tooltip to cards for extra rules
</script>

{#if card}
	<button
		class={`${className} ${hoverClass} ${hoverFront && isMouseDown ? "z-10" : ""} bottom-0 border-0 p-0 ${draggable && isMouseDown ? "" : "transition-all"}`}
		style={buttonStyle}
		on:click={() => {
			onClick(cardId);
		}}
		on:mousedown={startHandler}
		on:mousemove={moveHandler}
		on:mouseup={endHandler}
		on:touchstart={startHandler}
		on:touchmove={moveHandler}
		on:touchend={endHandler}
	>
		<div class="h-[300px] w-[200px] border-2 border-solid bg-black" {style}>
			<h3>{card.displayNames[0]}</h3>
		</div>
	</button>
{/if}
