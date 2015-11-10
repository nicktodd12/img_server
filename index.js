var express = require('express')
var bodyParser = require('body-parser')
var logger = require('morgan')


var app = express()
app.use(bodyParser.json({limit: '10mb'}))

require('./app_server/posts.js').setup(app)
 

// Get the port from the environment, i.e., Heroku sets it
var port = process.env.PORT || 3000

//////////////////////////////////////////////////////
var server = app.listen(port, function() {
     console.log('Server listening at http://%s:%s', 
               server.address().address,
               server.address().port)
})