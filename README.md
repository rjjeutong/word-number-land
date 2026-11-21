# Word and Number Land

A reading and numbers game for the iPad, made for one young player. Plain HTML,
CSS and JS with no build step. It works offline once installed.

- Reading: 18 levels, from short words up to stories, riddles and "why" questions.
- Numbers: feed the monster, adding to 10, mystery box (2 + ? = 5), take away.
- Spelling: missing letter, then spelling words from letter tiles.
- Money: find the coin, count coins, then a toy shop where he pays the exact price.
- Time: day or night, o'clock, half past, quarter past and quarter to.
- Writing: trace letters with a finger on lined paper, then words, then sentences, with the guide fading.
- Numbers also has a frog that hops along a number line to add and take away.
- Balloons: pop the balloon with the right number, word or answer.
- Thinking: sort things into two baskets (animal or food, hot or cold, even or odd).
- Puzzles: jigsaws from 2 to 16 pieces.
- Coloring: free coloring, then color by number, by color word and by sum.
- Sticker book: he earns stickers as he plays. Tap the star count to open it.
- The game adapts: it moves him up after a run of right answers and quietly
  back down after misses.
- The iPad's built-in voice reads out instructions, numbers and hints.
- The gear on the home screen is for grown-ups: players, levels, voice speed,
  sound, reset.
- Each player keeps their own levels and stars. Add players in the gear, then
  each child taps their animal face on the home screen.

## Run locally

    node serve.js

Then open http://localhost:8082 on this PC, or the iPad address it prints when
the iPad is on the same Wi-Fi.

## Deploy

Push to `main`. GitHub Pages serves it. Bump `CACHE_NAME` in `sw.js` on every
deploy.

## Icons

    node make-icons.js
