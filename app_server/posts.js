var md5 = require('md5');
var model = require('./model.js');
var multer = require('multer');
var stream = require('stream');
var cloudinary = require('cloudinary');

exports.setup = function(app) {
	app.get('/img/:id*?', getImages)
	app.post('/img', multer().single('image'), addImage)
}

function addImage(req, res) {
	//if there is an image
	if(req.file){
		var publicName = md5("random image name" + new Date().getTime());
		var image = new model.Image({
			date: new Date()
		});
		var uploadStream = cloudinary.uploader.upload_stream(function(result) {

			imgage.img = result.url;
			image.save(function(err, result){
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
	console.log("request was ", req);
}

function getImages(req, res) {
	var id = req.params.id
	if (!id) {
			model.Image.find({ $query: {}, $orderby: { date : -1 }})
			.limit(10).exec(function(err, returnedImages){
				res.json({images : returnedImages})
			});
	} else {
		model.Post.find({_id : id}).exec(function(err, image) {
			res.json({images : [image]})
		});
	}
}
