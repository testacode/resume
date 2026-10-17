# Hero audio

Ambient sea sound behind the hero scenes. On by default; the browser only lets it start after the
first click/tap/key on the page. The speaker icon next to `π` mutes it (remembered in `localStorage`
as `hero:sound`), volume lives in the `π` panel (`hero:volume`).

## Files

- `public/audio/horizon.ogg|m4a` — 50 s seamless loop, low-passed at runtime (distant sea).
- `public/audio/shore.ogg|m4a` — 50 s seamless loop from another stretch of the same recording, full band.
- Opus (`.ogg`) everywhere except Safari, which gets AAC (`.m4a`). Fetched lazily, only when sound starts.

## Source

"Seawash (calm)" — Freesound #176617, **CC0** (public domain, no attribution required).
Found through the Openverse API (`api.openverse.org/v1/audio/?q=…&license=cc0,pdm&source=freesound`).
Candidates auditioned on 2026-10-17; everything else sounded too busy for the scenes.

## Rebuilding a loop

```bash
scripts/make-sea-loop.sh <recording> <horizon|shore> [start_s] [length_s] [target_lufs]
```

Cuts `length_s` (+3 s) from `start_s`, bakes a 3 s crossfade so the file end meets its start sample-exactly
(`AudioBufferSourceNode.loop` is then gapless), normalizes by plain gain to the target integrated loudness
measured with `ffmpeg ebur128` (not by ear), limits at −3 dBTP and encodes both formats. Prints the numbers.

## Rejected on the way

- Synthesis (brown noise + LFO, then a Farnell-style stream of wave events): Carlos heard a constant floor
  and, in the second version, foam bursts that popped in and out. Kept the idea in the backlog as
  "envelope-following resynthesis" (drive pink noise with the envelope/centroid extracted from the recording).
