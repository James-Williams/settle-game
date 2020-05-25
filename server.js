const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');
const appDir = path.resolve(__dirname, "dist")

const app = express();
app.use(serveStatic(appDir));

app.get( "*", function( req, res ) {
    res.sendFile( path.resolve( appDir, "index.html" ) );
} );

const port = process.env.PORT || 5000;
export default app.listen(port, () => {
  console.log('Listening on port ' + port)
});
