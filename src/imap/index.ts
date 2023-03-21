import util from 'util';
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

export const getImapFetch = (connection: Imap, mailbox: Box): ImapFetch => connection.seq.fetch(`1:3`, {
  bodies: ['HEADER.FIELDS (FROM)','TEXT'],
  struct: true
})

export const getMessages = (connection: Imap): Promise<Array<ImapMessage>> => {

  const fetch = connection.seq.fetch(`1:3`, {
    bodies: ['HEADER.FIELDS (FROM)','TEXT'],
    struct: true
  })

  return new Promise((fulfill, reject) => {
    let messages : Array<ImapMessage> = []
    let listeners = 0;

    fetch.on('newListener', (event) => {
      if (listeners === 3) ful
    })

    fetch.on('message', (message, seqno) => {
      messages.push(message)
    })

    fetch.once('end', () => {
      console.log('Fetched %d messages', messages.length)
      fulfill(messages)
    })

    fetch.once('error', (error) => {
      console.error(`Fetch error : ${error}`)
      reject(error)
    })

  })
}

export const getMessageBody = (message: ImapMessage): Promise<any> => {
  return new Promise((fulFill, reject) => {
    let messageBody: any = null
    let buff : Buffer;

    message.on('body', function(stream, info) {
      let buffer = '';
      stream.on('data', function(chunk) {
        buffer += chunk.toString('utf8');
      });
      stream.once('end', function() {
        console.log('Parsed header: %s', util.inspect(Imap.parseHeader(buffer)));
      });
    });
    message.once('attributes', function(attrs) {
      console.log(  'Attributes: %s', util.inspect(attrs, false, 8));
    });
    message.once('end', function() {
      console.log( 'Finished');
    });


  })
}

export const parseMessage = (message: ImapMessage) : any => {

  let parsedMail : (ParsedMail | undefined)
  message.on('body',(stream, info) => {
    console.log('STREAM', stream, info)
  })
  /*
  return new Promise((resolve, reject) => {


    message.once('end', () => {
      console.log('4')
      console.info('Finished parsing all messages !')
      resolve(parsedMail)
    })

    message.once('error', (error: Error) => {
      console.log('5')
      console.error(`Parse error: ${error}`)
      reject(error)
    })


  })*/
}

export default imapReader