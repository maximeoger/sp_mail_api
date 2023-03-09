import util from 'util';
import Imap, {Box, Config, ImapFetch, ImapMessage} from 'imap';

const inspect = util.inspect

const imapReader = function (config: Config) {
  const imap = new Imap(config)
  imap.connect()
  return imap
}

export const getMailbox = function (connection: Imap): Promise<Box> {
  return new Promise((resolve, reject) => {
    connection.once('ready', () => {
      connection.openBox('INBOX', true, (error: Error, mailbox: Box) => {
        if(error) reject(error)
        resolve(mailbox)
      })
    })
  })
}

export const getImapFetch = function (connection: Imap, mailbox: Box): Promise<ImapFetch> {
  return new Promise((resolve) => {
    const fetch = connection.seq.fetch(`${mailbox.messages.total}:3`, {
      bodies: ['TEXT'],
      struct: true
    })
    resolve(fetch)
  })
}

export const getMessages = function (imapFetch: ImapFetch): any {
  imapFetch.on('message', (message, seqno) => {
    console.info('Message #%d', seqno)
    const prefix = `(#${seqno}) `

    message.on('body', (stream, info) => {
      console.log('INFO', info.which)

      if(info.which === 'TEXT') {
        console.log(`${prefix} Body [%s] found, %d total bytes`, inspect(info.which), info.size);
        let buffer = '', count = 0;
        stream.on('data', (chunk) => {
          count += chunk.length;
          buffer += chunk.toString();
          if(info.which === 'TEXT') {
            console.log(`${prefix} Body header: %s`, inspect(Imap.parseHeader(buffer)));
          } else {
            console.log(`${prefix} Body [%s] Finished`, inspect(info.which));
          }
        })
      }
    })

    message.once('attributes', (attributes) => {
      console.log(`${prefix} Attributes: %s`, inspect(attributes, false, 8))
    })

    message.once('end', () => {
      console.log(`${prefix} Finished`)
    })
  })

  imapFetch.on('error', (error) => {
    console.error(`Fetch error : ${error}`)
  })
}

export default imapReader