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

  	users.findAndModify({
			query: {
				username : user.username
			},
			update: {
				username: user.username,
				password: password ? password : user.password,
				name: name,
				email: email
			}
		}, 
		function(err, data) {
			if (err) {
				callback(err);	
			} else {
				repo.findUser(data.username, function(err, user) {
					callback(err, user);
				});
			}
		}
	);
  }
  
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
