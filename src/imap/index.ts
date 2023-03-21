import { inspect } from 'util';
import Imap, {Box, Config, ImapFetch, ImapMessage} from 'imap';
import { simpleParser, ParsedMail } from "mailparser";

const imapReader = (config: Config) => {
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

export const getMessages = (connection: Imap): Promise<Array<ImapMessage>> => {

  const fetch : ImapFetch = connection.seq.fetch(`1:9`, {
    bodies: ['HEADER.FIELDS (FROM)','TEXT'],
    struct: false
  })

  return new Promise((fulfill, reject) => {
    fetch.on('message', (message, seqno) => {
      let prefix = '(#' + seqno + ') ';

      message.on('body', function(stream, info) {
        simpleParser(stream, (error, mail) => {
          if(error) console.log('Read mail executor error ....', error)

          let mailEnvelope = {
            from: mail.from?.text,
            text: mail.text,
            html: mail.html
          };

        })
      });

      message.once('attributes', function(attrs) {
        console.log(  'Attributes: %s', inspect(attrs, false, 8));
      });

      message.once('end', function() {
        console.log(`${prefix} finished`);
      });

    })

    fetch.once('end', () => {
      console.log('Fetched messages')
      //fulfill(messages)
    })

    fetch.once('error', (error) => {
      console.error(`Fetch error : ${error}`)
      reject(error)
    })
  })
}

export default imapReader