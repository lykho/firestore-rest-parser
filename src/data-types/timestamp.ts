import { isDate } from 'lodash'

export class Timestamp {
  constructor(private time: number | Date) {}

  get value() {
    if (isDate(this.time)) {
      return this.time.toISOString()
    } else {
      return this.time
    }
  }
}
