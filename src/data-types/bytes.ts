import * as Buffer from 'buffer'

export class Bytes {
  constructor(private buffer: Buffer.Buffer) {}

  get value() {
    return this.buffer.toString('base64')
  }
}
