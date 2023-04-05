import dotenv from 'dotenv'
import dayjs, { Dayjs } from 'dayjs'
import Server from './server'
import GW from './domains/GamesWorkshop/GamesWorkshop'
import imapReader, { getMailbox, getSupplierMessages } from './imap'

dotenv.config()

const fetchMail = async function () {

  const gamesWorkshop = new GW({
    name: 'Games Workshop',
    dest_file_name: 'games_workshop',
    email: 'info@info.games-workshop.com',
    last_run: dayjs().subtract(1, 'week').format('MMMM DD, YYYY'),
  })

  gamesWorkshop.init()
  try {
    const mailBox = await getMailbox(gamesWorkshop.imapConnection!)
    const messages = await gamesWorkshop.getProductsFromNewsLetter()

  } catch(err) {
    console.log(err)
  }
}

fetchMail()

const app = new Server(3002)

app.start()
