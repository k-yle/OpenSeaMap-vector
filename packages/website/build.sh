set -e

rm -rf dist
tsx scripts/taginfo.ts
VITE_BUILD_MODE=lib vite build
vite build
rm -rf ./dist/*.pmtiles
rm -rf ./dist/*.pbf
cp -r ../navmark-renderer/specimens ./dist/
