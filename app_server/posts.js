var _posts = require('./posts.json');
var author = "jvp1test";
var id = 18;
	
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
	_posts.unshift(req.body)
    res.send(req.body)
}

function getPosts(req, res) {
	var id = req.params.id
	if (!id) {
		res.json({posts : _posts})
	} else {
		res.json({posts: findPostById(id)});
	}
} 

function findPostById(id){
	for(var i = 0; i < _posts.length; i++){
		if(_posts[i]['id'] == id)
			return [_posts[i]];
	}
	return _posts
}