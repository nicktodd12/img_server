//I will remove everything in this file later as I actually implement them

exports.setup = function(app) {
	app.put('/posts/:id*?', putPosts)
	app.get('/statuses/:users*?', getStatuses)
	app.get('/status', getStatus)
	app.put('/status', putStatus)
	app.get('/following/:user*?', getFollowing)
	app.put('/following/:user*?', putFollowing)
	app.delete('/following/:user*?', deleteFollowing)
	app.get('/email/:user*?', getEmail)
	app.put('/email', putEmail)
	app.get('/zipcode/:user*?', getZipcode)
	app.put('/zipcode', putZipcode)
	app.get('/locations/:user*?', getLocations)
	app.put('/locations', putLocations)
	app.get('/picture/:user*?', getPicture)
	app.put('/password', putPassword)
	
}

function putPosts(req, res){
	res.json({});
}

function getStatuses(req, res) {
	var response = {};
	response["statuses"] = [{username: "jvp1", status: "becoming a web dev"}, {username: "derp", status:"just derpin"}]
	res.json(response)
}

function getStatus(req, res){
	var response = {};
	response["statuses"] = [{username: "jvp1test", status: "Happy"}]
	res.json(response)
}

function putStatus(req, res){
	res.json({username: "jvp1test", status: req.body["status"]})
}

function getFollowing(req, res){
	res.json({username: "jvp1test", following: ["jvp1", "derp"]})
}

function putFollowing(req, res){
	res.json({username: "jvp1test", following: ["jvp1", "derp"]})
}

function deleteFollowing(req, res){
	res.json({username: "jvp1test", following: ["jvp1", "derp"]})
}

function getEmail(req, res){
	res.json({username: "jvp1test", email: "jvp1test@rice.edu"})
}

function putEmail(req, res){
	res.json({username: "jvp1test", email: "jvp1test@rice.edu"})
}

function getZipcode(req, res){
	res.json({username: "jvp1test", zipcode: 77005})
}

function putZipcode(req, res){
	res.json({username: "jvp1test", zipcode: 77005})
}

function getLocations(req, res){
	res.json({username: "jvp1test", location: {lat : 50, lng : 50}})
}

function putLocations(req, res){
	res.json({username: "jvp1test", location: {lat : 50, lng : 50}})
}

function getPicture(req, res){
	res.json({username: "jvp1test", picture: "http://i.imgur.com/sFNj4bs.jpg"})
}

function putPassword(req, res){
	res.json({username: "jvp1test", status: "will not change"})
}