# seamarks.pbf -> seamarks.pmtiles
echo "running planetiler…"
[ -f ./data/public/seamarks.pmtiles ] || docker run --rm \
  -v $(pwd):/data \
  -v maven-cache:/root/.m2 \
  --workdir=/data \
  docker.io/library/maven:3.9-eclipse-temurin-22 \
  sh -c '
    mvn -q package dependency:copy-dependencies -DincludeScope=compile -DskipTests &&
    java -Xmx4g -cp "/data/target/classes:/data/target/dependency/*" Seamarks
  '
