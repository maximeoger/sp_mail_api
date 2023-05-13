import dotenv from 'dotenv'
import GW from './domains/suppliers/GamesWorkshop/GamesWorkshop'
;(async function () {
  dotenv.config()
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
})()
