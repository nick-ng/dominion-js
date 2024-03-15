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

- src/lib/components/card.svelte:165: @todo(nick-ng): figure out a better way to recognise dragging
- src/lib/components/card.svelte:192: @todo(nick-ng): add tooltip to cards for extra rules
