# download planetiler.jar
echo "downloading planetiler…"
[ -f ./data/planetiler/planetiler.jar ] || curl \
  -Lo ./data/planetiler/planetiler.jar \
  https://github.com/onthegomap/planetiler/releases/download/v0.10.0/planetiler.jar

# seamarks.pbf -> seamarks.pmtiles
echo "running planetiler…"
[ -f ./data/public/seamarks.pmtiles ] || docker run --rm \
  -v $(pwd):/data \
  --workdir=/data \
  docker.io/library/eclipse-temurin:22-jdk \
  java \
  -Xmx4g \
  -cp data/planetiler/planetiler.jar \
  data/planetiler/Seamarks.java
