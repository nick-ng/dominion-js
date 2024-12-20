# Dominion-JS
Dominion in JavaScript (TypeScript)

## ToDos

- [x] Drag cards to play
- [x] Drag cards on mobile
- [x] Smooth transition from hand to in-play
- [x] "standard" effects (+action, +card, etc.)
- [x] Play Treasure cards
- [x] Buy cards
- [x] Clean-up cards
   - [x] Put your hand under your in-play cards
   - [ ] Choose which card you want to be the top of your discard pile
   - [ ] Animate clean-up
- [ ] Show cards that have been trashed
- [ ] Clicking on cards in hand while in "select a card" mode should select the card
   - Currently you can only click the card selection buttons
- [ ] "complicated" effects (text descriptions)
   - Handle pending actions
- [ ] Handle "2-part" like Remodel and Mine in a single action
   - Front-end handles each part in turn then constructs a single action to send
- [x] Options
   - [x] Options menu
   - [ ] Control "wiggle"
- [ ] Websocket Server
- [ ] Svelte Store for Websockets on front-end
- [ ] Update local state immediately as you play and handle updating as remote state arrives
   - Hash the state after each action and store hashes in an array. If you receive a state with the hash that is in the array, you know you're still in-sync with the server. If you get a hash you haven't seen before, you need to overwrite whatever game state you think you have
   - "Sort" JSON before hashing so equivalent states match
   - +Card effects still need to wait for the server
- [ ] Animate buying cards
- [ ] Animate clean-up phase
- [ ] Can click on any phase's button
- [ ] Auto-skip directly to phases when there are no actions to perform
   - Do on client side?
   - Perform intermediate actions
- [ ] Handle disconnected players
- [ ] Sound effects
   - Your turn
- [ ] Swap Buy Cards and "Play Treasure and Buy Cards" buttons

### Base Game Cards

Recommended starting 10

- [x] Cellar
- [x] Market
- [x] Merchant
- [ ] Militia
- [ ] Mine
- [ ] Moat
- [x] Remodel
- [x] Smithy
- [x] Village
- [x] Workshop

Other base game cards

- [ ] Artisan
- [ ] Bandit
- [ ] Bureaucrat
- [ ] Chapel
- [ ] Council Room
- [ ] Festival
- [ ] Gardens
- [ ] Harbinger
- [ ] Laboratory
- [ ] Library
- [ ] Moneylender
- [ ] Poacher
- [ ] Sentry
- [ ] Throne Room
- [ ] Vassal
- [ ] Witch

### ToDo Comments

File | ToDo
:- | :-
`src\lib\stores\game-state.ts` | (@nick-ng): connect to websocket here
`src\lib\stores\game-state.ts` | (@nick-ng): should websocket stuff be in a .svelte file instead?
`src\lib\engine\game.ts` | (@nick-ng): extra step to let players choose which card goes on top of their discard pile?
`src\lib\engine\effects\dominion\remodel.ts` | (@nick-ng): trashing a card is mandatory but there may not be any cards in your hand.
`src\lib\engine\effects\dominion\remodel.ts` | (@nick-ng): gaining a card is mandatory but there may not be a card that costs 4 or fewer coins.
`src\lib\engine\effects\dominion\index.ts` | (@nick-ng): use this return signature more
`src\lib\engine\effects\dominion\index.ts` | (@nick-ng): these can be combined with dominionCardEffectFunctions
`src\lib\engine\effects\dominion\index.ts` | (@nick-ng): gaining a card is mandatory but there may not be a card that costs 4 or fewer coins.
`src\lib\components\play-area.svelte` | (@nick-ng): make an array of centers then make discard cards for each one
`src\lib\components\play-area.svelte` | (@nick-ng): put "set-aside" cards here 
`src\lib\components\play-area.svelte` | (@nick-ng): indicate cards you can't play 
`src\lib\components\play-area.svelte` | (@nick-ng): overrideBlocker not used? 
`src\lib\components\full-display.svelte` | (@nick-ng): move button highlight class stuff here
`src\lib\components\full-display.svelte` | (@nick-ng): active player indicator
`src\lib\components\full-display.svelte` | (@nick-ng): show various opponent info like deck size, hand size, active player, etc. 
`src\lib\components\card.svelte` | (@nick-ng): add tooltip to cards for extra rules
`src\lib\components\symbols\victory-point.svelte` | (@nick-ng): draw your own victory point symbol? 
`src\lib\components\symbols\coin.svelte` | (@nick-ng): draw your own coin symbol? 
`src\lib\components\supply-pile.svelte` | (@nick-ng): check that this still works
