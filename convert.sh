#!/bin/bash

# masuk ke folder gsdr
cd ~/Downloads/sempurna-baja || exit

# counter awal
count=1

# loop semua file jpeg/jpg
for file in *.jpeg *.jpg *.JPG; do
  # cek kalau file memang ada
  [ -e "$file" ] || continue
  
  # nama baru
  newname="sempurna-baja-${count}.webp"
  
  # konversi pakai cwebp (quality 80 bisa disesuaikan)
  cwebp -q 80 "$file" -o "$newname"
  
  echo "Converted: $file -> $newname"
  
  # increment counter
  count=$((count + 1))
done
