import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Map;
import org.junit.jupiter.api.Test;

class FuelTest {

  @Test
  void noTags() {
    Map<String, Object> tags = Map.of();
    assertEquals("", Fuel.generateFuelLabel(tags));
  }

  @Test
  void singleNumber() {
    Map<String, Object> tags = Map.of(
        //
        "fuel:octane_91", "yes", //
        "fuel:octane_95", "no" //
    );
    assertEquals("91", Fuel.generateFuelLabel(tags));
  }

  @Test
  void multipleNumbers() {
    Map<String, Object> tags = Map.of(
        //
        "fuel:octane_91", "yes", //
        "fuel:octane_95", "yes" //
    );
    assertEquals("91, 95", Fuel.generateFuelLabel(tags));
  }

  @Test
  void mix() {
    Map<String, Object> tags = Map.of(
        //
        "fuel:diesel", "yes", //
        "fuel:lpg", "no", //
        "fuel:octane_95", "yes", //
        "fuel:octane_98", "yes" //
    );
    assertEquals("95, 98, Diesel", Fuel.generateFuelLabel(tags));
  }
}
