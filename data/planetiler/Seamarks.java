import com.onthegomap.planetiler.*;
import com.onthegomap.planetiler.reader.osm.*;
import com.onthegomap.planetiler.config.*;
import com.onthegomap.planetiler.reader.*;
import java.nio.file.Path;
import java.util.Set;


public class Seamarks implements Profile {
  private Set<String> OTHER_TAGS_SET = Set.of(
    "name",
    "ref",
    "description",
    "note",
    "fixme",
    "direction",
    "vhf",
    "fee",
    "charge",
    "toll",
    "vessel",
    "vessel:mmsi",
    "operator",
    "operator:wikidata",
    "wikidata",
    "wikipedia",
    "maxspeed",
    "maxstay",
    "maxdraft",
    "maxlength",
    "maxwidth",
    "maxheight",
    "maxweight"
  );

  private Set<String> AREA_TYPES = Set.of(
    "anchorage",
    "anchor_berth",
    "cable_area",
    "dredged_area",
    "dumping_ground",
    "fairway",
    "harbour",
    "hulk",
    "marine_farm",
    "production_area",
    "restricted_area",
    "seaplane_landing_area",
    "separation_roundabout",
    "separation_zone",
    "turning_basin",
    "obstruction", // can also be a line
    "sea_area" // can also be a line
  );


  /**
   * using the de-facto standard approach:
   * https://github.com/protomaps/basemaps/blob/2a1cba/tiles/src/main/java/com/protomaps/basemap/feature/FeatureId.java
   */
  public static long createFeatureId(SourceFeature sf) {
    if (sf instanceof OsmSourceFeature osmFeature) {
      long elemType;
      var element = osmFeature.originalElement();
      if (element instanceof OsmElement.Relation) {
        elemType = 0x3;
      } else if (element instanceof OsmElement.Way) {
        elemType = 0x2;
      } else {
        elemType = 0x1;
      }
      return (elemType << 44) | element.id();
    }
    return sf.id();
  }

  private boolean shouldKeepTag(String key) {
    return (
      key.startsWith("seamark:")
      || key.startsWith("name:")
      || OTHER_TAGS_SET.contains(key)
    );
  }

  /** adds every relevant OSM tag as an attribute */
  private void addAllTags(FeatureCollector.Feature collected, SourceFeature feature) {
    var tags = feature.tags();
    for (var entry : tags.entrySet()) {
      if (shouldKeepTag(entry.getKey())) {
        collected.setAttr(entry.getKey(), entry.getValue());
      }
    }

    // add some derived tags which are far too complicated to
    // calculate using maplibre style expressions.
    if (tags.containsKey("seamark:light:colour")) {
      collected.setAttr("_lx", LightCharacteristics.encodeLx(tags, ""));
    }
    if (tags.containsKey("seamark:light:1:colour")) {
      collected.setAttr("_lx", LightCharacteristics.encodeComplexLx(tags));
    }

    collected.setId(createFeatureId(feature));
  }

  private int getMinZoom(SourceFeature feature) {
    var seamarkType = (String) feature.getTag("seamark:type");

    // TSS's get shown at the lowest zoom level
    if (seamarkType.startsWith("separation_")) return 2;

    // every else shown from z8 onwards (TBC)
    return 8;
  }

  @Override
  public void processFeature(SourceFeature feature, FeatureCollector collector) {
    if (!feature.hasTag("seamark:type")) return;

    var seamarkType = (String) feature.getTag("seamark:type");

    // figure out the geometry first
    FeatureCollector.Feature collected = null;
    if (feature.isPoint()) {
      collected = collector.point("seamarks");
    } else if (feature.canBePolygon() && AREA_TYPES.contains(seamarkType)) {
      // it's a closed way, and we expect this to be an area.
      collected = collector.polygon("seamarks");
    } else if (feature.canBeLine()) {
      // it's an unclosed way, or we expect it to be a linear.
      collected = collector.line("seamarks");
    }

    if (collected == null) return;

    addAllTags(collected, feature);
    collected.setMinZoom(getMinZoom(feature));
  }

  @Override
  public String name() {
    return "NOT FOR NAVIGATION!";
  }

  @Override
  public String description() {
    return "Do NOT use for navigational purposes! https://github.com/k-yle/OpenSeaMap-vector";
  }

  @Override
  public boolean isOverlay() {
    return true;
  }

  @Override
  public String attribution() {
    return "NOT FOR NAVIGATION! Map data from <a href='https://osm.org/copyright' target='_blank'>OpenStreetMap</a>";
  }

  public static void main(String[] args) {
    Planetiler
      .create(Arguments.fromArgs(args))
      .addOsmSource("osm", Path.of("data/public/seamarks.pbf"))
      .overwriteOutput(Path.of("data/public/seamarks.pmtiles"))
      .setProfile(new Seamarks())
      .run();
  }
}
