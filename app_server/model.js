var mongoose = require('mongoose');

console.log("in model,js");
var url = process.env.MONGODB_URI;
mongoose.connect(url);
function done(){
	mongoose.connection.close();
}

var imgSchema = new mongoose.Schema({
    date: Date,
    img: String
});

var authSchema = new mongoose.Schema({
		key: String
});

exports.Image = mongoose.model('img', imgSchema);
exports.AuthKey = mongoose.model('auth', authSchema);
