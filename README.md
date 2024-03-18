# Dominion-JS
Dominion in JavaScript (TypeScript)

## ToDos

- [x] Drag cards to play
- [x] Drag cards on mobile
- [x] Smooth transition from hand to in-play
- [ ] Cards with "standard" effects (+action, +card, etc.)
- [ ] Cards with "custom" effects (text descriptions)
- [ ] Options
- [ ] Websocket Server
- [ ] Svelte Store for Websockets on front-end
- [ ] Update local state immediately as you play and handle updating as remote state arrives
   - Hash the state after each action and store hashes in an array. If you receive a state with the hash that is in the array, you know you're still in-sync with the server. If you get a hash you haven't seen before, you need to overwrite whatever game state you think you have

### ToDo Comments

- src\lib\stores\game-state.ts:18: // @todo(nick-ng): connect to websocket here
- src\lib\stores\game-state.ts:19: // @todo(nick-ng): should websocket stuff be in a .svelte file instead?
- src\lib\components\symbols\victory-point.svelte:5:<!-- @todo(nick-ng): draw your own victory point symbol? -->
- src\lib\components\symbols\coin.svelte:5:<!-- @todo(nick-ng): draw your own coin symbol? -->
- src\lib\components\play-area.svelte:41: <!-- @todo(nick-ng): make a cardback component -->
- src\lib\components\card.svelte:196: // @todo(nick-ng): figure out a better way to recognise dragging
- src\lib\components\card.svelte:233: // @todo(nick-ng): add tooltip to cards for extra rules
