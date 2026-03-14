import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Map;
import org.junit.jupiter.api.Test;

class LightCharacteristicsTest {

  @Test
  void singleColourTag() {
    Map<String, Object> tags = Map.of("seamark:light:1:colour", "red");
    assertEquals("R", LightCharacteristics.encodeComplexLx(tags));
  }
}
