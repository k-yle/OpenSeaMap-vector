import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Map;
import org.junit.jupiter.api.Test;

class LightCharacteristicsTest {

  @Test
  void noTags() {
    Map<String, Object> tags = Map.of();
    assertEquals("", LightCharacteristics.encodeComplexLx(tags));
  }

  @Test
  void singleColourTag() {
    Map<String, Object> tags = Map.of("seamark:light:1:colour", "red");
    assertEquals("R", LightCharacteristics.encodeComplexLx(tags));
  }

  @Test
  void fogSignal_cat() {
    Map<String, Object> tags = Map.of("seamark:fog_signal:category", "bell");
    assertEquals("Bell", LightCharacteristics.encodeComplexLx(tags));
  }

  @Test
  void fogSignal_complex() {
    Map<String, Object> tags = Map.of(
        //
        "seamark:fog_signal:category", "bell", //
        "seamark:fog_signal:period", "2", //
        "seamark:fog_signal:range", "4" //
    );
    assertEquals("Bell: .2s4M", LightCharacteristics.encodeComplexLx(tags));
  }

  @Test
  void fogSignal_and_lx() {
    Map<String, Object> tags = Map.of(
        //
        "seamark:light:colour", "red", //
        "seamark:light:period", "5", //
        "seamark:light:height", "6", //
        "seamark:light:character", "VQ+LFl", //
        "seamark:fog_signal:category", "bell", //
        "seamark:fog_signal:period", "2", //
        "seamark:fog_signal:range", "4" //
    );
    assertEquals("VQ+LFl.R.5s6m\nBell: .2s4M", LightCharacteristics.encodeComplexLx(tags));
  }

  @Test
  void complex_sectors_and_fog_signal() {
    Map<String, Object> tags = Map.ofEntries(
        //
        Map.entry("seamark:fog_signal:category", "horn"), //
        Map.entry("seamark:fog_signal:group", "1"), //
        Map.entry("seamark:fog_signal:period", "8"), //
        Map.entry("seamark:light:1:category", "vertical"), //
        Map.entry("seamark:light:1:character", "F"), //
        Map.entry("seamark:light:1:colour", "yellow;green;red"), //
        Map.entry("seamark:light:1:height", "49"), //
        Map.entry("seamark:light:1:multiple", "4"), //
        Map.entry("seamark:light:2:category", "air_obstruction"), //
        Map.entry("seamark:light:2:character", "Q"), //
        Map.entry("seamark:light:2:colour", "red"), //
        Map.entry("seamark:light:2:group", "1"), //
        Map.entry("seamark:light:2:period", "1") //
    );
    assertEquals("4F.YGR.49m(vert)\nAeroQ(1)R.1s\nHorn: .8s",
        LightCharacteristics.encodeComplexLx(tags));
  }
}
