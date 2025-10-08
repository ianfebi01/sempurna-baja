#!/bin/bash

# masuk ke folder gsdr
cd ~/Downloads/gsdr || exit

# counter awal
count=1

# loop semua file jpeg/jpg
for file in *.jpeg *.jpg; do
  # cek kalau file memang ada
  [ -e "$file" ] || continue
  
  # nama baru
  newname="batu-alam-${count}.webp"
  
  # konversi pakai cwebp (quality 80 bisa disesuaikan)
  cwebp -q 80 "$file" -o "$newname"
  
  echo "Converted: $file -> $newname"
  
  # increment counter
  count=$((count + 1))
done
