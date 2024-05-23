<script lang="ts">
	import type {
		GameState,
		Coordinates,
		QueueEffectAction,
		BlockingEffect,
	} from "$lib/schemas/types";

	import { gameStateStore } from "$lib/stores/game-state";
	import { getActivePlayerId, getOpponentOrder } from "$lib/helpers";
	import { optionsStore } from "$lib/stores/options";
	import ResourceDisplay from "./resource-display.svelte";
	import PlayArea from "./play-area.svelte";
	import Supply from "./supply.svelte";
	import { onMount } from "svelte";
	import { getCardFromId } from "$lib/engine/card-list";

	export let playerId: string;
	export let onBuy: (
		cardName: string,
		cardCenter: Coordinates,
	) => void | Promise<void> = () => {};
	export let onPlayCard: (
		cardName: string,
		cardCenter: Coordinates,
	) => void | Promise<void> = () => {};
	export let onEndPhase: (
		phaseName: GameState["turnPhase"],
	) => void | Promise<void> = () => {};
	export let onPlayEffect: (
		queueEffectAction: QueueEffectAction,
	) => void | Promise<void> = () => {};

	const vignetteClasses = {
		none: "no-vignette -left-full right-full-2 pointer-events-none",
		faded: "no-vignette left-0 right-0 pointer-events-none",
		visible: "vignette left-0 right-0",
	};

	let boughtCardCenter: Coordinates = { x: -1, y: -1 };
	let showMyBoard = true;
	let showSupply = false;
	let vignetteClass = vignetteClasses.none;
	let endActionsHint = false;
	let buyCardsHint = false;
	let endTurnHint = false;
	let gamePhaseMessage = "";
	let blockingEffect: BlockingEffect | null = null;

	const setShowSupply = (newVisibility: boolean): void => {
		if (newVisibility) {
			showSupply = true;
			vignetteClass = vignetteClasses.visible;
		} else {
			showSupply = false;
			vignetteClass = vignetteClasses.faded;
			setTimeout(() => {
				vignetteClass = vignetteClasses.none;
			}, transitionDurationMs);
		}
	};
	const getShowSupplyClass = (
		gamePhaseName: string,
		blockingEffectName: string | undefined,
	): string => {
		if (
			gamePhaseName === "buy-1" ||
			(blockingEffectName && ["workshop-1"].includes(blockingEffectName))
		) {
			return "button-next-action-here";
		}

		return "";
	};

	$: transitionDurationMs = $optionsStore.animationSpeed > 10 ? 0 : 100;
	$: transitionDurationStyle = `transition-duration: ${transitionDurationMs}ms;`;
	$: showStyle = `${transitionDurationStyle}flex-grow: 100; flex-shrink: 0.001;`;
	$: hideStyle = `${transitionDurationStyle}flex-grow: 0.001; flex-shrink: 100;`;
	$: myPlayerState = $gameStateStore.gameState?.playerStates[playerId];
	$: actionCardCount =
		myPlayerState?.hand.filter((cardId) => {
			return getCardFromId(cardId)?.types.includes("action");
		}).length || 0;
	$: actionCardClass =
		actionCardCount === 0 || myPlayerState?.actions === 0
			? "button-nothing-to-do"
			: "button-something-to-do";
	$: treasureCardCount =
		myPlayerState?.hand.filter((cardId) => {
			return getCardFromId(cardId)?.types.includes("treasure");
		}).length || 0;
	$: treasureCardClass =
		treasureCardCount === 0 ? "button-nothing-to-do" : "button-something-to-do";
	$: endTurnClass =
		myPlayerState?.buys === 0
			? "button-nothing-to-do"
			: "button-something-to-do";
	$: activePlayerId = getActivePlayerId($gameStateStore.gameState);
	$: activePlayer = $gameStateStore.gameState?.players[activePlayerId];
	$: {
		if (activePlayerId !== playerId) {
			endActionsHint = false;
			buyCardsHint = false;
			endTurnHint = false;

			gamePhaseMessage = `${activePlayer?.name}'s turn`;
		} else if (blockingEffect) {
			endActionsHint = false;
			buyCardsHint = false;
			endTurnHint = false;

			gamePhaseMessage = blockingEffect.message;
		} else {
			// @todo(nick-ng): move button highlight class stuff here
			switch ($gameStateStore.gameState?.turnPhase) {
				case "action": {
					endActionsHint = true;
					buyCardsHint = false;
					endTurnHint = false;

					gamePhaseMessage = "Action Phase";
					break;
				}
				case "buy-0": {
					endActionsHint = false;
					buyCardsHint = true;
					endTurnHint = false;

					gamePhaseMessage = "Buy Phase";
					break;
				}
				case "buy-1": {
					endActionsHint = false;
					buyCardsHint = false;
					endTurnHint = true;

					gamePhaseMessage = "Buy Phase";
					break;
				}
				default: {
					endActionsHint = false;
					buyCardsHint = false;
					endTurnHint = false;

					gamePhaseMessage = "Clean-up Phase";
				}
			}
		}
	}
	$: {
		blockingEffect = null;
		if (myPlayerState && myPlayerState.queuedEffects.length > 0) {
			for (let i = 0; i < myPlayerState.queuedEffects.length; i++) {
				const tempEffect = myPlayerState.queuedEffects[i];
				if (tempEffect.blocksPlayer || tempEffect.blocksEveryone) {
					switch (tempEffect.type) {
						case "cellar-1": {
							blockingEffect = {
								type: "cellar-1",
								message: tempEffect.message || "",
								selectCount: 0,
								selectSource: "hand",
								minCost: -Infinity,
								maxCost: Infinity,
								buttons: [
									{
										text: "Discard",
									},
								],
							};
							break;
						}
						case "workshop-1": {
							setShowSupply(true);

							blockingEffect = {
								type: "workshop-1",
								message: tempEffect.message || "",
								confirmMessage: "Gain %card-name%",
								selectCount: 0,
								selectSource: "supply",
								minCost: -Infinity,
								maxCost: 4,
								buttons: [
									{
										text: "Open Supply",
										className: "button-next-action-here",
										onClick: () => {
											setShowSupply(true);
										},
									},
									{
										text: "Skip",
										className: "button-lots-to-do",
										onClick: () => {
											onPlayEffect({
												type: "workshop-1",
												playerId,
												payloadArray: [],
											});
											setShowSupply(false);
										},
									},
								],
							};
							break;
						}
					}
					break;
				}
			}
		}
	}

	onMount(() => {
		const wheelHandler = (event: WheelEvent) => {
			if (!showSupply) {
				if ($optionsStore.invertScrollDirection) {
					showMyBoard = event.deltaY < 0;
				} else {
					showMyBoard = event.deltaY > 0;
				}
			}
		};

		window.addEventListener("wheel", wheelHandler);

		let prevTouchY = 0;
		const touchStartHandler = (event: TouchEvent) => {
			let totalY = 0;
			for (let i = 0; i < event.touches.length; i++) {
				totalY += event.touches[i].screenY;
			}

			if (!showSupply) {
				prevTouchY = totalY / event.touches.length;
			}
		};

		const touchHandler = (event: TouchEvent) => {
			let totalY = 0;
			for (let i = 0; i < event.touches.length; i++) {
				totalY += event.touches[i].screenY;
			}

			const newTouchY = totalY / event.touches.length;

			if (!showSupply) {
				if ($optionsStore.invertScrollDirection) {
					showMyBoard = newTouchY > prevTouchY;
				} else {
					showMyBoard = newTouchY < prevTouchY;
				}
			}
		};

		window.addEventListener("touchstart", touchStartHandler);
		window.addEventListener("touchmove", touchHandler);

		return () => {
			window.removeEventListener("wheel", wheelHandler);
			window.removeEventListener("touchstart", touchStartHandler);
			window.removeEventListener("touchmove", touchHandler);
		};
	});

	// @todo(nick-ng): active player indicator
