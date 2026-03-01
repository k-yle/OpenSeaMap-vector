
# download full.pbf (if it doesn't exist)
echo "downloading the OSM planet file…"
[ -f ./data/full.pbf ] || curl \
  -Lo ./data/full.pbf \
  https://download.geofabrik.de/australia-oceania-latest.osm.pbf

# full.pbf -> seamarks.pbf (if it doesn't exist)
echo "running osmium tags-filter…"
[ -f ./data/public/seamarks.pbf ] || docker run --rm -v $(pwd):/data \
  iboates/osmium:1.19.0 \
  tags-filter \
  -e /data/data/osmium-tags-filter.ini \
  /data/data/full.pbf \
  --output=/data/data/public/seamarks.pbf
