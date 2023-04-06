import Connection from "imap";
import dayjs from "dayjs";
import { JSDOM } from "jsdom";
import Imap, {Box, Config, ImapFetch, ImapMessage} from 'imap';
import { simpleParser, Source } from "mailparser";
import fs from 'node:fs/promises';
import writeToFile from "../utils/writeToFile";
import { downloadFileAndUnzip } from "../utils/utils";

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

export const getSupplierMessagesFromImap = (connection: Imap, sender_email: string, last_fetch_messages: string, name: string) : Promise<Source> => {
  return new Promise((fulfill, reject) => {
    connection.seq.search([
      ['FROM', sender_email],
      ['SENTSINCE', last_fetch_messages],
      //['ON', today]
    ],  (err, results) => {
      if(err) throw err

      const fetch : ImapFetch = connection.seq.fetch(results, { bodies: ['HEADER.FIELDS (SUBJECT)','TEXT'], struct: true });

      fetch.on('message', (message, seqno) => {
        const prefix = '(#' + seqno + ') ';
        message.on('body', (stream, info) => {
          if(info.which === 'TEXT') {
            fulfill(stream)
          }
        })
        message.once('end', () => console.log(`${prefix} Finished`))
      })

      fetch.once('error', (error) => {
        console.log(`Fetch error : ${error}`)
        reject(error)
      })

      fetch.once('end', () => console.log(`Done fetching all messages from ${name} since ${last_fetch_messages.toString()}`))
    })
  })
}

export function writeEmailFile (stream: Source, currentRunDirectory: string) : Promise<void> {
  return new Promise((fulfill, reject) => {
    simpleParser(stream, async (error, mail) => {

      if(error) {
        console.log('Read mail executor error ....', error)
        reject(error)
      }

      if(mail.text) {
        await writeToFile(mail.text, currentRunDirectory + '/output.html')
        let fileHandle = await fs.open(currentRunDirectory + '/output.html', 'r')
        let readable = fileHandle.createReadStream()
        let html = ''

        readable.on('data', (buffer) => {
          let str = buffer.toString('utf8')
          html += str
        })

        readable.on('end', async () => {
          let { document } = (new JSDOM(html, {contentType: "text/html"})).window
          let aTags = document.getElementsByTagName('a')
          let searchText = "Télécharger"
          let found

          for(var i=0; i<aTags.length; i++){
            if(aTags[i].textContent === searchText) {
              found = aTags[i]
              break
            }
          }

          if(!found) {
            reject('No download link found for supplier.')
          } else {
            let downloadLink = found.getAttribute('href')
            await downloadFileAndUnzip(downloadLink!, currentRunDirectory)
          }


        })

      }
    })
  })
}

export default imapReader