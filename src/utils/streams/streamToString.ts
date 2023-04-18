import {Stream} from "stream";

export async function streamToString (stream: Stream) : Promise<string> {
  const chunks : Array<Buffer> = []
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    stream.on('error', error => reject(error))
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}

