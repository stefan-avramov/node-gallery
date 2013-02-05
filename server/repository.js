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

	this.deleteImage = function(fileId, callback) {
		var images = db.collection('images');
		images.remove({imageId: fileId}, function(err) {
			callback(err);
		});
	};

	this.updateImage = function(username, imageId, name, description, category, callback) {
		var images = db.collection('images');
		var categories = db.collection('categories');
		var repo = this;

		var newImage = {
				imageId: imageId,
				name: name,
				description: description
			};

		var finish = function() {
			images.findAndModify({
				query: {
					imageId : imageId
				},
				update: {$set: newImage}
			}, 
			function(err, data) {
				if (err) {
					callback(err);	
				} else {
					callback(null, data);
				}
			});
		}

		if (category == "") {
			categories.findOne({name: username, parent: -1}, function(err, userCategory) {
				if (err || !userCategory) {
					if (err) {
						console.dir(err);
						callback(err);
					} else {
						console.error('no such category: ' + username + "(-1)");
						callback('error');
					}
				} else {
					newImage.category = userCategory._id.toString();
					finish();
				}
			});
		} else {
			if (category) {
				newImage.category = category;
			}
			finish();
		}
	};

	this.initImage = function(username, imageId, callback) {
		var images = db.collection('images');
		images.findOne({ imageId: imageId }, function(err, _image) {
			var image = _image;
			if (err) {
				console.error(err);
				callback(err);
			} else if (!image) {
				var categories = db.collection('categories');
				categories.findOne({ name: username, parent: -1}, function(err, category) {
					if (err || !category) {
						if (err) {
							console.err(err);
							callback(err);
						} else {
							console.log("category " + category + " (-1) does not exist!");
							callback("error");
						}
					} else {
						image = {
							imageId: imageId,
							username: username,
							name: imageId,
							description: "",
							category: category._id 
						};
						images.insert(image);
						callback(null, image);
					}
				});
			} else {
				callback(null, image);
			}
		});
	};

	this.addTopCategory = function(username, name, callback) {
		var categories = db.collection('categories');
		categories.findOne({name: username, parent: -1}, function(err, userCategory) {
			if (err || !userCategory) {
				if (err) {
					console.dir(err);
					callback(err);
				} else {
					console.error('no such category: ' + username + "(-1)");
					callback('error');
				}
			} else {
				categories.findOne({name: name, parent: userCategory._id.toString()}, function(err, category) {
					if (err) {
						callback(err);
					} else {
						if (!category) {
							categories.insert({
								name: name,
								parent: userCategory._id.toString()
							});
						}
						callback(null);
					} 
				});
			}
		});
	};

	this.getUserImages = function (username, callback) {
		var images = db.collection('images');
		var result = [];

		images.find().forEach(
			function (image) {
				if (image.username == username) {
					result.push(image);
				}
			},
			function(err) {
		    	if (err) {
		    		console.error(err);
		    	}
		    	callback(err, result);
			}
		);
	};

	this.getCategoryImages = function(categoryId, callback) {
		var images = db.collection('images');
		var result = [];
		images.find().forEach(
			function (image) {
				if (image.category == categoryId) {
					result.push(image);
				}
			},
			function(err) {
		    	if (err) {
		    		console.error(err);
		    	}
		    	callback(err, result);
			}
		);
	};

	this.getChildCategories = function(categoryId, callback) {
		var categories = db.collection('categories');
		
		var result = [];
		categories.find().forEach(
			function (category) {
				if (category.parent == categoryId) {
					result.push({id: categoryId, name: category.name});
				}
			},
			function(err) {
		    	if (err) {
		    		console.error(err);
		    	}
		    	callback(err, result);
			}
		);
	};

	this.getTopUserCategories = function(username, callback) {
		var categories = db.collection('categories');
		
		categories.findOne({name: username, parent: -1}, function(err, userCategory) {
			if (err || !userCategory) {
				if (err) {
					console.error(err);
				} else {
					console.error("no category for user: " + username);
				}
				callback('error');
			} else {
				var result = [];
				categories.find().forEach(
					function (category) {
						if (category.parent == userCategory._id.toString()) {
							result.push({id: category._id.toString(), name: category.name});
						}
					},
					function(err) {
				    	if (err) {
				    		console.error(err);
				    	}
				    	callback(err, result);
					}
				);
			}
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
				
				var categories = db.collection('categories');
				categories.insert({
					name: username,
					parent: -1
				});
				
				callback(null);
			}
		});
	}
}
