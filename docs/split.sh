#!/bin/bash
INPUT="$1"
OUTPUT="$2"

# Extract segments
segments=(
    "00:00:06 00:00:08 segment_1"
    "00:00:20 00:00:02 segment_2"
    "00:00:39 00:00:04 segment_3"
    "00:00:50 00:00:02 segment_4"
    "00:01:30 00:00:02 segment_5"
    "00:01:36 00:00:02 segment_6"
    "00:02:30 00:00:01 segment_7"
    "00:02:39 00:00:03 segment_8"
    "00:02:45 00:00:05 segment_9"
    "00:02:54 00:00:03 segment_10"
)

for i in "${!segments[@]}"; do
    start=$(echo "${segments[$i]}" | cut -d' ' -f1)
    duration=$(echo "${segments[$i]}" | cut -d' ' -f2)
    name=$(echo "${segments[$i]}" | cut -d' ' -f3)
    ffmpeg -i "$INPUT" -ss "$start" -t "$duration" -c copy "$name.mp4"
done

# Create list file
> segments.txt
for seg in segment_{1..10}; do
    echo "file '$seg.mp4'" >> segments.txt
done

# Combine
ffmpeg -f concat -safe 0 -i segments.txt -c copy "$OUTPUT"

# Cleanup (optional)
# rm segment_*.mp4 segments.txt
