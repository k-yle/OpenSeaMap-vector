
# download full.pbf (if it doesn't exist)
echo "downloading the OSM planet file…"
[ -f ./data/full.pbf ] || curl \
  -Lo ./data/full.pbf \
  https://download.geofabrik.de/australia-oceania-latest.osm.pbf

# full.pbf -> seamarks.pbf (if it doesn't exist)
echo "running osmium tags-filter…"
[ -f ./data/public/seamarks.pbf ] || docker run --rm -v $(pwd):/cwd \
  iboates/osmium:1.19.0 \
  tags-filter \
  --progress \
  -e /cwd/data/osmium-tags-filter.ini \
  /cwd/data/full.pbf \
  --output=/cwd/data/public/seamarks.pbf
