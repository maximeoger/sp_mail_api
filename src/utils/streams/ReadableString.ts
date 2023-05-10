import { Readable, ReadableOptions } from 'stream'

export default class ReadableString extends Readable {
  str: string = ''

  constructor(str: string, opts: ReadableOptions) {
    super(opts)
    this.str = str
  }

  _read() {
    this.push(Buffer.from(this.str))
    this.push(null)
  }
}
