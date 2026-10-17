#!/usr/bin/env bash
# Builds the GitHub profile banner GIF from two capture folders made by scripts/capture-hero.mjs.
#   scripts/make-hero-banner.sh <horizonDir> <shoreDir> <out.gif> [fps=6] [width=720] [colors=64] [secs_per_scene=4]
# Crops a 1280x400 band from y=60 (sun + horizon / shoreline + name), no extra dithering (the scenes
# already dither; GIF dithering doubles the size). 720px / 6 fps / 64 colors ≈ 1.7 MB.
set -euo pipefail
h=$1; s=$2; out=$3; fps=${4:-6}; w=${5:-720}; colors=${6:-64}; secs=${7:-4}
rate() { python3 -c "import json;t=json.load(open('$1/stamps.json'));print(round((len(t)-1)/(t[-1]-t[0])))"; }
rh=$(rate "$h"); rs=$(rate "$s")
ffmpeg -hide_banner -loglevel error -y -framerate "$rh" -i "$h/f%04d.png" -framerate "$rs" -i "$s/f%04d.png" -filter_complex \
"[0:v]trim=start=1:duration=$secs,setpts=PTS-STARTPTS[a];[1:v]trim=start=1:duration=$secs,setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1:a=0,fps=$fps,crop=1280:400:0:60,scale=$w:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=$colors:stats_mode=diff[p];[s1][p]paletteuse=dither=none:diff_mode=rectangle" \
-loop 0 "$out"
ls -la "$out" | awk '{printf "%s %.1f MB\n", $9, $5/1048576}'
