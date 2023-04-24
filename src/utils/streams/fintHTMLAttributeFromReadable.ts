import {ReadStream} from "fs";

type SearchQuery = {
  qualifiedName: string;
  attribute: string;
  textContent: string;
}

async function findHTMLAttributeValueFromReadable (readable: ReadStream, what: SearchQuery) : Promise<string> {
  return new Promise((fulfill, reject) => {
    let lastChunk = ''

    readable.on('data', (buffer) => {
      let chunk = buffer.toString('utf8')
      let stringToFind = what.textContent
      let result = ''
      let cursor = 0

      for(let i = 0; i <= chunk.length; i++) {

        if(stringToFind[cursor] === chunk[i]) {
          result += chunk[i]
          cursor += 1
        } else {
          result = ''
          cursor = 0
        }

      }

      if(cursor < stringToFind.length) {
        lastChunk = chunk
        fulfill('test')
      }
    })
  })
}

export default findHTMLAttributeValueFromReadable