export class GeoPoint {
  constructor(private latitude: number, private longitude: number) {}

  get value() {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
    }
  }
}
