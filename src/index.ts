import dotenv from 'dotenv'
import Server from './server'
import GW from './domains/GamesWorkshop/GamesWorkshop'

dotenv.config()

const fetchMail = async function () {
  const gamesWorkshop = new GW({
    name: 'Games Workshop',
    dest_file_name: 'games_workshop',
    email: 'info@info.games-workshop.com',
  })

  await gamesWorkshop.init()

  try {
    await gamesWorkshop.run()
  } catch (err) {
    console.log(err)
  }
}

fetchMail()

const app = new Server(3002)

app.start()
