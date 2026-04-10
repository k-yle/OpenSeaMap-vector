import com.onthegomap.planetiler.*;
import com.onthegomap.planetiler.reader.osm.*;
import com.onthegomap.planetiler.config.*;
import com.onthegomap.planetiler.reader.*;
import java.nio.file.Path;
import java.util.Set;


public class Seamarks implements Profile {
  private Set<String> NON_SEAMARK_FEATURE_KEYS = Set.of(
      //
      "aeroway", //
      "amenity", //
      "barrier", //
      "canoe", //
      "club", //
      "emergency", //
      "historic", //
      "industrial", //
      "leisure", //
      "lock", //
      "man_made", //
      "natural", //
      "scout", //
      "sport", //
      "portage", //
      "waterway" //
  );

  // there's an AST walker which extracts these values in scripts/taginfo.ts
  private Set<String> ATTRIBUTES = Set.of(
      //
      "name", //
      "ref", //
      "description", //
      "note", //
      "fixme", //
      "access", //
      "direction", //
      "distance", //
      "vhf", //
      "fee", //
      "charge", //
      "toll", //
      "vessel", //
      "vessel:mmsi", //
      "operator", //
      "operator:wikidata", //
      "wikidata", //
      "wikipedia", //
      "wreck:type", //
      "wreck:date_sunk", //
      "maxspeed", //
      "maxstay", //
      "maxdraft", //
      "maxlength", //
      "maxwidth", //
      "maxheight", //
      "maxweight" //
  );

  private Set<String> ATTRIBUTE_PREFIXES = Set.of(
      //
      "fuel:", //
      "name:", //
      "seamark:" //
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
    for (var prefix : ATTRIBUTE_PREFIXES) {
      if (key.startsWith(prefix)) {
        return true;
      }
    }
    return (ATTRIBUTES.contains(key) || NON_SEAMARK_FEATURE_KEYS.contains(key));
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
    if (tags.containsKey("seamark:light:colour") || tags.containsKey("seamark:light:1:colour")) {
      collected.setAttr("_lx", LightCharacteristics.encodeComplexLx(tags));
    }
    if ("fuel".equals(tags.get("waterway"))
        || "fuel_station".equals(tags.get("seamark:small_craft_facility:category"))) {
      collected.setAttr("_fuel", Fuel.generateFuelLabel(tags));
    }

    collected.setId(createFeatureId(feature));
  }

  private int getMinZoom(SourceFeature feature) {
    var seamarkType = (String) feature.getTag("seamark:type");
    if (seamarkType == null) {
      seamarkType = "";
    }

    // TSS's get shown at the lowest zoom level
    if (seamarkType.startsWith("separation_")) {
      return 2;
    }

    // every else shown from z8 onwards (TBC)
    return 8;
  }

  private boolean shouldIncludeFeature(SourceFeature feature) {
    // keep everything with a seamark:type tag
    if (feature.hasTag("seamark:type")) {
      return true;
    }

    // for charging_stations, only keep boat-related ones.
    if (feature.getTag("amenity") != null && feature.getTag("amenity").equals("charging_station")
        && !feature.hasTag("boat")) {
      return false;
    }

    // keep everything with a primary key that we support
    // osmium filters by value already, so we can just
    // fitler by key.
    for (var entry : feature.tags().entrySet()) {
      if (NON_SEAMARK_FEATURE_KEYS.contains(entry.getKey())) {
        return true;
      }
    }

    // do not include everything else
    return false;
    // TODO: is this even possible? what could have slipped
    // thru osmium filter-tags?
  }

  @Override
  public void processFeature(SourceFeature feature, FeatureCollector collector) {
    if (!shouldIncludeFeature(feature)) {
      return;
    }

    // figure out the geometry first
    FeatureCollector.Feature collected = null;
    if (feature.isPoint()) {
      collected = collector.point("seamarks");
    } else if (feature.canBePolygon()) {
      // it's a closed way, and we expect this to be an area.
      collected = collector.polygon("seamarks");
    } else if (feature.canBeLine()) {
      // it's an unclosed way, or we expect it to be a linear.
      collected = collector.line("seamarks");
    }

    if (collected == null) {
      return;
    }

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
    Planetiler.create(Arguments.fromArgs(args))
        .addOsmSource("osm", Path.of("data/public/seamarks.pbf"))
        .overwriteOutput(Path.of("data/public/seamarks.pmtiles")).setProfile(new Seamarks()).run();
  }
}
