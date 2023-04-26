import GamesWorkshop from './GamesWorkshop'


describe('GamesWorkshop entity', () => {

  let gw = new GamesWorkshop({
    name: 'Games Workshop',
    dest_file_name: 'games_workshop',
    email: 'info@info.games-workshop.com'
  })

  it('should init with correct data', () => {
    expect(gw.name).toEqual('Games Workshop')
    expect(gw.dest_file_name).toEqual('games_workshop')
    expect(gw.email).toEqual('info@info.games-workshop.com')
  })
})