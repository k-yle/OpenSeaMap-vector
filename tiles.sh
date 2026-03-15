# seamarks.pbf -> seamarks.pmtiles
echo "running planetiler…"
[ -f ./data/public/seamarks.pmtiles ] || docker run --rm \
  -v $(pwd):/cwd \
  -v maven-cache:/root/.m2 \
  --workdir=/cwd \
  docker.io/library/maven:3.9-eclipse-temurin-22 \
  sh -c '
    mvn -q package dependency:copy-dependencies -DincludeScope=compile -DskipTests &&
    java -Xmx4g -cp "/cwd/target/classes:/cwd/target/dependency/*" Seamarks
  '
