var fs = require('fs');

module.exports = function (_repo, _publicPath) {
	var repo = _repo;
	var publicPath = _publicPath;
 
	this.getUserImages = function (username, callback) {
		var filesDir = publicPath + '/files/' + username;
		var images = [];
		fs.mkdir(filesDir, function(e) {
			if(!e || (e && e.code === 'EEXIST')) {
				fs.readdir(filesDir, function (err, list) {
		            if (err) {
		            	console.error(err);
		            	callback(err);
		            } else {
		            	var left = list.length;
		            	if (left == 0) callback(null, images);
		            	else list.forEach(function (name) {
			            	repo.initImage(username, name, function (err, image) {
			            		if (!err) {
			            			images.push(image);		
			            		}
			            		left--;
			            		if (left == 0) {
			            			callback(null, images);			
			            		}
			            	});
			            });
					}
	    		});
			} else {
				console.error(err);
				callback(err);
			}
  		});
	};
}
