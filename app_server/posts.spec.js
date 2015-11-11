/*
 * Test suite for posts.js
 */
var request = require('request')
var post = require('./posts.js')

function url(path) {
	return "http://localhost:3000" + path
}

describe('Validate Post Functionality', function() {

	it('should give me three or more posts', function(done) {		
		request(url("/posts"), function(err, res, body) {
			expect(res.statusCode).toBe(200);
			expect(body.length >= 3).toBeTruthy();
			done()
		})
 	}, 200)

	it('should add two posts with successive post ids, and return the post each time', function(done) {
		
		var currentID;
		
		request.post(url("/post"), {json:{'body':'woooooo'}}, function(err, res, body){
			expect(body['author']).toEqual('JD');
			expect(body['body']).toEqual('woooooo');
			currentID = body["id"];
			
			request.post(url("/post"), {json:{'body':'YEYAYAY'}}, function(err, res, body){
				expect(body['author']).toEqual('JD');
				expect(body['body']).toEqual('YEYAYAY');
				expect(body['id']).toEqual(currentID + 1); 
				
				done()
			});
		})
 	}, 200)

	it('should return a post with a specified id', function(done) {
		var post;
		var id;
		request(url("/posts"), function(err, res, body) {
			var b = JSON.parse(body);
			post = b[0];
			id = post["id"];
			
			request(url("/posts/"+id), function(err, res, body) {
				//checks both whether the correct post is return and if there is only one returned post
				expect(post).toEqual(JSON.parse(body));
				done()
			})
		})
		
	}, 200)

	it('should return nothing for an invalid id', function(done) {
		request(url("/posts/-1"), function(err, res, body) {
				expect("").toEqual(body);
				done()
		})
	}, 200)


});