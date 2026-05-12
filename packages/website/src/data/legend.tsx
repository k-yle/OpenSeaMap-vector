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

const SPECIMEN_BASE_URL = 'https://kyle.kiwi/OpenSeaMap-vector/specimens';

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
        label: 'Boat Lift',
        icon: `${ICON_BASE_URL}/small_craft_facility/elevator.svg`,
        tags: [{ waterway: 'boat_lift' }],
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
        icon: `${ICON_BASE_URL}/small_craft_facility/fuel_station.svg`,
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
        icon: `${ICON_BASE_URL}/small_craft_facility/visitors_mooring.svg`,
        tags: [
          {
            'seamark:type': 'small_craft_facility',
            'seamark:small_craft_facility:category': 'visitors_mooring',
          },
        ],
        labelAttributes: BERTH_LABEL_KEYS,
      },
      {
        label: 'Rowing Club',
        icon: `${ICON_BASE_URL}/small_craft_facility/yacht_club.svg`,
        tags: [{ club: 'sport', sport: 'rowing' }],
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
          { club: 'sailing' },
          { club: 'sport', sport: 'sailing' },
          { club: 'yachting' },
          { club: 'boating' },
          { club: 'boat' },
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
        label: 'Maritime Education / Training',
        icon: `${ICON_BASE_URL}/small_craft_facility/yacht_club.svg`,
        tags: [
          { amenity: 'sailing_school' },
          { education: 'sailing_school' },
          { training: 'sailing' },
          { training: 'maritime' },
        ],
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
        label: 'Swimming Pontoon',
        icon: 'https://wiki.openstreetmap.org/w/images/f/fe/Openseamap_rendering_hulk.png',
        tags: [{ 'seamark:type': 'pontoon' }],
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
        label: 'Separation Divider',
        icon: 'https://wiki.openstreetmap.org/w/images/7/73/Openseamap_rendering_separation_boundary.png',
        tags: [{ 'seamark:type': 'separation_line' }],
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
  {
    categoryName: 'Buoys and Beacons',
    items: [
      {
        label: 'Leave-to-Port',
        icon: `${ICON_BASE_URL}/round_to_port.svg`,
        tags: [{ direction: 'clockwise' }],
      },
      {
        label: 'Leave-to-Starboard',
        icon: `${ICON_BASE_URL}/round_to_starboard.svg`,
        tags: [{ direction: 'anticlockwise' }],
      },
    ],
  },
  {
    categoryName: 'Notice Marks (Traffic Signs)',
    items: [
      ...Object.entries({
        no_entry: 'A1. No Entry',
        closed_area: 'A1a. Closed Area',
        no_overtaking: 'A2. No Overtaking',
        no_convoy_overtaking: 'A3. No Convoy Overtaking',
        no_passing: 'A4. No Passing',
        no_convoy_passing: 'A4.1. No Convoy Passing',
        no_berthing: 'A5. No Berthing',
        no_berthing_lateral_limit: 'A5a. No Berthing Lateral Limit',
        no_anchoring: 'A6. No Anchoring',
        no_mooring: 'A7. No Mooring',
        no_turning: 'A8. No Turning',
        no_wash: 'A9. No Wash',
        no_passage_left: 'A10a. No Passage Left',
        no_passage_right: 'A10b. No Passage Right',
        no_motor_craft: 'A1. No Motor Craft',
        no_sport_craft: 'A13. No Sport Craft',
        no_waterskiing: 'A14. No Waterskiing',
        no_sailing_craft: 'A15. No Sailing Craft',
        no_unpowered_craft: 'A16. No Unpowered Craft',
        no_sailboards: 'A17. No Sailboards',
        no_high_speeds: 'A18. No High Speeds',
        no_launching_beaching: 'A19. No Launching Beaching',
        no_waterbikes: 'A20. No Waterbikes',
        no_swimming: 'A20. No Swimming',
        no_kitesurfing: 'No Kitesurfing',
        no_fishing: 'No Fishing',

        move_to_left: 'B1a. Move To Left',
        move_to_right: 'B1b. Move To Right',
        move_to_port: 'B2a. Move To Port',
        move_to_starboard: 'B2b. Move To Starboard',
        keep_to_port: 'B3a. Keep To Port',
        keep_to_starboard: 'B3b. Keep To Starboard',
        cross_to_port: 'B4b. Cross To Port',
        cross_to_starboard: 'B4b. Cross To Starboard',
        stop: 'B5. Stop',
        speed_limit: 'B6. Speed Limit',
        sound_horn: 'B7. Sound Horn',
        keep_lookout: 'B8. Keep Lookout',
        give_way_junction: 'B9a. Give Way Junction',
        give_way_crossing: 'B9b. Give Way Crossing',
        make_radio_contact: 'B11. Make Radio Contact',
        use_shorepower: 'B12. Use Shorepower',

        limited_depth: 'C1. Limited Depth',
        limited_headroom: 'C2. Limited Headroom',
        limited_width: 'C3. Limited Width',
        navigation_restrictions: 'C4. Navigation Restrictions',
        channel_distance_left: 'C5a. Channel Distance Left',
        channel_distance_right: 'C5b. Channel Distance Right',
        maxweight: 'Maximum Weight/Displacement',

        channel_two_way: 'D1a. Channel Two Way',
        channel_one_way: 'D1b. Channel One Way',
        opening_to_right: 'D2a. Opening To Right',
        opening_to_left: 'D2b. Opening To Left',
        proceed_to_left: 'D3a. Proceed To Left',
        proceed_to_right: 'D3b. Proceed To Right',

        entry_permitted: 'E1. Entry Permitted',
        overhead_cable: 'E2. Overhead Cable',
        weir: 'E3. Weir',
        ferry_non_independent: 'E4a. Ferry Non Independent',
        ferry_independent: 'E4b. Ferry Independent',
        berthing_permitted: 'E5. Berthing Permitted',
        berthing_lateral_limit: 'E5.1. Berthing Lateral Limit',
        berthing_lateral_limits: 'E5.2. Berthing Lateral Limits',
        berth_rafting_limit: 'E5.3. Berth Rafting Limit',
        berthing_unmarked_pushing: 'E5.4. Berthing Unmarked Pushing',
        berthing_marked_pushing_1: 'E5.5. Berthing Marked Pushing 1',
        berthing_marked_pushing_2: 'E5.6. Berthing Marked Pushing 2',
        berthing_marked_pushing_3: 'E5.7. Berthing Marked Pushing 3',
        berthing_unmarked_non_pushing: 'E5.8. Berthing Unmarked Non Pushing',
        berthing_marked_non_pushing_1: 'E5.9. Berthing Marked Non Pushing 1',
        berthing_marked_non_pushing_2: 'E5.10. Berthing Marked Non Pushing 2',
        berthing_marked_non_pushing_3: 'E5.11. Berthing Marked Non Pushing 3',
        berthing_unmarked: 'E5.12. Berthing Unmarked',
        berthing_marked_1: 'E5.13. Berthing Marked 1',
        berthing_marked_2: 'E5.14. Berthing Marked 2',
        berthing_marked_3: 'E5.15. Berthing Marked 3',
        anchoring_permitted: 'E6. Anchoring Permitted',
        mooring_permitted: 'E7. Mooring Permitted',
        vehicle_loading_berth: 'E7.1. Vehicle Loading Berth',
        turning_area: 'E8. Turning Area',
        secondary_waterway_crossing: 'E9a. Secondary Waterway Crossing',
        secondary_waterway_right: 'E9b. Secondary Waterway Right',
        secondary_waterway_left: 'E9c. Secondary Waterway Left',
        main_waterway_right_secondary_ahead:
          'E9d. Main Waterway Right Secondary Ahead',
        main_waterway_left_secondary_ahead:
          'E9e. Main Waterway Left Secondary Ahead',
        main_waterway_right_secondary_left:
          'E9f. Main Waterway Right Secondary Left',
        main_waterway_left_secondary_right:
          'E9g. Main Waterway Left Secondary Right',
        main_waterway_right_secondary_ahead_left:
          'E9h. Main Waterway Right Secondary Ahead Left',
        main_waterway_left_secondary_ahead_right:
          'E9i. Main Waterway Left Secondary Ahead Right',
        main_waterway_crossing: 'E10a. Main Waterway Crossing',
        main_waterway_junction: 'E10b. Main Waterway Junction',
        main_waterway_ahead_right: 'E10c. Main Waterway Ahead Right',
        main_waterway_ahead_left: 'E10d. Main Waterway Ahead Left',
        main_waterway_ahead_right_secondary_left:
          'E10e. Main Waterway Ahead Right Secondary Left',
        main_waterway_ahead_left_secondary_right:
          'E10f. Main Waterway Ahead Left Secondary Right',
        prohibition_ends: 'E11. Prohibition Ends',
        drinking_water: 'E13. Drinking Water',
        telephone: 'E14. Telephone',
        motor_craft_permitted: 'E15. Motor Craft Permitted',
        sport_craft_permitted: 'E16. Sport Craft Permitted',
        waterskiing_permitted: 'E17. Waterskiing Permitted',
        sailing_craft_permitted: 'E18. Sailing Craft Permitted',
        unpowered_craft_permitted: 'E19. Unpowered Craft Permitted',
        sailboards_permitted: 'E20. Sailboards Permitted',
        high_speeds_permitted: 'E21. High Speeds Permitted',
        launching_beaching_permitted: 'E22. Launching Beaching Permitted',
        radio_information: 'E23. Radio Information',
        waterbikes_permitted: 'E24. Waterbikes Permitted',
        kitesurfing_permitted: 'E24. Kitesurfing Permitted',
        shorepower_permitted: 'E25. Shorepower Permitted',
        swimming_information: 'E26. Swimming Information',
        fishing_permitted: 'Fishing Permitted',
        submarine_cable: 'Submarine Cable',
        reduce_wash: 'Reduce Wash',
      }).map(
        ([id, label]): LegendEntry => ({
          label,
          icon: `${SPECIMEN_BASE_URL}/notices/${id}.svg`,
          tags: [{ 'seamark:notice:category': id }],
        }),
      ),
      {
        label: 'Unknown Notice',
        icon: `${SPECIMEN_BASE_URL}/notices/unknown.svg`,
        tags: [{ 'seamark:notice:category': '*' }],
      },
    ],
  },
  /* TODO: everything from the navmark renderer (notices, beacons, buoys, etc.) */
];
