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

exports.Image = mongoose.model('img', imgSchema);
