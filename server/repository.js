var Mongolian = require("mongolian");

// Create a server instance with default host and port
var server = new Mongolian();

// Get database
var db = server.db("db");

module.exports = function () {
	var repo = this;
	
	this.validateUser = function (username, password, callback) {
		var users = db.collection('users');
		users.findOne({ username: username, password: password }, function(err, user) {
			if (err) {
				callback(err);
			} else if (!user) {
				callback('wrong username or password')
			} else {
				callback(null, user);
			}
		});
	};

	this.findUser = function(username, callback) {
		var users = db.collection('users');
		users.findOne({ username: username }, function(err, user) {
			if (err) {
				callback(err);
			} else {
				callback(null, user);
			}
		});
	}

	this.update = function(user, name, email, password, callback) {
		var users = db.collection('users');
		var repo = this;

		var newUser = {
				username: user.username,
				password: password ? password : user.password,
				name: name,
				email: email
			};

		users.findAndModify({
			query: {
				username : user.username
			},
			update: newUser
		}, 
		function(err, data) {
			if (err) {
				callback(err);	
			} else {
				callback(null, newUser);
			}
		});
	};

	this.updateImage = function(imageId, name, description, callback) {
		var images = db.collection('images');
		var repo = this;

		var newImage = {
				imageId: imageId,
				name: name,
				description: description
			};
		images.findAndModify({
			query: {
				imageId : imageId
			},
			update: newImage
		}, 
		function(err, data) {
			if (err) {
				callback(err);	
			} else {
				callback(null, newImage);
			}
		});
	};

	this.initImage = function(username, imageId, callback) {
		var images = db.collection('images');
		images.findOne({ imageId: imageId }, function(err, _image) {
			var image = _image;
			if (err) {
				console.error(err);
				callback(err);
			} else if (!image) {
				image = {
					imageId: imageId,
					name: imageId,
					description: ""
				};
				images.insert(image);
			}
			callback(null, image);
		});
	};


	this.getImage = function (imageId, callback) {
		var images = db.collection('images');
		images.findOne({ imageId: imageId }, function(err, _image) {
			var image = _image;
			if (err) {
				console.error(err);
				callback(err);
			} else if (!image) {
				console.log('image doesn\'t exist');
				callback('error');
			} else {
				callback(null, image);
			}
		});
	};
	
	this.createUser = function(username, password, callback) {
		var users = db.collection('users');
		
		if (username == '' || password == '') {
			callback('username and password cannot be empty');
			return;
		};

		users.findOne({ username: username }, function(err, user) {
			if (err) {
				callback(err);
			}
			else if (user) {
				callback('create new user failed: username exists');
			}
			else {
				users.insert({
					username: username,
					password: password,
					name: 'n/a',
					email: 'n/a'
				});
				
				callback(null);
			}
		});
	}
}
