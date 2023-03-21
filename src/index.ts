import dotenv from 'dotenv';
import Server from './server';
import imapReader, {getMessages, getImapFetch, getMailbox, getMessageBody, parseMessage } from "./imap";
import util from "util";

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

    const messageEventEmitters = await getMessages(imap)

    const messageStream = await getMessageBody(messageEventEmitters[0])
    console.log(messageStream)

  } catch(err) {
    console.log(err)
  }
}

fetchMail();

const app = new Server(3002)

app.start()
