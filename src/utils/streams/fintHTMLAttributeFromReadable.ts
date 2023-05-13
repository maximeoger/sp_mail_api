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
  queries: Array<SearchQuery>,
): Promise<any> {
  const founds: Array<string> = []
  let buffer = ''

  readable.on('data', (chunk) => {
    buffer += chunk.toString('utf8')
  })

  readable.once('end', () => {
    // decoder les caractères "quoted printable"
    const _buff = libqp.decode(buffer)
    // convertir le résultat en utf8
    const data = _buff.toString('utf-8')

    const { window } = new JSDOM(data, {
      contentType: 'text/html',
    })

    for (const what of queries) {
      const links = Array.from(
        window.document.querySelectorAll(what.qualifiedName),
      )
      const found = links.find((el: any) => {
        return el.textContent === what.textContent
      })
      if (found) {
        const attributeValue = found.getAttribute(what.attribute)
        if (attributeValue) {
          founds.push(attributeValue)
        }
      }
    }
  })
}

export default findHTMLAttributeValueFromReadable
