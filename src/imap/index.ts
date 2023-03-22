import { inspect } from 'util';
import Imap, {Box, Config, ImapFetch, ImapMessage} from 'imap';
import { simpleParser, ParsedMail } from "mailparser";
import {Supplier} from "../utils/suppliers";
import Connection from "imap";

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

export const getSupplierMessages = (connection: Imap, supplier: Supplier) : void => {
  connection.search([
    'UNSEEN',
    ['FROM', supplier.sender_email],
  //  ['SINCE', supplier.last_fetch_messages]
  ],  (err, results) => {
    if(err) throw err

    const fetch : ImapFetch = connection.fetch(results, { bodies: ['HEADER.FIELDS (FROM)','TEXT'], struct: true });

    fetch.on('message', (message, seqno) => {
      const prefix = '(#' + seqno + ') ';

      message.on('body', (stream, info) => {
        simpleParser(stream, (error, mail) => {
          if(error) console.log('Read mail executor error ....', error)
          console.log('FROM %s', mail.from)

          let mailEnvelope = {
            from: mail.from?.text,
            text: Boolean(mail.text),
            html: Boolean(mail.html),
            date: mail.date,
          }

          //console.log(`${prefix} Body %s`, mailEnvelope)

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