import dotenv from 'dotenv';
import Server from './server';
import {games_workshop, Supplier} from "./utils/suppliers";
import imapReader, {getMailbox, getSupplierMessages} from "./imap";
import util from "util";

dotenv.config()

const imapConfig = {
  user: process.env.MAILBOX_USER || "",
  password: process.env.MAILBOX_PWD || "",
  host: process.env.IMAP_HOST || "",
  port: Number(process.env.IMAP_PORT),
  tls: true
}

const fetchMail = async function (supplier: Supplier) {
  try {
    const imap = imapReader(imapConfig)
    const mailBox = await getMailbox(imap)
    const messages = await getSupplierMessages(imap, supplier)

  } catch(err) {
    console.log(err)
  }
}

fetchMail(games_workshop);

const app = new Server(3002)

app.start()
