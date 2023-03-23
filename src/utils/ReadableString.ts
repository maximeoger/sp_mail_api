import { Readable } from 'stream'

export default class ReadableString extends Readable {
  str: string = ''

  constructor(str: string) {
    super()
    this.str = str
  }

  _read() {
    this.push(Buffer.from(this.str))
  }
}