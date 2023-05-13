import { Dayjs } from 'dayjs'
import Imap, { Box, ImapFetch } from 'imap'
import { download } from '../utils/utils'
import libqp from 'libqp'
import { JSDOM } from 'jsdom'

export type SearchQuery = {
  qualifiedName: string
  attribute: string
  textContent: string
}

export default class ImapReader {
  connection: Imap

  constructor() {
    const env = process.env.NODE_ENV!.toUpperCase()

    const {
      [`MAILBOX_USER_${env}`]: mailBoxUser,
      [`MAILBOX_PWD_${env}`]: mailBoxPwd,
      [`IMAP_HOST_${env}`]: imapHost,
      [`IMAP_PORT_${env}`]: imapPort,
    } = process.env

    this.connection = new Imap({
      user: mailBoxUser || '',
      password: mailBoxPwd || '',
      host: imapHost || '',
      port: Number(imapPort),
      tls: true,
    })
  }

  connect(): Imap {
    this.connection.connect()
    return this.connection
  }

  openMailBox(): Promise<Box> {
    const connection = this.connection
    return new Promise((fulfill, reject) => {
      connection.once('ready', () => {
        connection.openBox('INBOX', true, (error: Error, mailbox: Box) => {
          if (error) reject(error)
          fulfill(mailbox)
        })
      })
      connection.on('error', (error: Error) => reject(error))
    })
  }

  async getSupplierMessagesFromImap(
    senderEmail: string,
    lastRunDate: Dayjs,
    name: string,
    currentRunDirectory: string,
  ): Promise<void> {
    const connection = this.connection
    const searchDate = lastRunDate.format('MMM D, YYYY')

    const textBody = 'TEXT'

    connection.seq.search(
      [
        ['FROM', senderEmail],
        ['SINCE', searchDate],
      ],
      (err, results) => {
        const fetch: ImapFetch = connection.seq.fetch(results, {
          bodies: [textBody],
          struct: true,
        })

        fetch.on('message', (message, seqno) => {
          message.on('body', async (stream, info) => {
            if (info.which === textBody) {
              let buffer = ''

              stream.on('data', (chunk) => (buffer += chunk.toString('utf8')))

              stream.once('end', async () => {
                const founds: Array<string> = []
                const queries: Array<SearchQuery> = [
                  {
                    qualifiedName: 'a',
                    attribute: 'href',
                    textContent: 'Télécharger',
                  },
                  {
                    qualifiedName: 'a',
                    attribute: 'href',
                    textContent: 'Liste des prix',
                  },
                ]
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
                    const url = found.getAttribute(what.attribute)
                    if (url) {
                      const path = `${currentRunDirectory}/${seqno}`
                      await download(url, path)
                    }
                  }
                }
              })
            }
          })
        })

        fetch.once('end', () => {
          console.log(
            `Successfully fetched ${results.length} messages from ${senderEmail}.`,
          )
        })
      },
    )
  }
}
