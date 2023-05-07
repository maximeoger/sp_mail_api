import {JSDOM} from 'jsdom'
import {Stream} from 'stream'
import libqp from 'libqp'

type SearchQuery = {
  qualifiedName: string;
  attribute: string;
  textContent: string;
}

async function findHTMLAttributeValueFromReadable (readable: Stream, what: SearchQuery) : Promise<string> {
  return new Promise((fulfill, reject) => {

    readable.on('data', (buffer) => {

      // decoder les caractères "quoted printable"
      let _buff = libqp.decode(buffer)
      // convertir le résultat en utf8
      let data = _buff.toString('utf-8')

      let { window } = new JSDOM(data, {
        contentType: 'text/html',
      })

      let links = Array.from(window.document.querySelectorAll(what.qualifiedName))
      let found = links.find((el : any) => {
        return el.textContent === what.textContent
      })

      if(found) {
        let attributeValue = found.getAttribute(what.attribute)
        if(attributeValue) {
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