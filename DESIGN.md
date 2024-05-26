# Dominion JS Design

## Style

### Colours

- Phase advancement button colours
  - No other actions: There is only one action you can perform from this game state. If there is an "auto-end phase" option, this action will be performed
    - Tailwind: `green-500`
    - `.button-nothing-to-do`
    - `#22c55e`
  - Some other actions: There are some actions you can perform from this game state. You might still want to end the current phase to hide information
    - Tailwind: `yellow-400`
    - `.button-something-to-do`
    - `#facc15`
  - Skip multiple game phases: In order to advance to this phase, you need to skip one or more entire phases
    - Tailwind: `orange-300`
    - `.button-lots-to-do`
    - `#fdba74`
- Other button colours
  - Next action here: The controls to perform the current action(s) are not on the main play area. This button will show the controls to do so
    - Tailwind: `cyan-200`
    - `.button-next-action-here`
    - `#a5f3fc`
  - Button is selected
    - Tailwind: `blue-300`
    - `#93c5fd`

### Images

- Normal images: 300x200 pixels
  - Draw them at 1280x720 pixels?
- "Full" images: 300x450 pixels

## Programming

- Try not to copy objects in code that will run on the back-end
  - Mutate objects/arrays if possible, especially in code that runs on the back-end

## Ideas

- Re-skin Dominion with cloud service provider theme?

### Base Game

#### Recommended Starting Set

| Original | Cloud    | Notes |
| :------- | :------- | :---- |
| Cellar   |          |
| Market   |          |
| Merchant |          |
| Militia  |          |
| Mine     |          |
| Moat     | Firewall |
| Remodel  |          |
| Smithy   |          |
| Village  |          |
| Workshop |          |
