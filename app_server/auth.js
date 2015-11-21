var md5 = require('md5')
var _posts = require('./samplePosts.json');

exports.setup = function(app) {
	//only three endpoints don't use the authentication middleware
	app.get('/sample', getSamplePosts)
	app.post('/login', login)
	app.post('/register', register)
	
	//need to be authenticated for any endpoints added after this
	app.use(isLoggedIn)
	app.put('/logout', logout)
}

var cookieKey = 'sid'
var _sessionUser = {}

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
	//this is giving me trouble, trying all day and it won't work
	var userObj = getUser(username)
	if(!userObj || userObj.md5 !== md5(userObj.salt + password)){
		res.sendStatus(401)
		return
	}
	var sessionKey = md5("a secret message" + new Date().getTime() + userObj.username)
	_sessionUser[sessionKey] = userObj
	res.cookie(cookieKey, sessionKey,
		{maxAge: 3600 * 1000, httpOnly: true})
		
	var msg = {username: username, result: 'success'}
	res.send(msg)
}

function logout(req, res){
	var sid = req.cookies[cookieKey];
	
	delete _sessionUser[sid];
	delete req.cookies[cookieKey];
	
	res.sendStatus(200);
	
}

function register(req, res){
	var salt = md5(new Date().getTime() + req.body["username"]+ Math.random())
	var md5val = md5(salt + req.body["password"])
	
	_users.push({username : req.body["username"], salt : salt, md5 : md5val})
	res.sendStatus(200)
}

function getUser(user){
	for(var i in _users){
		if(_users[i]["username"] == user)
			return _users[i]
	}
	return null
}

//Included in this file so that I could keep all requests that don't require authorization in one place
function getSamplePosts(req, res){
	res.json({posts : _posts});
}

var _users = [
	{username : "jvp1test", salt : "8b1d8a8ad38abc6b107822dcb353713e", md5 : "fc28da32cbc879c9ffb8e7c3a88a9c2c"},
	{username : "rice", salt : "30c37755b913024ca6ba1e7b125df9a4", md5 : "e1292141eacd07a04a679528a3d21945"},
	{username : "jvp1", salt : "fa47c3b3c0f3ac95c8a49a341bcfe460", md5 : "79c81ce1ef5014514f205e338ab763c8"}
]