#!/bin/bash
INPUT="$1"
OUTPUT="$2"

# Extract segments
segments=(
    "00:00:03 00:02:00 segment_1"
    "00:02:03 00:01:00 segment_2"
)

for i in "${!segments[@]}"; do
    start=$(echo "${segments[$i]}" | cut -d' ' -f1)
    duration=$(echo "${segments[$i]}" | cut -d' ' -f2)
    name=$(echo "${segments[$i]}" | cut -d' ' -f3)
    ffmpeg -i "$INPUT" -ss "$start" -t "$duration" -c copy "$name.mp4"
done

# Create list file
> segments.txt
for seg in segment_{1..2}; do
    echo "file '$seg.mp4'" >> segments.txt
done

# Combine
ffmpeg -f concat -safe 0 -i segments.txt -c copy "$OUTPUT"

# Cleanup (optional)
# rm segment_*.mp4 segments.txt
