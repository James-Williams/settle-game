const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')
const appDir = path.resolve(__dirname, "dist")

const app = express()
app.use(serveStatic(appDir))
app.use(express.json())

const ID = 'new-dummy-id'

app.post('/api/game/', (req, res) => {
  res.status(201)
  res.send({
    gameId: ID
  })
})

app.get('/api/game/:gid/state/:sid', (req, res) => {
  if (req.params.gid === ID && req.params.sid === "0") {
    res.status(200)
    res.send({
      state: "hello"
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
