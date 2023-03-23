import { inspect } from 'util';
import fs from 'node:fs/promises';
import Connection from "imap";
import dayjs from "dayjs";
import { JSDOM } from "jsdom";
import Imap, {Box, Config, ImapFetch, ImapMessage} from 'imap';
import { simpleParser, ParsedMail } from "mailparser";
import {Supplier} from "../utils/suppliers";
import ReadableString from '../utils/ReadableString'

const imapReader = (config: Config) : Connection => {
  const imap = new Imap(config)
  imap.connect()
  return imap
}

export const getMailbox = (connection: Imap): Promise<Box> => {
  return new Promise((fulfill, reject) => {
    connection.once('ready', () => {
      connection.openBox('INBOX', true, (error: Error, mailbox: Box) => {
        if(error) reject(error)
        fulfill(mailbox)
      })
    })
  })
}

let today : string = dayjs().format('MMMM DD, YYYY')

export const getSupplierMessages = (connection: Imap, supplier: Supplier) : void => {
  connection.seq.search([
    ['FROM', supplier.sender_email],
    ['SENTSINCE', supplier.last_fetch_messages],
    //['ON', today]
  ],  (err, results) => {
    if(err) throw err

    console.log('SEARCH RESULTS', {
      from: supplier.sender_email,
      since: supplier.last_fetch_messages,
      results
    })
    const fetch : ImapFetch = connection.seq.fetch(results, { bodies: ['HEADER.FIELDS (SUBJECT)','TEXT'], struct: true });

    fetch.on('message', (message, seqno) => {
      const prefix = '(#' + seqno + ') ';

      message.on('body', (stream, info) => {
        simpleParser(stream, async (error, mail) => {

          if(error) console.log('Read mail executor error ....', error)

          if(mail.textAsHtml) {
            console.log('len', {
              firstChar: mail.textAsHtml[0],
              textHasHtml: mail.textAsHtml.length,
              text: mail.text?.length
            })
            const bodyHTML = new JSDOM(mail.textAsHtml)
            const fileHandle = await fs.open(__dirname + '/output.html', 'w')
            console.log(__dirname + '/output.html')
            const writable = fileHandle.createWriteStream({})
            const readable = new ReadableString(mail.textAsHtml)

            let i = 0
            readable.on('data', chunk => {
              console.log({i,
                chunk,
                chuncksize: chunk.toString().length
              })
              readable.pause()
              if(null !== writable.write(chunk)) {

                readable.pause()
              }
            })

            writable.on('drain', () => {
              console.log('DRAIN')
              //readable.resume()
            })

            readable.on('end', () => console.log('finished Read'))
          }
        })
      })

      message.once('attributes', (attrs) => {
        //console.log(`${prefix} Attributes %s`, inspect(attrs, false, 8))
      })

      message.once('end', () => console.log(`${prefix} Finished`))
    })

    fetch.once('error', (error) => console.log(`Fetch error : ${error}`))

    fetch.once('end', () => console.log(`Done fetching all messages from ${supplier.name} since ${supplier.last_fetch_messages.toString()}`))
  })
}

export default imapReader