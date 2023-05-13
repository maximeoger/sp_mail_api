import GamesWorkshop from './GamesWorkshop'
import fs from 'node:fs/promises'
import dayjs, { Dayjs } from 'dayjs'

describe('GamesWorkshop entity', () => {
  let gw = new GamesWorkshop({
    name: 'Games Workshop',
    dest_file_name: 'games_workshop',
    email: 'info@info.games-workshop.com',
  })

  beforeAll(async () => {})

  it('should init with correct data', () => {
    expect(gw.name).toEqual('Games Workshop')
    expect(gw.date_file_path).toEqual('games_workshop')
    expect(gw.email).toEqual('info@info.games-workshop.com')
  })
})
