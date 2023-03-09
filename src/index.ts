import dotenv from 'dotenv';
import Server from './server';
import imapReader, { getMessages, getImapFetch, getMailbox } from "./imap";


dotenv.config()

const imapConfig = {
  user: process.env.MAILBOX_USER || "",
  password: process.env.MAILBOX_PWD || "",
  host: process.env.IMAP_HOST || "",
  port: Number(process.env.IMAP_PORT),
  tls: true
}

const fetchMail = async function () {
  try {
    const imap = imapReader(imapConfig)
    const mailBox = await getMailbox(imap)
    const imapFetch = await getImapFetch(imap, mailBox)
    getMessages(imapFetch)

  } catch(err) {
    console.log(err)
  }
}


fetchMail();

const app = new Server(3002)

app.start()
