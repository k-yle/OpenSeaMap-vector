import type { Tags } from 'osm-api';

export interface LegendEntry {
  label: string;
  icon: string;
  /**
   * tags to match the feature. The first array item is the
   * preferred tagging, other array items are the fallbacks.
   */
  tags: [mainTags: Tags, ...alternativeTags: Tags[]];
  /** extra keys which are not required, but affect the map label */
  labelAttributes?: string[];
  /** if these tags are present, the feature is not rendered */
  hiddenIf?: Tags[];
  /** extra text */
  note?: React.ReactNode;
}

export interface LegendCategory {
  categoryName: string;
  items: LegendEntry[];
}

const ICON_BASE_URL =
  'https://raw.githubusercontent.com/k-yle/OpenSeaMap-vector/refs/heads/main/icons';

const PRIVATE_TAGS: Tags[] = [
  { access: 'no' },
  { access: 'private' },
  { access: 'permit' },
  { access: 'customers' },
];

const BERTH_LABEL_KEYS = [
  'maxstay',
  'maxdraft',
  'maxlength',
  'maxwidth',
  'maxweight',
];

export const LEGEND: LegendCategory[] = [
  // TODO: if iD ever creates presets for these features, we could
  // re-use the translated labels from iD. Tracked by
  // https://github.com/openstreetmap/id-tagging-schema/issues/683
  {
    categoryName: 'Recreational Facilities',
    items: [
      {
        label: 'Beach',
        icon: `${ICON_BASE_URL}/small_craft_facility/beach.svg`,
        tags: [{ natural: 'beach' }],
        hiddenIf: PRIVATE_TAGS,
      },
      {
        label: 'Boat Hoist',
        icon: `${ICON_BASE_URL}/small_craft_facility/boat_hoist.svg`,
        tags: [
          {
            'seamark:type': 'small_craft_facility',
            'seamark:small_craft_facility:category': 'boat_hoist',
          },
          { 'seamark:type': 'crane' },
        ],
      },
      {
        label: 'Boat Storage',
        icon: `${ICON_BASE_URL}/small_craft_facility/boat_storage.svg`,
        tags: [{ amenity: 'boat_storage' }],
      },
      {
        label: 'Boatyard',
        icon: `${ICON_BASE_URL}/small_craft_facility/boatyard.svg`,
        tags: [
          {
            'seamark:type': 'small_craft_facility',
            'seamark:small_craft_facility:category': 'boatyard',
          },
        ],
      },
      {
        label: 'Electric Boat / EV Charger',
        icon: `${ICON_BASE_URL}/small_craft_facility/ev_charger.svg`,
        tags: [{ amenity: 'charging_station', boat: 'designated' }],
      },
      {
        label: 'Fishing Spot',
        icon: `${ICON_BASE_URL}/small_craft_facility/fishing_spot.svg`,
        tags: [{ leisure: 'fishing' }],
      },
      {
        label: 'Freshwater Tap',
        icon: `${ICON_BASE_URL}/small_craft_facility/freshwater_tap.svg`,
        tags: [
          { waterway: 'water_point' },
          {
            'seamark:type': 'small_craft_facility',
            'seamark:small_craft_facility:category': 'water_tap',
          },
        ],
      },
      {
        label: 'Marine Fuel Station',
        icon: `${ICON_BASE_URL}/small_craft_facility/freshwater_tap.svg`,
        tags: [
          { waterway: 'fuel' },
          {
            'seamark:type': 'small_craft_facility',
            'seamark:small_craft_facility:category': 'water_tap',
          },
        ],
      },
      {
        label: 'Water Access Point',
        icon: `${ICON_BASE_URL}/small_craft_facility/kayak.svg`,
        tags: [
          { waterway: 'access_point' },
          { canoe: 'put_in' },
          { canoe: 'egress' },
          { canoe: 'put_in;egress' },
        ],
        hiddenIf: PRIVATE_TAGS,
      },
      {
        label: 'Pump-Out (Toilet Disposal)',
        icon: `${ICON_BASE_URL}/small_craft_facility/pump_out.svg`,
        tags: [
          { waterway: 'sanitary_dump_station' },
          {
            'seamark:type': 'small_craft_facility',
            'seamark:small_craft_facility:category': 'pump-out',
          },
        ],
      },
      {
        label: 'Boat Ramp',
        icon: `${ICON_BASE_URL}/small_craft_facility/slipway.svg`,
        tags: [
          { leisure: 'slipway' },
          {
            'seamark:type': 'small_craft_facility',
            'seamark:small_craft_facility:category': 'slipway',
          },
        ],
      },
      {
        label: 'Visitor Berth',
        icon: `${ICON_BASE_URL}/small_craft_facility/visitor_berth.svg`,
        tags: [
          {
            'seamark:type': 'small_craft_facility',
            'seamark:small_craft_facility:category': 'visitor_berth',
          },
        ],
        labelAttributes: BERTH_LABEL_KEYS,
      },
      {
        label: 'Visitor Mooring',
        icon: `${ICON_BASE_URL}/small_craft_facility/visitor_mooring.svg`,
        tags: [
          {
            'seamark:type': 'small_craft_facility',
            'seamark:small_craft_facility:category': 'visitor_mooring',
          },
        ],
        labelAttributes: BERTH_LABEL_KEYS,
      },
      {
        label: 'Rowing Club',
        icon: `${ICON_BASE_URL}/small_craft_facility/yacht_club.svg`,
        tags: [{ sport: 'rowing' }],
      },
      {
        label: 'Sea Scout Club',
        icon: `${ICON_BASE_URL}/small_craft_facility/yacht_club.svg`,
        tags: [{ scout: 'sea' }],
      },
      {
        label: 'Yacht Club',
        icon: `${ICON_BASE_URL}/small_craft_facility/yacht_club.svg`,
        tags: [
          { sport: 'sailing' },
          { club: 'sailing' },
          { club: 'yachting' },
          { 'seamark:small_craft_facility:category': 'nautical_club' },
        ],
      },
      {
        label: 'Yacht Club with Burgee',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/RNZYS_Official_Burgee.png',
        tags: [{ sport: 'sailing', wikidata: '*' }],
        note: (
          <>
            <br />
            Requires the Wikidata item to have a{' '}
            <a href="https://wikidata.org/wiki/Q1397451#P41" target="_blank">
              flag image
              <sup>(P41)</sup>
            </a>{' '}
            property.
          </>
        ),
      },
      {
        label: 'Marina',
        icon: `${ICON_BASE_URL}/harbour_marina.svg`,
        tags: [
          { leisure: 'marina' },
          { 'seamark:type': 'harbour', 'seamark:harbour:category': 'marina' },
          {
            'seamark:type': 'harbour',
            'seamark:harbour:category': 'marina_no_facilities',
          },
        ],
      },
    ],
  },
  {
    categoryName: 'General',
    items: [
      {
        label: 'Harbour',
        icon: `${ICON_BASE_URL}/harbour_generic.svg`,
        tags: [{ 'seamark:type': 'harbour' }],
      },
      {
        label: 'Fishing Harbour',
        icon: `${ICON_BASE_URL}/harbour_fishing.svg`,
        tags: [
          {
            'seamark:type': 'harbour',
            'seamark:harbour:category': 'fishing',
          },
        ],
      },
      {
        label: 'Seaplane Landing Area',
        icon: `${ICON_BASE_URL}/seaplane.svg`,
        tags: [{ 'seamark:type': 'seaplane_landing_area' }],
      },
      {
        label: 'Quayside Berth',
        icon: 'https://wiki.openstreetmap.org/w/images/c/c0/BerthSM.png',
        tags: [{ 'seamark:type': 'berth' }],
        labelAttributes: BERTH_LABEL_KEYS,
      },
      {
        label: 'Anchor Berth',
        icon: `${ICON_BASE_URL}/line-style/anchorage.svg`,
        tags: [{ 'seamark:type': 'anchor_berth' }],
        labelAttributes: BERTH_LABEL_KEYS,
      },
      {
        label: 'Minor/Marina Berth',
        icon: '',
        tags: [{ 'seamark:type': 'minor_berth' }],
      },
      {
        label: 'Pilot Boarding Point',
        icon: `${ICON_BASE_URL}/pilot_boarding.svg`,
        tags: [{ 'seamark:type': 'pilot_boarding' }],
      },
      {
        label: 'Radio Calling-in Point',
        icon: `${ICON_BASE_URL}/calling-in_point.svg`,
        tags: [{ 'seamark:type': 'calling-in_point' }],
        labelAttributes: ['seamark:calling-in_point:channel'],
      },
      {
        label: 'Marine Rescue Station',
        icon: `${ICON_BASE_URL}/rescue_station.svg`,
        tags: [
          { emergency: 'water_rescue' },
          { 'seamark:type': 'rescue_station' },
          { 'seamark:type': 'coastguard_station' },
        ],
      },
      {
        label: 'Radio Signal Station',
        icon: `${ICON_BASE_URL}/signal_station.svg`,
        tags: [
          { 'seamark:type': 'signal_station_traffic' },
          { 'seamark:type': 'signal_station_warning' },
        ],
        labelAttributes: [
          'seamark:signal_station_traffic:channel',
          'seamark:signal_station_warning:channel',
          'seamark:signal_station_traffic:category',
          'seamark:signal_station_warning:category',
        ],
      },
      {
        label: 'Tide/Depth Gauge',
        icon: `${ICON_BASE_URL}/waterway_gauge.svg`,
        tags: [
          { 'seamark:type': 'waterway_gauge' },
          { 'seamark:signal_station_warning:category': 'tide_gauge' },
          { 'seamark:signal_station_warning:category': 'depth' },
          { 'seamark:signal_station_warning:category': 'water_level_gauge' },
        ],
      },
      {
        label: 'Windsock',
        icon: `${ICON_BASE_URL}/windsock.svg`,
        tags: [{ aeroway: 'windsock' }],
      },
      {
        label: 'Physical Distance Marker',
        icon: 'https://wiki.openstreetmap.org/w/images/7/7e/Example_distans_mark_board.png',
        tags: [{ waterway: 'milestone' }, { 'seamark:type': 'distance_mark' }],
        labelAttributes: [
          'distance',
          'seamark:distance_mark:distance',
          'seamark:distance_mark:units',
        ],
      },
      {
        label: 'Virtual Distance Marker',
        icon: 'https://wiki.openstreetmap.org/w/images/6/61/Example_distance_mark_not_installed.png',
        tags: [
          {
            'seamark:type': 'distance_mark',
            'seamark:distance_mark:category': 'not_installed',
          },
        ],
        labelAttributes: [
          'distance',
          'seamark:distance_mark:distance',
          'seamark:distance_mark:units',
        ],
      },
      {
        label: 'Hazardous Rock',
        icon: `${ICON_BASE_URL}/rock_dangerous.svg`,
        tags: [{ 'seamark:type': 'rock' }],
      },
      {
        label: 'Shipwreck',
        icon: `${ICON_BASE_URL}/wreck_surface.svg`,
        tags: [{ historic: 'wreck' }, { 'seamark:type': 'wreck' }],
        labelAttributes: ['wreck:date_sunk'],
      },
      {
        label: 'Pile',
        icon: 'https://wiki.openstreetmap.org/w/images/9/9c/Post.png',
        tags: [{ 'seamark:type': 'pile' }],
      },
      {
        label: 'Mooring Bollard',
        icon: 'https://wiki.openstreetmap.org/w/images/9/92/MBollard.png',
        tags: [
          { 'seamark:type': 'mooring', 'seamark:mooring:category': 'bollard' },
        ],
      },
      {
        label: 'Mooring Dolpin',
        icon: 'https://wiki.openstreetmap.org/w/images/0/0b/Dolphin.png',
        tags: [
          { 'seamark:type': 'mooring', 'seamark:mooring:category': 'dolphin' },
          { man_made: 'dolphin' },
        ],
      },
      {
        label: 'Underwater Named Feature',
        icon: '',
        tags: [
          { 'seamark:type': 'sea_area', 'seamark:sea_area:category': '*' },
        ],
      },
    ],
  },
  {
    categoryName: 'Landuse / Areas',
    items: [
      {
        label: 'Turning Basin',
        icon: `${ICON_BASE_URL}/turning_basin.svg`,
        tags: [
          { waterway: 'turning_point' },
          { 'seamark:type': 'turning_basin' },
        ],
      },
      {
        label: 'Marine Farm / Aquaculture',
        icon: `${ICON_BASE_URL}/marine_farm.svg`,
        tags: [{ 'seamark:type': 'marine_farm' }],
      },
      {
        label: 'Production Area',
        icon: 'https://wiki.openstreetmap.org/w/images/6/6b/Openseamap_rendering_production_area.png',
        tags: [{ 'seamark:type': 'production_area' }],
      },
      {
        label: 'Anchorage Area',
        icon: 'https://wiki.openstreetmap.org/w/images/a/aa/Anchorage.png',
        tags: [{ 'seamark:type': 'anchorage' }],
        labelAttributes: ['seamark:anchorage:category'],
      },
      {
        label: 'Restricted Area',
        icon: 'https://wiki.openstreetmap.org/w/images/4/4f/DumpingGround.png',
        tags: [
          { 'seamark:type': 'restricted_area' },
          { 'seamark:type': 'cable_area' },
          { 'seamark:type': 'pipeline_area' },
          { 'seamark:type': 'dumping_ground' },
          { leisure: 'swimming_area' },
        ],
      },
      {
        label: 'Permanently Moored Ship',
        icon: 'https://wiki.openstreetmap.org/w/images/f/fe/Openseamap_rendering_hulk.png',
        tags: [
          { building: 'ship' },
          { historic: 'ship' },
          { 'seamark:type': 'hulk' },
        ],
      },
      {
        label: 'Shipping Channel / Fairway Area',
        icon: 'https://wiki.openstreetmap.org/w/images/d/dc/Openseamap_rendering_fairway.png',
        tags: [{ 'seamark:type': 'fairway' }],
      },
    ],
  },
  {
    categoryName: 'Barriers',
    items: [
      {
        label: 'Floating Barrier (boom)',
        icon: 'https://wiki.openstreetmap.org/w/images/8/88/PipelineO.png',
        tags: [
          { waterway: 'floating_barrier' },
          {
            'seamark:type': 'obstruction',
            'seamark:obstruction:category': 'boom',
          },
          { barrier: 'floating_boom' },
        ],
      },
      {
        label: 'Debris Screen',
        icon: 'https://wiki.openstreetmap.org/w/images/8/88/PipelineO.png',
        tags: [{ waterway: 'debris_screen' }],
      },
      {
        label: 'Dam/Weir',
        icon: 'https://wiki.openstreetmap.org/w/images/8/88/PipelineO.png',
        tags: [
          { waterway: 'dam' },
          { waterway: 'weir' },
          { waterway: 'check_dam' },
        ],
      },
      {
        label: 'Shark Net',
        icon: 'https://wiki.openstreetmap.org/w/images/8/88/PipelineO.png',
        tags: [{ barrier: 'shark_net' }],
      },
      {
        label: 'Gate',
        icon: 'https://wiki.openstreetmap.org/w/images/8/88/PipelineO.png',
        tags: [
          { waterway: 'floodgate' },
          { waterway: 'lock_gate' },
          { waterway: 'security_lock' },
          { waterway: 'sluice_gate' },
        ],
      },
      {
        label: 'Marine Obstruction',
        icon: '',
        tags: [{ 'seamark:type': 'obstruction' }],
      },
    ],
  },
  {
    categoryName: 'Other Lines',
    items: [
      {
        label: 'Overhead Cable',
        icon: `${ICON_BASE_URL}/line-style/cable_submarine.svg`,
        tags: [{ 'seamark:type': 'cable_overhead' }],
        labelAttributes: ['seamark:cable_overhead:clearance_height_safe'],
      },
      {
        label: 'Underwater Cable',
        icon: `${ICON_BASE_URL}/line-style/cable_submarine.svg`,
        tags: [{ 'seamark:type': 'cable_submarine' }],
      },
      {
        label: 'Overhead Pipeline',
        icon: `${ICON_BASE_URL}/line-style/pipeline_submarine.svg`,
        tags: [{ 'seamark:type': 'pipeline_overhead' }],
      },
      {
        label: 'Underwater Pipeline',
        icon: `${ICON_BASE_URL}/line-style/pipeline_submarine.svg`,
        tags: [{ 'seamark:type': 'pipeline_submarine' }],
      },
      {
        label: 'Navigation Line',
        icon: '',
        tags: [{ 'seamark:type': 'navigation_line' }],
        labelAttributes: ['seamark:navigation_line:orientation'],
      },
      {
        label: 'Recommended Track',
        icon: '',
        tags: [{ 'seamark:type': 'recommended_track' }],
        labelAttributes: ['seamark:recommended_track:orientation'],
      },
    ],
  },
  {
    categoryName: 'Traffic Separation Scheme',
    items: [
      {
        label: 'Separation Lane',
        icon: `${ICON_BASE_URL}/line-style/separation_lane.svg`,
        tags: [{ 'seamark:type': 'separation_lane' }],
      },
      {
        label: 'Separation Boundary',
        icon: 'https://wiki.openstreetmap.org/w/images/7/73/Openseamap_rendering_separation_boundary.png',
        tags: [{ 'seamark:type': 'separation_boundary' }],
      },
      {
        label: 'Separation Zone',
        icon: 'https://wiki.openstreetmap.org/w/images/2/24/Openseamap_rendering_separation_zone.png',
        tags: [
          { 'seamark:type': 'separation_zone' },
          { 'seamark:type': 'separation_roundabout' },
        ],
      },
    ],
  },

  /* TODO: everything from the navmark renderer (notices, beacons, buoys, etc.) */
];
