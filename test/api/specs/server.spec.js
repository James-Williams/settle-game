
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

  it('two games have different state', async () => {
    const testState = [ {one: 1}, {two: 2} ]
    const gameIds = Array(2)

    const gameRes = await request(Server)
      .post('/api/game/')
      .send({})
    gameIds[0] = gameRes.body.gameId
    const s = '/api/game/' + gameIds[0] + '/state/'
    const putRes = await request(Server)
      .post(s)
      .send(testState[0])

    const gameRes1 = await request(Server)
      .post('/api/game/')
      .send({})
    gameIds[1] = gameRes1.body.gameId
    const s1 = '/api/game/' + gameIds[1] + '/state/'
    const putRes1 = await request(Server)
      .post(s1)
      .send(testState[1])

    const getRes0= await request(Server)
      .get(s + 'latest')

    console.log(s)
    console.log(s1)

    expect(getRes0.statusCode).toEqual(200)
    expect(getRes0.body.state).toEqual(testState[0])

    const getRes1 = await request(Server)
      .get(s1 + 'latest')

    expect(getRes1.statusCode).toEqual(200)
    expect(getRes1.body.state).toEqual(testState[1])
  })
})

beforeAll(() => {
  process.env.REDIS_URL = 'REDIS-MOCK'
  Server = require('@/../server.js')
})

afterAll(() => { if (Server) Server.close()})
