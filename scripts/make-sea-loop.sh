#!/usr/bin/env bash
# Builds a seamless, loudness-normalized sea loop for the hero from any recording.
#   scripts/make-sea-loop.sh <source> <name> [start_s] [length_s] [target_lufs] [lowpass_hz]
# Output: public/audio/<name>.ogg (Opus) and public/audio/<name>.m4a (AAC, Safari).
# The loop seam is a 3 s crossfade baked into the file, so `AudioBufferSourceNode.loop` is gapless.
set -euo pipefail
src=$1; name=$2; start=${3:-10}; len=${4:-50}; target=${5:--20}; lowpass=${6:-20000}
xf=3
out_dir="$(cd "$(dirname "$0")/.." && pwd)/public/audio"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

ffmpeg -hide_banner -loglevel error -y -i "$src" -ss "$start" -t "$((len + xf))" -ac 2 -ar 48000 "$tmp/seg.wav"
# head = first xf s, mid = xf..len, tail = len..len+xf; file = (tail ⨯ head) + mid → end meets start exactly.
ffmpeg -hide_banner -loglevel error -y -i "$tmp/seg.wav" -filter_complex \
  "[0]atrim=0:$xf,asetpts=PTS-STARTPTS[head];[0]atrim=$xf:$len,asetpts=PTS-STARTPTS[mid];[0]atrim=$len:$((len + xf)),asetpts=PTS-STARTPTS[tail];[tail][head]acrossfade=d=$xf:c1=tri:c2=tri[xf];[xf][mid]concat=n=2:v=0:a=1[out]" \
  -map "[out]" "$tmp/loop.wav"

measured=$(ffmpeg -hide_banner -nostats -i "$tmp/loop.wav" -af "highpass=f=150:poles=2,lowpass=f=${lowpass},ebur128" -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}')
gain=$(python3 -c "print(round($target - ($measured), 2))")
# High-pass: sub-150 Hz rumble reads as "heavy" and adds nothing to surf. Optional low-pass tames the hiss.
ffmpeg -hide_banner -loglevel error -y -i "$tmp/loop.wav" -af "highpass=f=150:poles=2,lowpass=f=${lowpass},volume=${gain}dB,alimiter=limit=-3dB:attack=5:release=100:level=false" "$tmp/norm.wav"

ffmpeg -hide_banner -loglevel error -y -i "$tmp/norm.wav" -c:a libopus -b:a 48k -vbr on "$out_dir/$name.ogg"
ffmpeg -hide_banner -loglevel error -y -i "$tmp/norm.wav" -c:a aac_at -b:a 80k "$out_dir/$name.m4a"

final=$(ffmpeg -hide_banner -nostats -i "$out_dir/$name.ogg" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -2 | paste -sd' ' -)
echo "$name: source $measured LUFS → gain ${gain} dB → $final"
ls -la "$out_dir/$name".{ogg,m4a} | awk '{printf "  %s %d KB\n", $9, $5/1024}'
