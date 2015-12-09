var md5 = require('md5');
var model = require('./model.js');
var multer = require('multer')
var stream = require('stream')
var cloudinary = require('cloudinary')

exports.setup = function(app) {
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
	app.get('/picture/:user*?', getPicture)
	app.put('/picture', multer().single('image'), putPicture)
	app.put('/password', putPassword)
}

function getStatuses(req, res) {
	var users;
	if(req.params.users != undefined) {
		if(req.params.users.indexOf(",") != -1){
			users = req.params.users.split(",") 
		} else{
			users = req.params.users
		}
	}
	model.Profile.find({username :{$in : users}}).exec(function(err, p){
		var statuses = [];
		for(var i = 0; i < p.length; i++){
			statuses.push({username : p[i].username, status: p[i].status});
		}
		res.json({statuses: statuses});
	})
}

function getStatus(req, res){
	model.Profile.find({username : req.username.username}).exec(function(err, p){
		res.json({statuses: [{username: p[0].username, status: p[0].status}]})
	});
	
}

function putStatus(req, res){
	
	model.Profile.find({username : req.username.username}).exec(function(err, p){
		model.Profile.update({_id : p[0]._id}, {status : req.body["status"]}).exec(function(err, updated){
			res.json({username: updated.username, status: updated.status});
		});
	});
	
}

function getFollowing(req, res){
	var user = req.params.user;
	if(!user){
		model.Profile.find({username : req.username.username}).exec(function(err, p){
			res.json({username: p[0].username, following: p[0].following})
		});
	} else{
		model.Profile.find({username : user}).exec(function(err, p){
			res.json({username: p[0].username, following: p[0].following})
		});
	}
}

function putFollowing(req, res){
	model.Profile.find({username : req.username.username}).exec(function(err, p){
		model.Profile.find({username : req.params.user}).exec(function(err, addedUser){
			//make sure the user to add exists
			if(addedUser.length > 0){
				var following = p[0].following;
				var add = true;
				//make sure you aren't already following this user
				for(var i = 0; i < following.length; i++){
					if(following[i] == req.params.user){
						add = false;
					}
				}
				if(add){
					following.push(req.params.user);
					model.Profile.update({_id : p[0]._id}, {following : following}).exec(function(err, updated){
						res.json({username: updated.username, following: following});
					});
				} else {
					res.json({username: p[0].username, following: p[0].following});
				}
			} else {
				res.json({username: p[0].username, following: p[0].following});
			}
		});
	});
}

function deleteFollowing(req, res){
	model.Profile.find({username : req.username.username}).exec(function(err, p){
		var following = p[0].following;
		var index = following.indexOf(req.params.user);
		if(index !== -1){
			following.splice(index, 1);
		}
		model.Profile.update({_id : p[0]._id}, {following : following}).exec(function(err, updated){
			res.json({username: updated.username, following: updated.following});
		});
	});
}

function getEmail(req, res){
	var user = req.params.user;
	if(!user){
		model.Profile.find({username : req.username.username}).exec(function(err, p){
			res.json({username: p[0].username, email: p[0].email})
		});
	} else{
		model.Profile.find({username : user}).exec(function(err, p){
			res.json({username: p[0].username, email: p[0].email})
		});
	}
}

function putEmail(req, res){
	model.Profile.find({username : req.username.username}).exec(function(err, p){
		model.Profile.update({_id : p[0]._id}, {email : req.body["email"]}).exec(function(err, updated){
			res.json({username: updated.username, email: updated.email});
		});
	});
}

function getZipcode(req, res){
	var user = req.params.user;
	if(!user){
		model.Profile.find({username : req.username.username}).exec(function(err, p){
			res.json({username: p[0].username, zipcode: p[0].zipcode})
		});
	} else{
		model.Profile.find({username : user}).exec(function(err, p){
			res.json({username: p[0].username, zipcode: p[0].zipcode})
		});
	}
}

function putZipcode(req, res){
	model.Profile.find({username : req.username.username}).exec(function(err, p){
		model.Profile.update({_id : p[0]._id}, {zipcode : req.body["zipcode"]}).exec(function(err, updated){
			res.json({username: updated.username, zipcode: updated.zipcode});
		});
	});
}

function getPicture(req, res){
	var user = req.params.user;
	if(!user){
		model.Profile.find({username : req.username.username}).exec(function(err, p){
			if(p[0].picture !== ''){
				res.json({username: p[0].username, picture: p[0].picture})
			} else {
				res.json({username: p[0].username, picture: "http://i.imgur.com/sFNj4bs.jpg"})
			}
		});
	} else {
		model.Profile.find({username : user}).exec(function(err, p){
			if(p[0].picture !== ''){
				res.json({username: p[0].username, picture: p[0].picture})
			} else {
				res.json({username: p[0].username, picture: "http://i.imgur.com/sFNj4bs.jpg"})
			}
		});
	}
}

function putPassword(req, res){
	var salt = md5(new Date().getTime() + req.body.username + Math.random());
	var hash = md5(salt + req.body.password);
	model.User.update({username : req.username.username}, {salt: salt, hash: hash}).exec(function(err, p){
		if(err){
			res.json({username : req.username.username, status : "password not changed"});
		}
		res.json({username: req.username.username, status: "password updated"});
	});
}

function putPicture(req, res) {
	var publicName = req.body.title

	var uploadStream = cloudinary.uploader.upload_stream(function(result) {    	
		//set the user's new picture
		model.Profile.update({username : req.username.username}, {picture: result.url}).exec(function(err, p){
			res.json({username: req.username.username, picture: result.url});
		});
	}, { public_id: publicName })	

	//actually upload the image
	var s = new stream.PassThrough()
	s.end(req.file.buffer)
	s.pipe(uploadStream)
	s.on('end', uploadStream.end)

}