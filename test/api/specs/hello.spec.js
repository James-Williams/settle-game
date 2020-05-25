
const request = require('supertest')
import Server from '@/../server.js'

describe('/game/', () => {
  it('posting to create game is ok', async () => {
    const res = await request(Server)
      .post('/api/game/')
      .send({})
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('gameId')
  })

  it('should 404 for invalid game id', async () => {
    const res = await request(Server)
      .get('/api/game/invalid-id/state/0')
      .send()
    expect(res.statusCode).toEqual(404)
  })

  it('can fetch state for new game', async () => {
    const gameRes = await request(Server)
      .post('/api/game/')
      .send({})
    const gameId = gameRes.body.gameId
    const p = '/api/game/' + gameId + '/state/0'
    const stateRes = await request(Server)
      .get(p)

    expect(stateRes.statusCode).toEqual(200)
    expect(stateRes.body).toHaveProperty('state')
  })
})

afterAll(() => Server.close());
