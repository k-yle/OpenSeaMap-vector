[![CI status: website](https://github.com/k-yle/OpenSeaMap-vector/actions/workflows/website.yml/badge.svg)](https://github.com/k-yle/OpenSeaMap-vector/actions/workflows/build_website.yml)
[![CI status: planet](https://github.com/k-yle/OpenSeaMap-vector/actions/workflows/planet.yml/badge.svg)](https://github.com/k-yle/OpenSeaMap-vector/actions/workflows/planet.yml)
![Lines of code](https://sloc.xyz/github/k-yle/OpenSeaMap-vector)

# OpenSeaMap-vector

[OpenSeaMap<b>-vector</b>](https://kyle.kiwi/OpenSeaMap-vector) is rewrite of [OpenSeaMap<b>.org</b>](https://OpenSeaMap.org), using [vector tiles](https://en.wikipedia.org/wiki/Vector_tiles) instead of [raster tiles](https://osm.wiki/Raster_tiles).
Inspired by [OpenRailwayMap<b>.app</b>](https://OpenRailwayMap.app) (a vector rewrite of [OpenRailwayMap<b>.org</b>](https://OpenRailwayMap.org)).

[![Example Screenshot](./data/public/example.png)](https://kyle.kiwi/OpenSeaMap-vector)

## Architecture

[![](./data/public/flowchart.png)](https://psg1rwze8tq6.feishu.cn/docx/Z8ehdUCIooMNiaxOxgyl3Fj8gwh?openbrd=1&doc_app_id=501&blockId=C91hd0fbDoND0cxzRMPln72Qgme&blockType=whiteboard&blockToken=Za4rwBgPlhJN1xbn4sflyUeTgWg#C91hd0fbDoND0cxzRMPln72Qgme)

Due to [limited disk space](https://github.com/k-yle/OpenSeaMap-vector/blob/d20a97e9/.github/workflows/planet.yml#L26-L30) in GitHub Actions, the initial `.pbf` filtering is processed seperately for each continent, and then merged back together.
This is [inconvenient](https://github.com/osmcode/osmium-tool/issues/197), but there is no alternative solution which is completely free.

The entire process takes about 90 minutes. More granular timings can be [viewed in GitHub Actions](https://github.com/k-yle/OpenSeaMap-vector/actions/workflows/planet.yml).

## navmark-renderer

Navigation marks require a huge number of OSM tags to be accurately described, in extreme cases [>250 tags](https://osm.org/node/1211591064) are required on a single node.

Since it's impossible to pre-generate icons for every possible combination, SVG icons for navigational marks are rendered on-the-fly in the browser.

The following unit test snapshots show the complexity involved, just for a small part of the process ([buoys](https://osm.wiki/Seamarks/Buoys), [beacons](https://osm.wiki/Seamarks/Beacons), and [topmarks](https://osm.wiki/Seamarks/Topmarks_and_Daymarks)):

![](./packages/navmark-renderer/src/__tests__/topmark-structure-matrix.svg)
![](./packages/navmark-renderer/src/__tests__/topmark4.svg)
![](./packages/navmark-renderer/src/__tests__/structure4.svg)

For [notices](https://osm.wiki/Seamarks/CEVNI_Notice_Marks) (traffic signs), the SVG templates define the coordinates where the text should be placed, and this text is drawn using [an HTML `<canvas />`](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API):

| Templates                                                                           | Rendered with text                                                                                                          |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| <img height="400" src="./packages/navmark-renderer/src/__tests__/notice-all.svg" /> | <img src="./packages/navmark-renderer/src/__tests__/__screenshots__/notice.cy.tsx/notice-2-chrome-darwin.png" height="50"/> |

# Goals

There are already [many](https://appchart.c-map.com/core/map) [apps](https://fishing-app.gpsnauticalcharts.com/i-boating-fishing-web-app/fishing-marine-charts-navigation.html) which render ENC data.
For OpenStreetMap data, alternative software includes:

- **OpenSeaMap.org**: raster renderer ([map](https://map.openseamap.org), [code](https://github.com/OpenSeaMap/renderer))
- **SmRender**: raster renderer ([map](https://github.com/rahra/smrender/blob/master/doc/sample_cutout.jpg), [code](https://github.com/rahra/smrender))
- **OpenNCS**: vector renderer, closed-source (~~map~~, ~~code~~, [research paper](https://doi.org/10.1017/S0373463322000327))

This project is not trying to create another ENC renderer that is aimed purely at professional mariners.

Instead, this map aims to render the valuable detail which is captured by OpenStreetMap, but deemed unimportant by the [S-57](https://www.teledynecaris.com/s-57/) spec.
In paticular, **features related to recreational boating / sailing / paddling**.

Therefore, there are several differences compared to [the original OpenSeaMap raster style](https://map.openseamap.org):

- Support for normal tags like [`leisure=slipway`](https://osm.wiki/Tag:leisure=slipway), instead of requiring bizzare duplicate tags like [`seamark:small_craft_facility:category=slipway`](https://osm.wiki/Tag:seamark:small_craft_facility:category=slipway). Likewise for [`ref`](https://osm.wiki/Key:ref) instead of [`seamark:berth:name`](https://osm.wiki/Key:seamark:berth:name) or [`seamark:information`](https://osm.wiki/Key:seamark:information).
- Renders recreational features like [kayak put-ins](https://osm.wiki/Tag:canoe=put_in), [shark nets](https://osm.wiki/Tag:barrier=shark_net), [fishing restrictions](https://osm.wiki/Tag:leisure=fishing), [whitewater rafting hazards](https://osm.wiki/Key:whitewater), etc.
- Worldwide support for notice marks (traffic signs), not just in Europe.
- Renders [text onto notice marks](./packages/navmark-renderer/src/__tests__/__screenshots__/notice.cy.tsx/notice-2-chrome-darwin.png), such as speed limit signs
- Shows [`access` restrictions](https://osm.wiki/Key:access), [`fee`s](https://osm.wiki/Key:fee), and [`opening_hours`](https://osm.wiki/Key:opening_hours) for recreational facilities like visitor berths.
- More detailed rendering of buoys, beacons, notice marks, and daymarks.
- And many more new features! See the map legend for a full list.

# Usage

Besides from [viewing the map](https://kyle.kiwi/OpenSeaMap-vector), various parts of this project could be re-used in your own app.

- **osm.pbf:** You can download a slimmed-down version of the osm planet file from our CDN, which only contains [`seamark:*`](https://osm.wiki/Seamarks/Seamark_Objects) and [some other tags](./data/osmium-tags-filter.ini). This file is only 40 MB, unlike the entire planet which is 80 GB. [Download Link](https://cdn-oceania-07.kyle.kiwi/seamarks.pbf).
- **maplibre-gl style:** You could _theoretically_ use the maplibre style JSON file in any other [maplibre](https://maplibre.org)-based map. For example, [in Overpass-Ultra](https://overpass-ultra.us/#run&m=13.79/-36.8330/174.7941&q=LQhQGcBcE8BsFMBcoAEL4A9LwHYBNxEUALSSAB0IHoqBrOeAOloEsB3FqgeXNwGV4AQwCyg8sABu8AMaQA9gCcqUBowBW4OTlCgQwUEA). [Download Link](https://kyle.kiwi/OpenSeaMap-vector/style.json). However, navigational marks won't render correctly, since they need to be generated on-the-fly with the [navmark-renderer](#navmark-renderer) JS library.
- **navmark-renderer:** this is an NPM library that could be re-used anywhere. See the [section above](#navmark-renderer).

This app is still an early prototype, so all of these resources are subject to change without a prewarning. Use at your own risk.

# Contributing

To edit the code for this project on your own computer:

- Install [Docker](https://docker.com).
- Install [NodeJS](https://nodejs.org).
- If you plan to edit the Java files, follow [planetiler's instructions](https://github.com/onthegomap/planetiler/blob/main/CONTRIBUTING.md) for installing Java and setting up your IDE.
- To generate the vector tiles:
  - change the URL in [planet.sh](./planet.sh) to [your local region](https://download.geofabrik.de).
  - run `. ./planet.sh`
  - run `. ./tiles.sh`
  - now you have tiles in [./data/public](./data/public) folder!
- To run the website:
  - run `. ./sprite.sh`
  - run `cd packages/navmark-renderer`
    - run `npm install`
    - run `npm run build`
    - run `cd ../..`
  - run `cd packages/website`
  - run `npm install`
  - run `npm start`
  - Open [localhost:1673](http://localhost:1673) in your browser.

# License

- The map data is sourced from [OpenStreetMap](https://osm.org) and licensed under the [ODbL license](https://osm.org/copyright).
- The code and icons in _this repository_ licensed under [Creative Commons CC0 license](https://wikidata.org/wiki/Wikidata:Copyright). Many icons are copied from other CC0-licensed projects, such as [Temaki](https://github.com/rapideditor/temaki) and selective icons from [Wikimed](https://commons.wikimedia.org/wiki/Category:SVG_Nautical_Chart_icons)[ia Commons](https://commons.wikimedia.org/wiki/Category:CEVNI_signs_by_function).

# Disclaimer

As usual, data from this map or from OpenStreetMap **should never be used for marine navigation**.
The contributors of this project take no responsibility for the accuracy of the data.
Always use official nautical charts.
