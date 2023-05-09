"use strict"

import { Dayjs } from "dayjs"
import Imap, {Box, ImapFetch} from 'imap'
import { downloadFileAndUnzip } from "../utils/utils"
import {Stream} from "stream";
import findHTMLAttributeValueFromReadable from "../utils/streams/fintHTMLAttributeFromReadable";

export default class ImapReader {
  connection : Imap

  constructor() {
    const env = process.env.NODE_ENV!.toUpperCase()

    const {
      [`MAILBOX_USER_${env}`] : mailBoxUser,
      [`MAILBOX_PWD_${env}`] : mailBoxPwd,
      [`IMAP_HOST_${env}`] : imapHost,
      [`IMAP_PORT_${env}`] : imapPort
    } = process.env

    this.connection = new Imap({
      user: mailBoxUser || "",
      password: mailBoxPwd || "",
      host: imapHost || "",
      port: Number(imapPort),
      tls: true
    })
  }

  connect() : Imap {
    this.connection.connect()
    return this.connection
  }

  openMailBox() : Promise<Box> {
    let connection = this.connection
    return new Promise((fulfill, reject) => {
      connection.once('ready', () => {
        connection.openBox('INBOX', true, (error: Error, mailbox: Box) => {
          if(error) reject(error)
          fulfill(mailbox)
        })
      })
      connection.on('error', (error : Error) => reject(error))
    })
  }

  async getSupplierMessagesFromImap(senderEmail: string, lastRunDate: Dayjs, name: string, currentRunDirectory: string) : Promise<void> {

    let connection = this.connection
    let searchDate = lastRunDate.format('MMM D, YYYY')

    let textBody = 'TEXT'

    connection.seq.search([
      ['FROM', senderEmail],
      ['SINCE', searchDate],
    ],  (err, results) => {

      const fetch : ImapFetch = connection.seq.fetch(results, { bodies: [textBody], struct: true })

      fetch.on('message', (message, seqno) => {

        message.on('body', async (stream, info) => {
          if(info.which === textBody) {
            let downloadLink = await this.retrieveDownloadLinkFromReadable(stream)
            if(!downloadLink) {
              console.log(`Pas de produits trouvés dans le mail #${seqno}`)
            } else {
              await downloadFileAndUnzip(downloadLink, seqno, currentRunDirectory)
            }
          }
        })
      })

      fetch.once('end', () => {
        console.log(`Successfully fetched ${results.length} messages from ${senderEmail}.`)
      })
    })
  }

  async retrieveDownloadLinkFromReadable(stream: Stream) : Promise<string> {

    const downloadLink = await findHTMLAttributeValueFromReadable(stream, {
      qualifiedName: 'a',
      attribute: 'href',
      textContent:  'Télécharger',
    })

    if(!downloadLink) {
      throw new Error('No Download link found')
    }

    return downloadLink
  }
}