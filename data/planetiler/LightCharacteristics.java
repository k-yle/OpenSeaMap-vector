import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * This is a JavaScript-to-Java port of
 * https://github.com/k-yle/light-characteristics/blob/bc1ab2f/src/encode.ts
 * See that library for unit tests.
 *
 * It would be mucher easier to use the JS library from the FE, but you
 * can't do that with maplibre-gl. So we have to pre-calculate this
 * string, and embed it into the tiles.
 */
public class LightCharacteristics {
  static Map<String, String> COLOUR_MAP = Map.ofEntries(
    Map.entry("white", "W"),
    Map.entry("red", "R"),
    Map.entry("green", "G"),
    Map.entry("blue", "Bu"),
    Map.entry("violet", "Vi"), // should be V?
    Map.entry("yellow", "Y"),
    Map.entry("orange", "Or"), // should be O?
    Map.entry("amber", "Am"), // should be A?
    Map.entry("grey", "Gy"),
    Map.entry("brown", "Br"),
    Map.entry("mangeta", "M"),
    Map.entry("pink", "P")
  );

  /** the default function, converts OSM tags to a string like `VQ(6)LFl.W.10s3m2M` */
  public static String encodeLx(Map<String, Object> tags, String index) {
    var str = "";

    var CATLIT = (String) tags.get("seamark:light:" + index + "category"); if (CATLIT == null) CATLIT = "";
    var MLTYLT = (String) tags.get("seamark:light:" + index + "multiple"); if (MLTYLT == null) MLTYLT = "";
    var LITCHR = (String) tags.get("seamark:light:" + index + "character"); if (LITCHR == null) LITCHR = "";
    var SIGGRP = (String) tags.get("seamark:light:" + index + "group"); if (SIGGRP == null) SIGGRP = "";
    var COLOUR = (String) tags.get("seamark:light:" + index + "colour"); if (COLOUR == null) COLOUR = "";
    var SIGPER = (String) tags.get("seamark:light:" + index + "period"); if (SIGPER == null) SIGPER = "";
    var HEIGHT = (String) tags.get("seamark:light:" + index + "height"); if (HEIGHT == null) HEIGHT = "";
    var VALMXR = (String) tags.get("seamark:light:" + index + "range"); if (VALMXR == null) VALMXR = "";

    if (CATLIT == "directional") str += "Dir";
    if (CATLIT == "aero" || CATLIT == "air_obstruction") str += "Aero";

    if (MLTYLT != "") str += MLTYLT;
    if (LITCHR != "") {
      if (SIGGRP != "") {
        if (LITCHR.contains("+")) {
          // light charactertics with a plus are formatted differently
          var prefixSuffix = LITCHR.split("\\+");
          str += prefixSuffix[0] + "(" + SIGGRP + ")+" + prefixSuffix[1];
        } else {
          str += LITCHR + "(" + SIGGRP + ")";
        }
      } else {
        // no group, simple case
        str += LITCHR;
      }
    }

    // if the last character is not a bracket, and the next token
    // is going to be a colour, then add a dot
    if (str != "" && str.charAt(str.length() - 1) != ')') str += ".";

    if (COLOUR != "") {
      for (var colour : COLOUR.split(";")) {
        if (COLOUR_MAP.containsKey(colour)) {
          str += COLOUR_MAP.get(colour);
        }
      }
    }

    // add another dot, unless the previous group was empty
    if (str != "" && str.charAt(str.length() - 1) != '.') str += ".";

    if (SIGPER != "") str += SIGPER + "s";
    if (HEIGHT != "") str += HEIGHT + "m";
    if (VALMXR != "") str += VALMXR += "M";

    // turns out we didn"t need that separator
    if (str != "" && str.charAt(str.length() - 1) == '.') str = str.substring(0, str.length() - 1);

    if (CATLIT == "vertical") str += "(vert)";
    if (CATLIT == "horizontal") str += "(hor)";
    if (CATLIT == "front") str += "(Front)";
    if (CATLIT == "rear") str += "(Rear)";
    if (CATLIT == "upper") str += "(Upper)";
    if (CATLIT == "lower") str += "(Lower)";

    return str;
  }

  /**
   * for OSM features with complex light tags, this converts each sector
   * to a string, separated by a newline character. Removes duplicate
   * sector descriptions.
   */
  public static String encodeComplexLx(Map<String, Object> tags) {
    Set<String> sectors = new HashSet<>();
    var i = 1;
    while (tags.containsKey("seamark:light:" + i + ":colour")) {
      sectors.add(encodeLx(tags, i++ + ":"));
    }
    return String.join("\n", sectors);
  }

  // TODO: if there's a fog signal, include it on a new line:
  // https://taginfo.openstreetmap.org/search?q=seamark:fog_signal:
}
