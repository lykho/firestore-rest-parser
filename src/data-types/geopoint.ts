import { GeoPointValue } from '../types'

/**
 * Wrapper for Firestore GeoPoint values.
 *
 * Represents a geographic coordinate as a latitude/longitude pair.
 *
 * @example
 * ```typescript
 * const location = new GeoPoint(40.7128, -74.0060);
 * convert({ headquarters: location });
 * // => { headquarters: { geoPointValue: { latitude: 40.7128, longitude: -74.0060 } } }
 * ```
 */
export class GeoPoint {
  /**
   * @param latitude - Latitude in degrees, range [-90, 90]
   * @param longitude - Longitude in degrees, range [-180, 180]
   */
  constructor(private latitude: number, private longitude: number) {}

  /**
   * Returns the coordinate pair as a plain object.
   */
  get value(): GeoPointValue {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
    }
  }
}
