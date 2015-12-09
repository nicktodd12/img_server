var express = require('express')
var bodyParser = require('body-parser')
var logger = require('morgan')
var cookieParser = require('cookie-parser')

var app = express()
app.use(bodyParser.json({limit: '10mb'}))
app.use(cookieParser())

//CORS
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", req.headers.origin);
 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
	if (req.method == 'OPTIONS') 
		res.sendStatus(200);
	else
		next();
})

if (process.env.NODE_ENV !== "production") {
    require('dotenv').load()
}

require('./app_server/auth.js').setup(app)
require('./app_server/posts.js').setup(app)
require('./app_server/profile.js').setup(app)
 
// Get the port from the environment, i.e., Heroku sets it
var port = process.env.PORT || 3000

//////////////////////////////////////////////////////
var server = app.listen(port, function() {
     console.log('Server listening at http://%s:%s', 
               server.address().address,
               server.address().port)
})
