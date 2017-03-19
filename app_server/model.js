var mongoose = require('mongoose');

console.log("in model,js");
var url = process.env.MONGODB_URI;
mongoose.connect(url);
mongoose.Promise = global.Promise;

function done(){
	mongoose.connection.close();
}

var imgSchema = new mongoose.Schema({
    date: Date,
    img: String,
    user: String,
    caption: String
});

var authSchema = new mongoose.Schema({
		authkey: String
});

exports.Image = mongoose.model('img', imgSchema);
exports.AuthKey = mongoose.model('auth', authSchema);
