const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')
const appDir = path.resolve(__dirname, "dist")

const app = express()
app.use(serveStatic(appDir))
app.use(express.json())

const redis = (process.env.REDIS_URL === 'REDIS-MOCK')
  ? require('redis-mock').createClient()
  : null

let lastIdNum = 0
const createNewId = () => {
  lastIdNum += 1
  return 'dummy-id-' + lastIdNum
}

app.post('/api/game/', (req, res) => {
  res.status(201)
  res.send({
    gameId: createNewId()
  })
})

app.post('/api/game/:gid/state/', (req, res) => {
  redis.hset('latestGameState', req.params.gid, JSON.stringify(req.body), (err, val) => {
    res.status(201)
    res.send()
  })
})

app.get('/api/game/:gid/state/latest', (req, res) => {
  redis.hget('latestGameState', req.params.gid, (err, val) => {
    if (err) {
      res.status(404)
      res.send()
    } else {
      res.status(200)
      res.send({
        state: JSON.parse(val) || 'none'
      })
    }
  })
})

app.get('/api/*', (req, res) => {
  res.status(404)
  res.send()
})

app.get('*', function( req, res ) {
    res.sendFile( path.resolve( appDir, "index.html" ) )
})

const port = process.env.PORT || 5000
module.exports = app.listen(port, () => {
  console.log('Listening on port ' + port)
});
