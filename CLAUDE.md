# Word and Number Land

A learning game for Robert's son: a Reading world and a Numbers world in one web
app. Read `../CLAUDE.md` first for the player, the hard rules and the iPad
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

Numbers (`LEVELS.math`):
1. Feed the monster (apples, sums to 5, tapping an apple counts it out loud)
2. Adding to 10
3. Mystery box (a + ? = c)
4. Take away

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
