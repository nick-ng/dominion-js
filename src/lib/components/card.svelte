<script lang="ts">
	import type { Coordinates } from "$lib/schemas/types";

	import { onMount } from "svelte";
	import { getCardFromId } from "$lib/engine/card-list";
	import { optionsStore } from "$lib/stores/options";

	import CardContents from "./card-contents.svelte";

	const DRAG_BORDER_X_PX = 30;
	const DRAG_BORDER_Y_PX = 30;
	const WIGGLE_PX = Math.floor(Math.random() * 5) - 2;

	let className = "";
	export { className as class };
	export let upsideDown = false;
	export let cardId: string;
	export let hoverGrow = false;
	export let hoverFront = false;
	export let draggable = false;
	export let dragTarget: HTMLElement | null = null;
	export let initialCenter: Coordinates = { x: -1, y: -1 };
	export let wiggle = false;
	export let onClick: (
		cardId: string,
		cardCenter: Coordinates,
	) => void | Promise<void> = () => {};
	export let onDragThresholdChange: (
		cardId: string,
		isThreshold: boolean,
		cardCenter: Coordinates,
	) => void | Promise<void> = () => {};
	export let onDrag: (
		cardId: string,
		cardCenter: Coordinates,
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
			return {
				x: e.screenX,
				y: e.screenY,
				clientX: e.clientX,
				clientY: e.clientY,
			};
		}

		let totalX = 0;
		let totalY = 0;
		let totalClientX = 0;
		let totalClientY = 0;

		for (let i = 0; i < e.touches.length; i++) {
			totalX += e.touches[i].screenX;
			totalY += e.touches[i].screenY;
			totalClientX += e.touches[i].clientX;
			totalClientY += e.touches[i].clientY;
		}

		return {
			x: totalX / e.touches.length,
			y: totalY / e.touches.length,
			clientX: totalClientX / e.touches.length,
			clientY: totalClientY / e.touches.length,
		};
	};

	const getCardCenter = (): Coordinates => {
		const rect = cardButtonEl.getBoundingClientRect();

		return { x: (rect.left + rect.right) / 2, y: (rect.top + rect.bottom) / 2 };
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
	$: buttonStyle = [
		draggable && isMouseDown && `left: ${currentX}px`,
		draggable && isMouseDown
			? `bottom: ${currentY}px`
			: wiggle && `bottom: ${WIGGLE_PX}px`,
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
		if (hoverFront) {
			if (isMouseDown) {
				hoverClass = `${hoverClass} z-10`;
			} else {
				hoverClass = `${hoverClass} can-hover:hover:z-10`;
			}
		}
	}

	function startHandler(e: TouchEvent | MouseEvent) {
		const { x, y, clientX, clientY } = getCursorXY(e);
		const rect = cardButtonEl.getBoundingClientRect();

		startX = x;
		const l0 = rect.left + DRAG_BORDER_X_PX;
		const r0 = rect.right - DRAG_BORDER_X_PX;
		if (l0 > clientX) {
			startX = x + (l0 - clientX);
		} else if (r0 < clientX) {
			startX = x - (clientX - r0);
		}

		startY = y;
		const t0 = rect.top + DRAG_BORDER_Y_PX;
		const b0 = rect.bottom - DRAG_BORDER_Y_PX;
		if (t0 > clientY) {
			startY = y + (t0 - clientY);
		} else if (b0 < clientY) {
			startY = y - (clientY - b0);
		}

		currentX = 0;
		currentY = 0;

		isMouseDown = true;
	}

	function moveHandler(e: TouchEvent | MouseEvent) {
		const { x, y } = getCursorXY(e);

		if (isMouseDown) {
			currentX = -(startX - x);
			currentY = startY - y;

			let newIsThreshold = checkThreshold(cardButtonEl, dragTarget);

			if (isThreshold !== newIsThreshold) {
				onDragThresholdChange(cardId, newIsThreshold, getCardCenter());
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
			if (deliberate) {
				onDrag(cardId, getCardCenter());
			}
			onDragThresholdChange(cardId, false, getCardCenter());
		}

		currentX = 0;
		currentY = 0;
		isMouseDown = false;
	}

	onMount(() => {
		// It's possible to have the mouse move off the card while dragging
		// Listen for a global "mouseup" event as a fallback
		// @todo(nick-ng): use global mousemove so your mouse cursor doesn't fall off cards
		const windowEndHandler = () => endHandler(false);
		window.addEventListener("mouseup", windowEndHandler);

		if (
			$optionsStore.animationSpeed < 11 &&
			initialCenter.x >= 0 &&
			initialCenter.y >= 0
		) {
			skipTransition = true;

			const rect = cardButtonEl.getBoundingClientRect();
			const centerX = (rect.left + rect.right) / 2;
			const centerY = (rect.top + rect.bottom) / 2;

			const adjustX = initialCenter.x - centerX;
			const adjustY = centerY - initialCenter.y;

			buttonStyle2 = `left: ${adjustX}px;bottom: ${adjustY}px;`;

			const distance = Math.pow(
				Math.pow(adjustX, 2) + Math.pow(adjustY, 2),
				0.5,
			);

			const animationSpeedMs =
				(Math.log(distance) * 5 + 200 / $optionsStore.animationSpeed) *
				(10.1 - $optionsStore.animationSpeed);

			setTimeout(() => {
				skipTransition = false;
			}, 1);
			setTimeout(() => {
				buttonStyle2 = `transition-duration: ${animationSpeedMs}ms`;
			}, 2);
			setTimeout(() => {
				buttonStyle2 = "";
			}, animationSpeedMs + 2);
		}

		const bounceStopper = (e: TouchEvent) => {
			if (isMouseDown) {
				if (draggable) {
					e.preventDefault();
					e.stopPropagation();
				}
			}
		};

		cardButtonEl.addEventListener("touchmove", bounceStopper, {
			passive: false,
		});

		return () => {
			cardButtonEl.removeEventListener("touchmove", bounceStopper);
			window.removeEventListener("mouseup", windowEndHandler);
		};
	});

	// @todo(nick-ng): add tooltip to cards for extra rules
</script>

{#if card}
	<button
		class={`${upsideDown ? "rotate-180" : ""} ${className} ${hoverClass} ${hoverFront && isMouseDown ? "z-10" : ""} bottom-0 border-0 p-0 align-top ${(draggable && isMouseDown) || skipTransition ? "" : "transition-all"}`}
		style={`${buttonStyle};${buttonStyle2};`}
		bind:this={cardButtonEl}
		on:click={() => {
			onClick(cardId, getCardCenter());
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
		<CardContents {card} />
	</button>
{/if}
