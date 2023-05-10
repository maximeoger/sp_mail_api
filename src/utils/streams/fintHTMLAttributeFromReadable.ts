import { JSDOM } from 'jsdom'
import { Stream } from 'stream'
import libqp from 'libqp'

export type SearchQuery = {
  qualifiedName: string
  attribute: string
  textContent: string
}

async function findHTMLAttributeValueFromReadable(
  readable: Stream,
  what: SearchQuery,
): Promise<string> {
  return new Promise((fulfill, reject) => {
    readable.on('data', (buffer) => {
      // decoder les caractères "quoted printable"
      const _buff = libqp.decode(buffer)
      // convertir le résultat en utf8
      const data = _buff.toString('utf-8')

      const { window } = new JSDOM(data, {
        contentType: 'text/html',
      })

      const links = Array.from(
        window.document.querySelectorAll(what.qualifiedName),
      )
      const _links = links.map((el) => el.textContent)
      const found = links.find((el: any) => {
        return el.textContent === what.textContent
      })

      if (found) {
        const attributeValue = found.getAttribute(what.attribute)
        if (attributeValue) {
          fulfill(attributeValue)
        } else {
          reject(Error(`No attribute value for ${what.qualifiedName}`))
        }
      }
    })

    readable.on('error', (error) => reject(error))
  })
}

export default findHTMLAttributeValueFromReadable
