# Word and Number Land

A learning game for Robert's son: Reading, Numbers, Spelling, Money and Time
worlds in one web app. Read `../CLAUDE.md` first for the player, the hard rules and the iPad
checklist. This file only covers what is specific to this game. Planned and
built 2026-11-14, after researching Reading Eggs, Teach Your Monster to Read,
Phonics Hero, DragonBox and Todo Math. We use their kinds of mechanics only,
never their names, characters or art.

## Where he is (Robert, 2026-11-14)

- Reading: reads short words, and Robert thinks he can read sentences. Robert
  said the first plan was too easy. Reading starts at level 5 (sentences).
- Numbers: simple adding. When Robert says "algebra" he means missing-number
  puzzles (2 + ? = 5). Numbers starts at level 1.

## Rules that differ from the shared brief

- Words on screen are allowed, because they are what he is learning.
  Instructions are still given by voice and icons only.
- The voice is the iPad's built-in speechSynthesis, which works offline.
  Robert's own recordings may replace it later.
- No losing. A wrong tap gets a boing and that choice fades out. After two
  wrong taps the right answer wiggles. Nothing on screen ever says "wrong".

## Levels

Reading (`LEVELS.read`):
1. Short words to picture
2. Blends to picture
3. Long vowels to picture
4. Hear a sight word, tap it from look-alikes
5. Sentence to picture (the scenes are generated)
6. Silly or not (laughing face or thumbs up)
7. Missing word
8. Build the sentence (tap the word tiles in order)
9. Two sentences plus a picture question
10. Little stories
11. How do they feel? (he has to infer the feeling, the text never names it; added v0.3.0)
12. Story order: tap three sentences into first, next, last (a build round with sentence tiles)
13. Long stories (about 6 sentences, `LONG`) with written-phrase answers, so a picture cannot give it away. 14 stories with 4 questions each.

2026-11-14 playtest: levels 1-10 were too easy. He reads sentences and guesses well, and went
through them fast. Robert asked to "overload" reading. Add harder levels on top and more
content to `LONG`, `FEEL` and `ORDER` before anything else.

Numbers (`LEVELS.math`, rebuilt in v0.3.0 because he was lost at the equations):
1. Feed the monster (add pictures, sums to 5)
2. Add with pictures, with the written sum underneath (to 8)
3. Add numbers (to 10)
4. Mystery box (a + ? = c)
5. Take away
Robert, 2026-11-14: he counts to any number easily, and it's the math itself that is hard.
So there are no counting levels (`countRound` still exists if it's ever wanted).

Teaching ("watch me"): every math round has an `explain()` that returns steps. Each step
runs `fn`, then speaks and waits for the voice to finish (`runSteps`). Apples light up one by
one with a number badge, the mystery box fills apple by apple, and take-away crosses
apples out and then counts what is left. The explanation plays:
- in the first `teach` rounds of a level (2), whenever he
  arrives at a level by moving up or down;
- automatically after his first wrong tap in a round;
- whenever he taps the lightbulb button.
Taught and lightbulb rounds don't change the streak or the miss count. A round where he
tapped wrong first still counts as a miss. `save.mathV = 3` makes the one-time reset of
older saves back to math level 1.

Reading levels are long on purpose (Robert: "we need volume, not so much the difficulty").
Each level has a `goal` of first-try right answers that don't need to be in a row:
15 for levels 1-4, 20 for 5-12, and 30 for 13. A progress bar shows how far through the
level he is. On these levels it takes 3 misses in 4 rounds to drop a level, and he lands 5
right answers short of climbing back. When adding content, add a lot of it.

Spelling (`LEVELS.spell`, added 2026-11-14 v0.2.0, starts at 1):
1. Missing vowel (picture + c_t)
2. Spell short words
3. Spell blends
4. Spell long vowels (letter tiles plus decoy letters)
5. Spell sight words (no picture)

Money (`LEVELS.money`, US coins drawn in CSS, starts at 1):
1. Find the coin
2. Count pennies
3. Nickels plus pennies (the voice counts up 5, 10, 11...)
4. Toy shop with pennies and nickels: tap coins to pay the exact price. If he
   pays too much, the coin bounces back. After two overpays the best coin to
   tap wiggles.
5. Toy shop with all four coins

Time (`LEVELS.time`, SVG clock with a short red hour hand and a long blue
minute hand, starts at 1):
1. Day or night
2. Read the clock (o'clock)
3. Find the clock
4. Half past
5. Quarter past and quarter to

The worlds are listed in the `WORLDS` array (tile icon, colours, cheer lines,
start level). To add a world, add an entry there and in `LEVELS`.

## Moving up and down

- He moves up a level after `need` first-try right answers in a row. That is
  2 for reading level 1, 3 for numbers level 1, and 4 everywhere else.
- He moves down a level, silently, when two of his last three rounds had a
  miss.
- The grown-up gear on the home screen shows his level and lets Robert set it
  with + and -.
- When reading levels 1-3 and 5-10 start, the voice does NOT read the text.
  After 5 seconds the speaker button wiggles and he can tap it to hear the
  text.

## Adding content

All content is in plain arrays near the top of the script: `WORDS1-3`,
`SIGHT`, `ANIMALS`, `THINGS`, `ITEMS`, `SILLY`, `SENSIBLE`, `MISSING`, `BUILD`,
`TWO`, `STORIES`. Use straight ASCII quotes. Wrap any string that contains an
apostrophe in double quotes. Every picture is an emoji, so check that it
renders on iOS.

Save key: `wordnumberland-v1`. Local server port: 8082.

## Art (v0.4.0, 2026-11-14)

The pictures in `art/` are Higgsfield images that Robert approved after seeing samples. He said
"don't burn all my credit", so ask before making more. Model: `gpt_image_2_6`, medium
quality, transparent background for icons and helpers, 0.5 credits each. All 17 cost 8.5
credits. Prompt style: "Soft glossy 3D cartoon style like a modern kids' mobile game,
bright cheerful colors, gentle soft shading, thick rounded shapes".
Convert with PIL to WebP: icons and helpers at 420px (q85), backgrounds at 1400px (q78).
The whole set is about 550 KB.

- `icon-<world>.webp`: the home buttons. `icon-write` is ready for the Writing world.
- `helper-<world>.webp`: the corner helper in each world. The monster (math) chomps; the
  others hop on a right answer and show up big at a level-up. Reading is the owl, Spelling the
  turtle, Money the piggy, Time the clock.
- `bg-<world>.webp` and `bg-home.webp`: backgrounds with an empty middle for the cards.
- `sw.js` precaches every art file. Add any new picture to `ASSETS` there.
