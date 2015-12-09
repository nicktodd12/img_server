var mongoose = require('mongoose');
var url = process.env.MONGO_URL;
console.log("MONGO URL ",url)
mongoose.connect(url);
function done(){
	mongoose.connection.close();
}

var userSchema = new mongoose.Schema({
	username: String,
    salt: String,
    hash: String  
});

var profileSchema = new mongoose.Schema({
	username: String,
    status: String,
    following: [ String ],
    email: String,
    zipcode: Number,
    picture: String,
	twitterId : String
})

var postSchema = new mongoose.Schema({
	author: String,
    body: String,
    date: Date,
    img: String, 
    comments: [{
        commentId: String,
        author: String,
        body: String,
        date: Date
    }]
})

exports.User = mongoose.model('users', userSchema);
exports.Profile = mongoose.model('profles', profileSchema);
exports.Post = mongoose.model('posts', postSchema);