</script>

<div
	class="flex shrink grow flex-col items-stretch justify-start gap-2 overflow-hidden"
>
	<slot />
	{#if $gameStateStore.gameState?.playerStates[activePlayerId]}
		<div
			class="relative overflow-hidden border-b border-b-gray-600 transition-all"
			style={showMyBoard ? hideStyle : showStyle}
		>
			<PlayArea
				class="mb-[-1px]"
				gameState={$gameStateStore.gameState}
				{boughtCardCenter}
				playerId={activePlayerId !== playerId
					? activePlayerId
					: getActivePlayerId($gameStateStore.gameState, -1)}
				opponent
			/>
		</div>
		<div class="flex flex-row justify-between">
			<h2 class="text-center">{activePlayer?.name}</h2>
			<!-- @todo(nick-ng): show various opponent info like deck size, hand size, active player, etc. -->
			{getOpponentOrder(playerId, $gameStateStore.gameState)
				.map((p) => $gameStateStore.gameState?.players[p].name)
				.join(", ")}
			<ResourceDisplay actions={0} buys={0} coins={0} horizontal />
		</div>
		<button
			on:click={() => {
				showMyBoard = !showMyBoard;
			}}>Toggle</button
		>
		{#if myPlayerState}
			<div
				class="overflow-hidden transition-all"
				style={showMyBoard ? showStyle : hideStyle}
			>
				<div class="relative mb-2 flex flex-row items-stretch gap-2">
					<button
						class={getShowSupplyClass(
							$gameStateStore.gameState.turnPhase,
							blockingEffect?.type,
						)}
						on:click={() => {
							setShowSupply(true);
						}}>Show Supply</button
					>
					<div class="grow" />
					<h2 class="pointer-events-none self-center">You</h2>
					<div class="grow" />

					<div class="relative">
						<div
							class="absolute bottom-0 right-full-2 top-0 my-auto flex flex-row items-center whitespace-nowrap text-xl"
						>
							{gamePhaseMessage}
						</div>
						<button
							class={`${endActionsHint ? actionCardClass : ""} h-full`}
							on:click={() => {
								onEndPhase("action");
							}}
							disabled={!endActionsHint}>End Actions</button
						>
					</div>
					<button
						class={buyCardsHint ? treasureCardClass : ""}
						on:click={() => {
							if (
								activePlayerId === playerId &&
								$gameStateStore.gameState?.turnPhase === "buy-0"
							) {
								setShowSupply(true);
							}

							onEndPhase("buy-0");
						}}
						disabled={!buyCardsHint}>Buy Cards</button
					>
					<button
						class={endTurnHint ? endTurnClass : ""}
						on:click={() => {
							onEndPhase("buy-1");
						}}
						disabled={!endTurnHint}>End Turn</button
					>
					<ResourceDisplay
						actions={myPlayerState.actions}
						buys={myPlayerState.buys}
						coins={myPlayerState.coins}
						horizontal
					/>
				</div>
				<!-- Player's Play Area -->
				<PlayArea
					gameState={$gameStateStore.gameState}
					{boughtCardCenter}
					{playerId}
					{blockingEffect}
					{onPlayCard}
					onPlayAllTreasures={() => {
						onEndPhase("buy-0");

						if (myPlayerState && myPlayerState.buys > 0) {
							setShowSupply(true);
						}
					}}
					{onPlayEffect}
				/>
			</div>
		{/if}
		<!-- Vignette Button -->
		<button
			class={`${vignetteClass} transition-some absolute bottom-0 top-0 z-50 m-0 h-full w-full border-none p-0`}
			style={transitionDurationStyle}
			on:click={(e) => {
				if (e.target === e.currentTarget) {
					setShowSupply(false);
				}
			}}
		>
			<div
				class={`${showSupply ? "left-4 right-4" : "-left-full right-full-2"} absolute bottom-0 top-0 my-auto flex h-min w-auto flex-col justify-center overflow-hidden bg-main-bg`}
				style={transitionDurationStyle}
			>
				{#if showSupply}
					<Supply
						playerState={myPlayerState}
						{blockingEffect}
						gameState={$gameStateStore.gameState}
						onBuy={(cardName, cardCenter) => {
							boughtCardCenter = cardCenter;
							onBuy(cardName, cardCenter);
						}}
						onCommitChoice={(cardName, cardCenter) => {
							if (!blockingEffect) {
								return;
							}

							boughtCardCenter = cardCenter;

							onPlayEffect({
								type: blockingEffect.type,
								playerId,
								payloadArray: [cardName],
							});
							setShowSupply(false);
						}}
						onHide={() => {
							setShowSupply(false);
						}}
					/>
				{/if}
			</div>
		</button>
	{/if}
</div>

<style lang="postcss">
	.transition-some {
		transition-property: background;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}
</style>
