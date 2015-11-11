var initialPosts = [{'author':'JD', 'body':'woooooo', 'id':0}, {'author':'JD', 'body':'hello', 'id':1}, {'author':'JD', 'body':'these are the initial posts', 'id':2}];
var author = "JD";
var id = 3;

exports.setup = function(app) {
	app.get('/posts/:id*?', getPosts)
	app.post('/post', addPost)
}

function addPost(req, res) {
    console.log('Payload received', req.body)
	req.body['id'] = id
	req.body['author'] = author
	req.body['date'] = new Date()
	req.body['comments'] = []
	id++
	initialPosts.push(req.body)
    res.send(req.body)
}

function getPosts(req, res) {
	
	var id = req.params.id
	if (!id) {
		res.json(initialPosts)
	} else {
		res.json(initialPosts[id]);
	}
} 