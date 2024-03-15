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
	export let dragTarget: HTMLElement | null = null;
	export let initialCenter: { x: number; y: number } = { x: -1, y: -1 };
	export let onClick: (cardId: string) => void | Promise<void> = () => {};
	export let onDragThresholdChange: (
		cardId: string,
		isThreshold: boolean,
	) => void | Promise<void> = () => {};
	export let onDrag: (
		cardId: string,
		cardCenter: { x: number; y: number },
	) => void | Promise<void> = () => {};

	const checkThreshold = (
		thisElement: HTMLElement | null,
		targetElement: HTMLElement | null,
	) => {
		if (!thisElement || !targetElement) {
			return false;
		}

		const thisRect = thisElement.getBoundingClientRect();
		const targetRect = targetElement.getBoundingClientRect();

		const thisCenterX = (thisRect.left + thisRect.right) / 2;
		const thisCenterY = (thisRect.top + thisRect.bottom) / 2;

		return (
			thisCenterX > targetRect.left &&
			thisCenterX < targetRect.right &&
			thisCenterY > targetRect.top &&
			thisCenterY < targetRect.bottom
		);
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
	let cardButtonEl: HTMLElement;
	let buttonStyle2 = "";
	let skipTransition = false;

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
				hoverClass = `${hoverClass} can-hover:hover:scale-110`;
			}
		}
		if (hoverUp) {
			if (isMouseDown) {
				hoverClass = `${hoverClass} bottom-2`;
			} else {
				hoverClass = `${hoverClass} can-hover:hover:bottom-2`;
			}
		}
		if (hoverFront) {
			if (isMouseDown) {
				hoverClass = `${hoverClass} z-10`;
			} else {
				hoverClass = `${hoverClass} can-hover:hover:z-10`;
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

			let newIsThreshold = checkThreshold(cardButtonEl, dragTarget);

			if (isThreshold !== newIsThreshold) {
				onDragThresholdChange(cardId, newIsThreshold);
			}

			isThreshold = newIsThreshold;
		} else {
			startX = x;
			startY = y;
		}
	}

	function endHandler(deliberate: boolean) {
		const isThreshold = checkThreshold(cardButtonEl, dragTarget);

		if (isThreshold) {
			const rect = cardButtonEl.getBoundingClientRect();

			const x = (rect.left + rect.right) / 2;
			const y = (rect.top + rect.bottom) / 2;

			if (deliberate) {
				onDrag(cardId, { x, y });
			}
			onDragThresholdChange(cardId, false);
		}

		currentX = 0;
		currentY = hoverUp ? 10 : 0;
		isMouseDown = false;
	}

	onMount(() => {
		// It's possible to have the mouse move off the card while dragging
		// Listen for a global "mouseup" event as a fallback
		// @todo(nick-ng): figure out a better way to recognise dragging
		window.addEventListener("mouseup", () => endHandler(true));

		if (initialCenter.x >= 0 && initialCenter.y >= 0) {
			skipTransition = true;

			const rect = cardButtonEl.getBoundingClientRect();
			const centerX = (rect.left + rect.right) / 2;
			const centerY = (rect.top + rect.bottom) / 2;

			const adjustX = initialCenter.x - centerX;
			const adjustY = centerY - initialCenter.y;

			buttonStyle2 = `left: ${adjustX}px;bottom: ${adjustY}px;`;

			setTimeout(() => {
				skipTransition = false;
			}, 1);
			setTimeout(() => {
				buttonStyle2 = "transition-duration: 300ms";
			}, 2);
			setTimeout(() => {
				buttonStyle2 = "";
			}, 302);
		}
	});

	// @todo(nick-ng): add tooltip to cards for extra rules
</script>

{#if card}
	<button
		class={`${className} ${hoverClass} ${hoverFront && isMouseDown ? "z-10" : ""} bottom-0 border-0 p-0 ${(draggable && isMouseDown) || skipTransition ? "" : "transition-all"}`}
		style={`${buttonStyle};${buttonStyle2};`}
		bind:this={cardButtonEl}
		on:click={() => {
			onClick(cardId);
		}}
		on:mousedown={startHandler}
		on:mousemove={moveHandler}
		on:mouseup={() => {
			endHandler(true);
		}}
		on:touchstart={startHandler}
		on:touchmove={moveHandler}
		on:touchend={() => {
			endHandler(true);
		}}
		on:mouseleave={() => {
			endHandler(false);
		}}
	>
		<div class="h-card w-card border-2 border-solid bg-black" {style}>
			<h3>{card.displayNames[0]}</h3>
		</div>
	</button>
{/if}
