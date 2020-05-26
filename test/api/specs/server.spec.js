
const request = require('supertest')
let Server = undefined

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
    const p = '/api/game/' + gameId + '/state/latest'
    const stateRes = await request(Server)
      .get(p)

    expect(stateRes.statusCode).toEqual(200)
    expect(stateRes.body).toHaveProperty('state')
  })

  it('can retrieve stored state', async () => {
    const testState = {foo: {bar: [1, 2, 3]}}
    const gameRes = await request(Server)
      .post('/api/game/')
      .send({})
    const gameId = gameRes.body.gameId
    const s = '/api/game/' + gameId + '/state/'
    const putRes = await request(Server)
      .post(s)
      .send(testState)

    expect(putRes.statusCode).toEqual(201)

    const getRes = await request(Server)
      .get(s + 'latest')

    expect(getRes.statusCode).toEqual(200)
    expect(getRes.body.state).toEqual(testState)
  })
})

beforeAll(() => {
  process.env.REDIS_URL = 'REDIS-MOCK'
  Server = require('@/../server.js')
})

afterAll(() => { if (Server) Server.close()})
