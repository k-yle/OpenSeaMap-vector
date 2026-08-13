import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Map;
import org.junit.jupiter.api.Test;

class ManyComboTest {

  @Test
  void noTags() {
    Map<String, Object> tags = Map.of();
    assertEquals("", ManyCombo.generateFuelLabel(tags));
  }

  @Test
  void singleNumber() {
    Map<String, Object> tags = Map.of(
        //
        "fuel:octane_91", "yes", //
        "fuel:octane_95", "no" //
    );
    assertEquals("91", ManyCombo.generateFuelLabel(tags));
  }

  @Test
  void multipleNumbers() {
    Map<String, Object> tags = Map.of(
        //
        "fuel:octane_91", "yes", //
        "fuel:octane_95", "yes" //
    );
    assertEquals("91, 95", ManyCombo.generateFuelLabel(tags));
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
    assertEquals("95, 98, Diesel", ManyCombo.generateFuelLabel(tags));
  }

  @Test
  void boatRental() {
    Map<String, Object> tags = Map.of(
        //
        "car_rental", "yes", // not in the allowlist
        "kayak_rental", "yes", //
        "canoe_rental", "no", //
        "sailboat_rental", "yes", //
        "standup_paddleboard_rental", "yes" //
    );
    assertEquals("Kayak, Sailboat, Standup paddleboard", ManyCombo.generateRentalLabel(tags));
  }
}
