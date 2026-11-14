# Word and Number Land

A reading and numbers game for the iPad, made for one young player. Plain HTML,
CSS and JS with no build step. It works offline once installed.

- Reading: 10 levels, from short words up to little stories.
- Numbers: feed the monster, adding to 10, mystery box (2 + ? = 5), take away.
- Spelling: missing letter, then spelling words from letter tiles.
- Money: find the coin, count coins, then a toy shop where he pays the exact price.
- Time: day or night, o'clock, half past, quarter past and quarter to.
- The game adapts: it moves him up after a run of right answers and quietly
  back down after misses.
- The iPad's built-in voice reads out instructions, numbers and hints.
- The gear on the home screen is for grown-ups: levels, voice speed, sound,
  reset.

## Run locally

    node serve.js

Then open http://localhost:8082 on this PC, or the iPad address it prints when
the iPad is on the same Wi-Fi.

## Deploy

Push to `main`. GitHub Pages serves it. Bump `CACHE_NAME` in `sw.js` on every
deploy.

## Icons

    node make-icons.js
