var md5 = require('md5');
var model = require('./model.js');
var multer = require('multer');
var stream = require('stream');
var cloudinary = require('cloudinary');
	
exports.setup = function(app) {
	app.get('/posts/:id*?', getPosts)
	app.post('/post', multer().single('image'), addPost)
	app.put('/posts/:id*?', putPosts)
}

function addPost(req, res) {
	var post = new model.Post({
		author: req.username.username,
		body: req.body.body,
		date: new Date(),
		comments: []
	});
	
	//if there is an image
	if(req.file){
		var publicName = req.body.title

		var uploadStream = cloudinary.uploader.upload_stream(function(result) {    	
			post.img = result.url;
			post.save(function(err, result){
				if(err) return console.error(err);
				res.json({posts: [post]});
			});
		}, { public_id: publicName })	

		//actually upload the image
		var s = new stream.PassThrough()
		s.end(req.file.buffer)
		s.pipe(uploadStream)
		s.on('end', uploadStream.end)
	} else {
		//otherwise just post without an image
		post.save(function(err, result){
			if(err) return console.error(err);
			res.json({posts : [post]});
		});
	}
}

function getPosts(req, res) {
	var id = req.params.id
	if (!id) {
		model.Profile.find({username : req.username.username}).exec(function(err, profiles){
			var following = profiles[0].following;
			following.push(req.username.username);
			model.Post.find({ $query: {author : {$in : following}}, $orderby: { date : -1 } })
			.limit(10).exec(function(err, posts){
				res.json({posts : posts})
			});
		});
	} else {
		model.Post.find({_id : id}).exec(function(err, posts) {
			res.json({posts : posts})
		});
	}
}

function putPosts(req, res) {
	var id = req.params.id;
	var cid = req.body.commentId;
	var body = req.body.body;
	
	model.Post.find({_id : id}).exec(function(err, post){
		
		//if we are updating the body of a post
		if(!cid){
			model.Post.update({_id : post[0]._id}, {body : body}).exec(function(err, p){
				model.Post.find({_id : id}).exec(function(err, posts){
					res.json({posts: posts})
				});
			});
		} else {
			var comments = post[0].comments;
			//if we are adding a comment
			if(cid == -1){
				comments.push({
					commentId : md5(new Date().getTime() + req.username.username),
					author : req.username.username,
					body : body,
					date : new Date()
				});
				model.Post.update({_id : post[0]._id}, {comments : comments}).exec(function(err, p){
					model.Post.find({_id : id}).exec(function(err, posts){
						res.json({posts: posts})
					});
				});
			} else {
				//if we are updating a comment
				for(var i = 0; i < comments.length; i++){
					if(comments[i].commentId == cid){
						comments[i].body = body;
					}
				}
				model.Post.update({_id : post[0]._id}, {comments : comments}).exec(function(err, p){
					model.Post.find({_id : id}).exec(function(err, posts){
						res.json({posts: posts})
					});
				});
			}
		}
	});
}