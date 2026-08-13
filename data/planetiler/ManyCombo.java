import java.util.ArrayList;
import java.util.Collections;
import java.util.Map;

public class ManyCombo {

  /** temporary, until we support i18n */
  private static String capitalize(String str) {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
  }

  /**
   * converts tags like `fuel:diesel=yes` + `fuel:octane_95=yes` into a user-friendly string like
   * `"Diesel, 95"`
   */
  public static String generateFuelLabel(Map<String, Object> tags) {
    var fuelTypes = new ArrayList<String>();

    for (var entry : tags.entrySet()) {
      var key = entry.getKey();
      var value = entry.getValue();
      if (key.startsWith("fuel:") && value.equals("yes")) {
        var type = key.substring("fuel:".length());

        // we don't need this prefix, it's obvious what
        // the octane number means in this context.
        if (type.startsWith("octane_")) {
          type = type.substring("octane_".length());
        }

        type = capitalize(type);

        fuelTypes.add(type);
      }
    }

    Collections.sort(fuelTypes);

    return String.join(", ", fuelTypes);
  }

  /**
   * converts tags like `jetski_rental=yes` + `kayak_rental=yes` into a user-friendly string like
   * `"Jetski, Kayak"`
   */
  public static String generateRentalLabel(Map<String, Object> tags) {
    var watercraftTypes = new ArrayList<String>();

    for (var entry : tags.entrySet()) {
      var key = entry.getKey();
      var value = entry.getValue();
      if (key.endsWith("_rental") && value.equals("yes") && Seamarks.ATTRIBUTES.contains(key)) {
        var type = key.replace("_rental", "").replace('_', ' ');
        watercraftTypes.add(capitalize(type));
      }
    }

    Collections.sort(watercraftTypes);

    return String.join(", ", watercraftTypes);
  }
}
