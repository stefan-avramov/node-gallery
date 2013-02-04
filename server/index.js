var config = require('./config');
var express = require('express');
var publicPath = __dirname + '/public';
var url = require('url');
var MemoryStore  = express.session.MemoryStore;
var sessionStore = new MemoryStore();
var Repository = require('./repository');
var repo = new Repository();
var fs = require('fs');
var DataManager = require('./dataManager');
var dataManager = new DataManager(repo, publicPath);

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'secret123', store: sessionStore }))
app.use(express.static(publicPath));

app.post('/upload', function(req, res) {
	res.end();
});

app.post('/login', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	
	var user = repo.validateUser(username, password, function(err, user) {
		if (err) {
			res.json({
				error: err
			});
		} else {
			req.session.user = user;
			res.json({});
		}
	});
});

app.post('/register', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	
	repo.createUser(username, password, function(err) {
		if (err) {
			console.log('ERROR CREATING USER');
			console.dir(err);
			res.json({
				error: err
			});
		} else {
			console.log('successfully created user \'' + username + '\'');
			res.json({
				message: 'sucessfully created user'
			});
		}
	});
});

app.post('/editUserInfo', function(req, res) {
	if (req.session.user) {
		var name = req.body.name;
		var email = req.body.email;
		var password = req.body.password;
		if (!name || !email) {
			res.json({
				error: "name and email cannot be empty"
			})
		}
		repo.update(req.session.user, name, email, password, function(err, user) {
			if (err) {
				res.json({
					user: req.session.user,
					error: err
				});
			} else {
				req.session.user = user;
				res.json({
					user: req.session.user,
					message: 'successfully updated profile'
				});
			}
		});
	} else {
		res.json({});
	}
});

app.get('/upload', function(req, res) {
	if (req.session.user) {
		responseRender(res, 'fileUpload.ejs', {
			user: req.session.user
		});
	} else {
		res.redirect('/login');
	}
});

app.get('/view/:imageId', function(req, res) {
	if (req.session.user) {
		var imageId = req.params.imageId;
		repo.getImage(imageId, function(err, image) {
			if (err) {
				console.error(err);
				res.end();
			} else {
				var user = req.session.user;
				repo.getTopUserCategories(user.username, function(err, categories) {
					if (err) {
						console.error(err);
						res.end();
					} else {
						responseRender(res, 'imageView.ejs', {
							user: user,
							image: image,
							categories: categories
						});
					}
				});
			}
		});
	} else {
		res.redirect('/login');
	}
});

app.post('/logout', function(req, res) {
	req.session.destroy();
	res.redirect('/');
});

app.post('/addTopCategory', function(req, res) {
	if (req.session.user){
		var username = req.session.user.username;
		var name = req.body.name;
		repo.addTopCategory(username, name, function(err) {
			if (err) {
				res.json({error: err});
			} else {
				res.json({});
			}
		});
	} else {
		res.json({error: 'invalid session'});
	}
});

app.post('/editImage', function(req, res) {
	if (req.session.user) {
		var imageId = req.body.imageId;
		var name = req.body.name;
		var description = req.body.description;
		var category = req.body.category;

		repo.updateImage(req.session.user.username, imageId, name, description, category, function(err, image) {
			if (err) {
				res.json({
					error: err
				});
			} else {
				res.json({
					message: 'successfully updated image'
				});
			}
		});
	} else {
		res.redirect('/login');
	}
});

app.post('/changeCategory', function(req, res) {
	if (req.session.user) {
		var categoryId = req.body.categoryId;
		var path = req.body.path;
		var username = req.session.user.username;
		if (!categoryId) {
			repo.getTopUserCategories(username, function(err, categories) {
				if (err) {
					console.error(err);
					res.json({error: 'error'});
				} else {
					repo.getUserImages(username, function(err, images) {
						if (err) {
							console.error(err);
							res.json({error: 'error'});
						} else {
							res.json({
								username: username,
								images: images,
								categories: categories,
								path: []
							});
						}
					});
				}
			});
		} else {
			repo.getCategoryImages(categoryId, function(err, images) {
				if (!err) {
					repo.getChildCategories(categoryId, function(err, categories) {
						if (err) {
							console.error(err);
							res.end();
						} else {
	    					res.json({
	    						username: username,
								images: images,
								categories: categories,
								path: path
							});
						}
					});
				} else {
					res.end();
				}
			});
		}
	} else {
		res.redirect('/login');
	}
});

app.get('/profile', function(req, res) {
	if (req.session.user) {
		var username = req.session.user.username;
		var path = req.body.path;
		dataManager.getUserImages(username, function(err, images) {
			if (!err) {
				repo.getTopUserCategories(username, function(err, categories) {
					if (err) {
						console.error(err);
						res.end();
					} else {
						responseRender(res, 'index.ejs', {
							user: req.session.user,
							images: images,
							categories: categories,
							path: path
						});
					}
				});
			} else {
				res.end();
			}
		});
	} else {
		res.redirect('/login');
	}
});

app.get('/|/login', function(req, res) {
	if (req.session.user) {
		res.redirect('/profile');
	}
	else {
		res.render('login.ejs');
	}
});

function responseRender(res, view, locals) {
	res.render(view, locals);
}

app.listen(config.port);
console.log('listening ' + config.port);