var mongoose = require('mongoose');
var url = process.env.MONGOLAB_URI;
mongoose.connect(url);
function done(){
	mongoose.connection.close();
}

var imgSchema = new mongoose.Schema({
    date: Date,
    img: String
});

exports.Image = mongoose.model('img', imgSchema);
