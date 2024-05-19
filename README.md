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
- [ ] "complicated" effects (text descriptions)
   - Handle pending actions
- [x] Options
   - [ ] Options menu
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

### ToDo Comments

File | ToDo
:- | :-
`src\lib\stores\game-state.ts` | (@nick-ng): connect to websocket here
`src\lib\stores\game-state.ts` | (@nick-ng): should websocket stuff be in a .svelte file instead?
`src\lib\engine\game.ts` | (@nick-ng): extra step to let players choose which card goes on top of their discard pile?
`src\lib\engine\effects\dominion.ts` | (@nick-ng): use this return signature more
`src\lib\components\symbols\victory-point.svelte` | (@nick-ng): draw your own victory point symbol? 
`src\lib\components\symbols\coin.svelte` | (@nick-ng): draw your own coin symbol? 
`src\lib\components\play-area.svelte` | (@nick-ng): make an array of centers then make discard cards for each one
`src\lib\components\play-area.svelte` | (@nick-ng): put "set-aside" cards here 
`src\lib\components\play-area.svelte` | (@nick-ng): indicate cards you can't play 
`src\lib\components\full-display.svelte` | (@nick-ng): move button highlight class stuff here
`src\lib\components\full-display.svelte` | (@nick-ng): option to invert direction
`src\lib\components\full-display.svelte` | (@nick-ng): active player indicator
`src\lib\components\full-display.svelte` | (@nick-ng): show various opponent info like deck size, hand size, active player, etc. 
`src\lib\components\card.svelte` | (@nick-ng): if you change dragCardFromCenter, existing cards won't change where they get dragged
`src\lib\components\card.svelte` | (@nick-ng): add tooltip to cards for extra rules
`src\app.css` | (@nick-ng): animate nothing-to-do style */
