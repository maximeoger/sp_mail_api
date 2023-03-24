import fs from "node:fs/promises";
import ReadableString from "./ReadableString";

export default async function writeToFile(data: string, filePath: string) : Promise<void> {
  const fileHandle = await fs.open(filePath, 'w')
  const writable = fileHandle.createWriteStream()
  const readable = new ReadableString(data, { highWaterMark: 8 * 1024 })
  readable.setEncoding('utf-8')

  readable.on('data', (chunk) => {

    const htmlPortion = chunk.toString('utf8')

    if(!writable.write(
      removeStyleTag(htmlPortion)
    )) {
      readable.pause()
    }
  })

  writable.on('drain', () => {
    readable.resume()
  })

  readable.on('end', () => console.log('finished Read'))
}

export const removeStyleTag = (htmlStr: string) : string => {
  const styleTagStart = htmlStr.indexOf('<style')
  const styleTagEnd = htmlStr.indexOf('</style>')
  let partToRemove = ''

  const openingTagFound = -1 !== styleTagStart
  const closingTagFound = -1 !== styleTagEnd

  if(openingTagFound && !closingTagFound) {
    console.log("starting tag partially inside")
    partToRemove = htmlStr.slice(styleTagStart, htmlStr.length).toString()
  }

  if(!openingTagFound && closingTagFound) {
    console.log("closing tag partially inside")
    partToRemove = htmlStr.slice(0, styleTagEnd + 8).toString() // '<style/>'.length === 8
  }

  if(openingTagFound && closingTagFound) {
    partToRemove = htmlStr.slice(styleTagStart, (styleTagEnd + 8)).toString()
  }

  return htmlStr.replace(partToRemove, '')
}