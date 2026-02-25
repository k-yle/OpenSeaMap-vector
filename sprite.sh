# icons/*.svg -> icons.{png,json}
echo "generating sprites…"
docker run --rm \
  -v $(pwd)/icons:/app/icons \
  -v $(pwd)/data:/app/data \
  ghcr.io/flother/spreet \
  --recursive \
  icons \
  data/public/icons

# icons/*.svg -> icons@2x.{png,json}
echo "generating sprites@2…"
docker run --rm \
  -v $(pwd)/icons:/app/icons \
  -v $(pwd)/data:/app/data \
  ghcr.io/flother/spreet \
  --retina \
  --recursive \
  icons \
  data/public/icons@2x
