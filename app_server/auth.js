var md5 = require('md5');
var _posts = require('./samplePosts.json');
var model = require('./model.js');

var cookieKey = 'sid'
var _sessionUser = {}

exports.setup = function(app) {
	
	//only three endpoints don't use the authentication middleware
	app.get('/sample', getSamplePosts)
	app.post('/login', login)
	app.post('/register', register)
	
	//need to be authenticated for any endpoints added after this
	app.use(isLoggedIn)
	app.put('/logout', logout)
}

function isLoggedIn(req, res, next){
	var sid = req.cookies[cookieKey]
	
	//unauthorized
	if(!sid){
		return res.sendStatus(401)
	}
	
	var username = _sessionUser[sid]
	if(username){
		req.username = username
		next()
	} else {
		res.sendStatus(401)
	}
}

function login(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	if(!username || !password) {
		res.sendStatus(400)
		return
	}
	
	model.User.find({username: username}).exec(function(err, users) {
		var userObj = users[0];
		if(!userObj || userObj.hash !== md5(userObj.salt + password)){
			res.sendStatus(401)
			return
		}
		var sessionKey = md5("a secret message" + new Date().getTime() + userObj.username)
		_sessionUser[sessionKey] = userObj
		res.cookie(cookieKey, sessionKey,
			{maxAge: 3600 * 1000, httpOnly: true})
			
		var msg = {username: username, result: 'success'}
		res.send(msg)
	})
}

function logout(req, res){
	var sid = req.cookies[cookieKey];
	delete _sessionUser[sid];
	delete req.cookies[cookieKey];
	
	res.sendStatus(200);
}

function register(req, res){
	var salt = md5(new Date().getTime() + req.body.username + Math.random())
	var md5val = md5(salt + req.body.password)
	
	var newUser = new model.User({username : req.body.username, salt : salt, hash : md5val});
	newUser.save(function(err, newUser){
		if(err){
			return console.error(err);
		}
	});
	
	var newProf = new model.Profile({
		username : req.body.username,
		status : 'New to JDNet!',
		following : [],
		email : req.body.email,
		zipcode : req.body.zipcode,
		picture : ''
	})
	newProf.save(function(err, newProf){
		if(err) return console.error(err);
		res.sendStatus(200)
	});
}

//Included in this file so that I could keep all requests that don't require authorization in one place
function getSamplePosts(req, res){
	res.json({posts : _posts});
}