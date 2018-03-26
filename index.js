var express = require('express')
  , http = require('http')
  , cors = require('cors');

var app = express();
app.use(cors())
var server = http.createServer(app);

var tilelive = require('tilelive');
require('tilelive-mapnik').registerProtocols(tilelive);
var filename = __dirname + '/' + 'stylesheet.xml';
tilelive.load('mapnik://' + filename, function(err, source) {
    if (err) throw err;
    app.get('/:z/:x/:y.*', function(req, res) {
        //source.getTile(req.query['z'], req.query['x'], req.query['y'], function(err, tile, headers) {
        source.getTile(req.param('z'), req.param('x'), req.param('y'), function(err, tile, headers) {
            // `err` is an error object when generation failed, otherwise null.
            // `tile` contains the compressed image file as a Buffer
            // `headers` is a hash with HTTP headers for the image.
            if (!err) {
                res.send(tile);
            } else {
                res.send('Tile rendering error: ' + err + '\n');
            }
        });
    });
});

console.log('Listening on port: ' + 8081);
app.listen(8081);
