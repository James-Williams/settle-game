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

const ID = 'new-dummy-id'

app.post('/api/game/', (req, res) => {
  res.status(201)
  res.send({
    gameId: ID
  })
})

app.post('/api/game/:gid/state/', (req, res) => {
  if (req.params.gid === ID) {
    redis.hset('latestGameState', req.params.gid, JSON.stringify(req.body), (err, val) => {
      res.status(201)
      res.send()
    })
  }
})

app.get('/api/game/:gid/state/latest', (req, res) => {
  if (req.params.gid === ID) {
    redis.hget('latestGameState', req.params.gid, (err, val) => {
      res.status(200)
      res.send({
        state: JSON.parse(val) || 'none'
      })
    })
  } else {
    res.status(404)
    res.send()
  }
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
