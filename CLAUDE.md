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
14. Riddles: read the clues, tap the written answer (`RIDDLES`; added v0.7.0 with 15-18)
15. Opposites and same-meaning words (`WORDQ`)
16. Which one does not belong: four sentences, three go together (`ODD`)
17. What happens next (`NEXT`)
18. Why: the text never gives the reason, he works it out (`WHY`)

Robert, 2026-11-21: "add more reading games and more difficult". Levels 14-18 have 30 to 49
items each and a goal of 20. `qaRound` builds any text + question + three written answers.

2026-11-14 playtest: levels 1-10 were too easy. He reads sentences and guesses well, and went
through them fast. Robert asked to "overload" reading. Add harder levels on top and more
content to `LONG`, `FEEL` and `ORDER` before anything else.

Numbers (`LEVELS.math`, rebuilt in v0.3.0 because he was lost at the equations):
1. Feed the monster (add pictures, sums to 5)
2. Add with pictures, with the written sum underneath (to 8)
3. Add numbers (to 10)
4. Mystery box (a + ? = c)
5. Take away with your finger (v0.7.0, Robert's idea): for 6 - 4 he sees 6 apples and taps 4
   away himself. The answer tiles are dimmed (`.choices.wait`) until he has taken 4. Then
   tapping the apples that are left counts them. One "watch me" round. `tapTakeRound`
   uses the `setup` hook, which `renderChoice` calls after it draws a round.
6. Take away (no pictures of the answer, and no "watch me" rounds: see Players below)
7. Frog hops forward on the number line (add)
8. Frog hops back (take away)
9. Frog hops both ways
Robert, 2026-11-14: he counts to any number easily, and it's the math itself that is hard.
So there are no counting levels (`countRound` still exists if it's ever wanted).

Teaching ("watch me"): every math round has an `explain()` that returns steps. Each step
runs `fn`, then speaks and waits for the voice to finish (`runSteps`). Apples light up one by
one with a number badge, the mystery box fills apple by apple, and take-away crosses
apples out and then counts what is left. The explanation plays:
- in the first `teach` rounds of a level, whenever he arrives at a level by moving up or
  down. Robert, 2026-11-21: on the adding levels this gave the answer away, so levels 1-4 now
  have `teach: 0`. Only the two levels with a new way of playing keep one demo round (take
  away with your finger, and the frog);
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

## Livelier games (v0.8.0, 2026-11-21)

Robert asked for "more vibrant interactive educational games" with Higgsfield art. Four things
were added. Each has its own round `kind`, and `renderRound` picks the renderer.

- **Balloons world** (`pop`, kind `pop`, `renderPop`): five balloons float up for ever, so there
  is no hurry. The voice says what to pop (a number, a sight word, the answer to a sum, an opposite).
  A wrong balloon fades. After two wrong ones the right one glows. One balloon picture is tinted
  with `hue-rotate` to make the colours.
- **Frog on the number line** (Numbers levels 7-9, kind `frog`, `renderFrog`): pads 0 to 10. He
  taps the pad where the frog lands, or drags the frog there. The frog then hops one pad at a
  time while the voice counts, so he can see too many or too few. A miss plays `explain()`.
- **Thinking world** (`sort`, kind `sort`, `renderSort`): one thing at a time, drag it into one of
  two baskets or tap the basket. Five things a round. The sets are in `SORTS` (animal or food,
  wear or ride, land or water, hot or cold, flies or not, alive or not, less or more than 10,
  even or odd). To add a level, add a set there and a line in `LEVELS.sort`.
- **Sticker book**: 15 stickers in `STICKERS`, files `art/st-<id>.webp`. He gets one at every
  level-up, at every 25 stars (`STICKER_EVERY`), and one on his first finished round. New ones
  come first, then seconds with a count badge. Each player has their own (`save.stickers`). The
  star count on the home screen is the button that opens the book.

The home screen now has 8 worlds: four across when the iPad is wide, two across when it is tall.

Art for v0.8.0: 7 Higgsfield images, 7 credits (medium quality is now 1 credit each, not 0.5).
To stay cheap, small pictures are generated as one sheet (for example 6 stickers in a 3 by 2
grid on a transparent background) and cut apart with PIL by connected shapes. Two stickers
from the first sheet (a red car with a face, a purple dragon) were left out because they
looked too much like well-known film and game characters, and were replaced.

## More games and levels (v0.9.0, 2026-11-21)

Robert: "add more games and more levels". No new art was made for this.

- Thinking levels 9-11, "what comes next": picture patterns (`patternRound`, templates like
  'AB' or 'AABB') and number patterns that count by 1, 2, 5 or 10 (`numPatternRound`).
- Thinking levels 12-15, memory pairs (kind `match`, `renderMatch`): turn over two cards. A
  pair stays open, anything else turns back. Picture pairs (6 cards), then word and picture,
  sum and answer, and opposites (8 cards). A round only counts as a miss after a lot of wrong
  turns, because looking under cards is how the game is played. These levels need 2 rounds.
- Balloons levels 7-10: pop what comes next, pop the rhyme (`RHYMES`), pop the missing number,
  pop the double.
- Numbers levels 10-14: bigger or smaller to 99 (the elephant wants the bigger number, the ant
  the smaller), doubles, add to 20, take away within 20, add three numbers. These have no
  pictures. Their `explain()` counts on or back in yellow chips (`countChips`).
- Time levels 6-7: five-minute times (3:25), and find the clock for any time.

## Players (v0.6.0, 2026-11-21)

Robert asked for other kids to play without taking over his son's place. The save is now
`store`: `{ v: 2, cur, sound, rate, kids: [...] }`. Each kid has `face` (an animal emoji from
`FACES`), an optional `name`, `stars`, `w` (the per-world levels) and `mathV`. `save` always
points at `store.kids[store.cur]`, so the game code still reads `save.w` and `save.stars`.
Sound and voice speed are shared. An older one-player save becomes player 1 on load.

- The game still opens straight into the last player. With two or more players, their faces
  sit next to the star count on the home screen and a tap switches. With one player nothing shows.
- Players are added, named, given a face and removed in the grown-up gear (up to `MAX_KIDS`, 5).
  Names stay in localStorage on the device. Never put a child's name in the code.
- Player 1 starts at each world's `start` level. Added players start at level 1 everywhere, and
  Robert can place them with + and -. "Hold to reset" resets only the player who is playing.
- The home tiles show one progress bar (level out of levels) and one star. A star per level
  ran off the tile once Reading had 13 levels.

Take away (math level 6, `takeRound`) has `teach: 0` and draws every apple whole, because the faded
apples gave the answer away (Robert, 2026-11-21: "he never really thinks"). The crossing-out
only happens in `explain()` after a wrong tap or the lightbulb, and in `onRight`.

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

## Writing (v0.5.0, 2026-11-14)

Robert asked to "teach him how to write. draw letters and words and sentences". The `write`
world draws handwriting paper on a canvas (`renderTrace`): a blue top line, a dashed middle line
and a red base line. Letters are hand-made stroke paths in `LOWER_G` and `UPPER_G`, plain print
with the strokes in teaching order. A pulsing green dot (with an arrow on guided levels) shows
where to start and which way to go. His finger has to stay within about 0.2 of the letter
height of the path, and lifting his finger keeps his progress. Each stroke fills in with crayon
colour; dots (i, j, the full stop) are taps. A finished letter bursts and the voice says its name.
The first round of levels 1-3 runs `r.demo` ("Watch me first"), where the crayon writes the
first letter by itself.

Levels: 1 little letters, 2 big letters, 3 short words, 4 letters with only a faint guide,
5 words with a faint guide, 6 sentences, 7 sentences with a faint guide. These levels use `goal`
like reading. A tracing round can't be failed, so he never drops a level here.
Helper: the crayon. Background: an art room. These 2 pictures cost 1 credit.
To add a letter shape or punctuation, add strokes to the glyph tables. `__wnl.glyphOf(ch)` is
the test hook for drawing and checking them.
