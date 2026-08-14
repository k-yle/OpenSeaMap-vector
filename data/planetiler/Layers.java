import com.onthegomap.planetiler.reader.SourceFeature;

public class Layers {
  /** ⚠️ the returned value here needs to match `enum Layer` in layers.ts */
  public static String getLayer(SourceFeature feature) {

    // moorings are annoying
    if (feature.hasTag("seamark:type", "mooring")) {
      return feature.hasTag("seamark:mooring:category", //
          "dolphin", //
          "bollard", //
          "pile", //
          "post" //
      ) ? "general" : "navmarks";
    }


    if (feature.hasTag("seamark:type", //
        "navigation_line", //
        "recommended_track", //
        "beacon_cardinal", //
        "beacon_isolated_danger", //
        "beacon_lateral", //
        "beacon_safe_water", //
        "beacon_special_purpose", //
        "buoy_cardinal", //
        "buoy_installation", //
        "buoy_isolated_danger", //
        "buoy_lateral", //
        "buoy_safe_water", //
        "buoy_special_purpose", //
        "daymark", //
        "fog_signal", //
        "light", //
        "light_minor", //
        "light_major", //
        "light_float", //
        "light_vessel", //
        "virtual_aton", //
        "platform", //
        "topmark" //
    ) || feature.hasTag("man_made", //
        "lighthouse", //
        "offshore_platform" //
    )) {
      return "navmarks";
    }


    if (feature.hasTag("seamark:type", //
        "rock", //
        "cable_overhead", //
        "cable_submarine", //
        "pipeline_overhead", //
        "pipeline_submarine", //
        "obstruction", //
        "wreck" //
    ) || feature.hasTag("whitewater", //
        "hazard" //
    ) || feature.hasTag("water", //
        "rapids" //
    ) || feature.hasTag("historic", //
        "wreck" //
    ) || feature.hasTag("waterway", //
        "rapids", //
        "canoe_pass", //
        "floating_barrier", //
        "debris_screen", //
        "dam", //
        "weir", //
        "check_dam", //
        "floodgate", //
        "lock_gate", //
        "security_lock", //
        "sluice_gate" //
    ) || feature.hasTag("barrier", //
        "floating_boom", //
        "shark_net" //
    ) || feature.hasTag("rapids") //
        || feature.hasTag("whitewater:section_grade") //
        || feature.hasTag("whitewater:rapid_grade") //
    ) {
      return "hazards";
    }


    if (feature.hasTag("seamark:type", "notice") //
        || feature.hasTag("seamark:notice:category") //
        || feature.hasTag("seamark:notice:1:category") //
    ) {
      return "notices";
    }


    if (feature.hasTag("seamark:type", //
        "turning_basin", //
        "marine_farm", //
        "production_area", //
        "anchorage", //
        "fairway", //
        "restricted_area", //
        "cable_area", //
        "pipeline_area", //
        "dumping_ground", //
        "seaplane_landing_area", //
        // TSS
        "separation_lane", //
        "separation_line", //
        "separation_boundary", //
        "separation_zone", //
        "separation_roundabout" //
    ) || feature.hasTag("leisure", //
        "swimming_area" //
    ) || feature.hasTag("waterway", //
        "turning_point" //
    ) || feature.hasTag("seamark:restricted_area:restriction", //
        "no_entry" //
    )) {
      return "areas";
    }


    if (feature.hasTag("seamark:small_craft_facility:category", "nautical_club")) {
      return "businesses";
    }


    if (feature.hasTag("seamark:type", //
        "small_craft_facility", //
        "crane" //
    ) || feature.hasTag("natural", //
        "beach" //
    ) || feature.hasTag("waterway", //
        "boat_lift", //
        "water_point", //
        "fuel", //
        "access_point", //
        "sanitary_dump_station" //
    ) || feature.hasTag("amenity", //
        "boat_rental", //
        "boat_storage", //
        "charging_station", //
        "fish_cleaning" //
    ) || feature.hasTag("leisure", //
        "fishing", //
        "slipway" //
    ) || feature.hasTag("canoe", //
        "put_in", //
        "egress", //
        "put_in;egress" //
    ) || feature.hasTag("whitewater", //
        "put_in", //
        "egress", //
        "put_in;egress", //
        "put_in_out", //
        "portage_way" //
    ) || feature.hasTag("portage", //
        "yes", //
        "designated" //
    ) || feature.hasTag("canoe", //
        "portage" //
    )) {
      return "recreational";
    }


    if (feature.hasTag("seamark:type", //
        "minor_berth", //
        "pile", //
        "sea_area", //
        "distance_mark", //
        "waterway_gauge", //
        "harbour", //
        "berth", //
        "anchor_berth", //
        "pilot_boarding", //
        "calling-in_point", //
        "hulk", //
        "pontoon" //
    ) || feature.hasTag("aeroway", //
        "windsock" //
    ) || feature.hasTag("waterway", //
        "milestone" //
    ) || feature.hasTag("leisure", //
        "marina" //
    ) || feature.hasTag("man_made", //
        "dolphin" //
    ) || feature.hasTag("historic", //
        "ship" //
    ) || feature.hasTag("building", //
        "ship" //
    ) || feature.hasTag("seamark:signal_station_warning:category", //
        "tide_gauge", //
        "depth", //
        "water_level_gauge" //
    )) {
      return "general";
    }


    if (feature.hasTag("seamark:type", //
        "rescue_station", //
        "coastguard_station", //
        "signal_station_traffic", //
        "signal_station_warning" //
    ) || feature.hasTag("club", //
        "yachting", //
        "boating", //
        "boat", //
        "rowing", //
        "sport", //
        "sailing" //
    ) || feature.hasTag("scout", //
        "sea" //
    ) || feature.hasTag("amenity", //
        "sailing_school" //
    ) || feature.hasTag("education", //
        "sailing_school" //
    ) || feature.hasTag("training", //
        "sailing", //
        "maritime" //
    ) || feature.hasTag("emergency", //
        "water_rescue" //
    ) || feature.hasTag("police", //
        "naval_base" //
    )) {
      return "businesses";
    }


    return "unknown";
  }
}
