const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')
const appDir = path.resolve(__dirname, "dist")
const { uid } = require('uid')

const app = express()
app.use(serveStatic(appDir))
app.use(express.json())

const redis = (process.env.REDIS_URL === 'REDIS-MOCK')
  ? require('redis-mock').createClient()
  : require('redis').createClient(process.env.REDIS_URL)

console.log(redis)

const createNewId = () => {
  return uid(8)
}

app.post('/api/game/', (req, res) => {
  res.status(201)
  res.send({
    gameId: createNewId()
  })
})

app.post('/api/game/:gid/state/', (req, res) => {
  const data = JSON.stringify(req.body)
  if (data) {
    const sid = uid(10)
    const gsid = req.params.gid + ':' + sid
    console.log('Store in ' + gsid + ': ' + data)
    redis.hset('gameState', gsid, data, (err, val) => {
      redis.hset('latestGameState', req.params.gid, sid, (err, val) => {
        res.status(201)
        res.send({
          href: path.normalize(req.baseUrl + req.path + '/' + sid)
        })
      })
    })
  }
})

app.get('/api/game/:gid/state/:sid', (req, res) => {
  const gsid = req.params.gid + ':' + req.params.sid
  redis.hget('gameState', gsid, (err, val) => {
    if (err || !val) {
      res.status(404)
      res.send()
    } else {
      res.status(200)
      res.send({
        href: path.normalize(req.baseUrl + req.path).replace(/\/+$/, ''),
        state: JSON.parse(val)
      })
    }
  })
})

app.get('/api/game/:gid/state/', (req, res) => {
  redis.hget('latestGameState', req.params.gid, (err, val) => {
    if (err) {
      res.status(404)
      res.send()
    } else {
      res.status(200)
      res.send({
        latest: path.normalize(req.baseUrl + req.path + '/' + val)
      })
    }
  })
})

app.get('/api/game/:gid', (req, res) => {
  redis.hget('latestGameState', req.params.gid, (err, val) => {
    if (err || !val) {
      res.status(404)
      res.send()
    } else {
      res.status(200)
      res.send({
        state: path.normalize(req.baseUrl + req.path + '/state/')
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
