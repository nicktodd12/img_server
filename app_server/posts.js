var md5 = require('md5');
var model = require('./model.js');
var multer = require('multer');
var stream = require('stream');
var cloudinary = require('cloudinary');

exports.setup = function(app) {
	app.get('/img/:id*?', getPosts)
	app.post('/img', multer().single('image'), addImage)
}

function addImage(req, res) {
	//if there is an image
	if(req.file){
		var publicName = md5("random image name" + new Date().getTime());

		var uploadStream = cloudinary.uploader.upload_stream(function(result) {
			var post = new model.Post({
				img: result.url,
				date: new Date()
			});
			post.save(function(err, result){
				if(err) return console.error(err);
				res.json({images: [image]});
			});
		}, { public_id: publicName })

		//actually upload the image
		var s = new stream.PassThrough()
		s.end(req.file.buffer)
		s.pipe(uploadStream)
		s.on('end', uploadStream.end)
	} else {
		//we need an image
		res.sendStatus(400);
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
