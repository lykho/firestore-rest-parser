import { GeoPointValue } from '../types'

/**
 * Wrapper for Firestore GeoPoint values.
 *
 * Represents a geographic coordinate as a latitude/longitude pair.
 *
 * @example
 * ```typescript
 * const location = new GeoPoint(40.7128, -74.0060)
 * convert({ headquarters: location })
 * // => { headquarters: { geoPointValue: { latitude: 40.7128, longitude: -74.0060 } } }
 * ```
 */
export class GeoPoint {
  /**
   * @param latitude - Latitude in degrees, range [-90, 90]
   * @param longitude - Longitude in degrees, range [-180, 180]
   */
  constructor(private latitude: number, private longitude: number) {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new RangeError('GeoPoint latitude and longitude must be finite numbers')
    }

    if (latitude < -90 || latitude > 90) {
      throw new RangeError('GeoPoint latitude must be between -90 and 90')
    }

    if (longitude < -180 || longitude > 180) {
      throw new RangeError('GeoPoint longitude must be between -180 and 180')
    }
  }

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
