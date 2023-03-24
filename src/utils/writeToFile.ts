import fs from "node:fs/promises";
import ReadableString from "./ReadableString";

export default async function writeToFile(data: string, filePath: string) : Promise<void> {
  const fileHandle = await fs.open(filePath, 'w')
  const writable = fileHandle.createWriteStream()
  const readable = new ReadableString(data, { highWaterMark: 8 * 1024 })
  readable.setEncoding('utf-8')

  readable.on('data', (chunk) => {
    if(!writable.write(chunk)) {
      readable.pause()
    }
  })

  writable.on('drain', () => {
    readable.resume()
  })

  readable.on('end', () => console.log('finished Read'))
}