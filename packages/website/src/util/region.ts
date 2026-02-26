import region from 'get-region';

// we use the timezone to approximate the user's continent,
// so that the map opens to a somewhat-local location which
// is a good showcase of seamark tagging.
const CONTINENTS: Record<string, [z: number, lat: number, lon: number]> = {
  Africa: [12.2, 32.38232, 30.35827], // Suez Canal
  America: [12.28, -122.40002, 37.80087], // Bay Area
  Antarctica: [17, 174.768936, -36.840648], // Auckland
  Australia: [11.85, 151.21808, -33.85268], // Sydney
  Arctic: [12.7, 10.70893, 59.89457], // Norway
  Asia: [12.11, 103.71636, 1.24881], // Singapore
  Atlantic: [12.75, -15.42379, 28.13148], // Gran Canaria
  Europe: [13.28, 4.98526, 52.36471], // Amsterdam
  Indian: [12.99, 57.48512, -20.14703], // Mauritius
  Pacific: [17, 174.768936, -36.840648], // Auckland
};

export const HOME_LOCATION = CONTINENTS[region.timeZone.split('/')[0]!]!;
