/*
 * footon - simple file-system based JSON store with querying, built for packaged node-webkit applications
 * author: gordon hall <gordon@gordonwritescode.com>
 * 
 * helper functions
 */

// helpers
module.exports.createId = function() {
	var current_date = (new Date()).valueOf().toString()
	  , random = Math.random().toString();
	return crypto.createHash('sha1').update(current_date + random).digest('hex');
};

// borrowed from https://gist.github.com/807712
module.exports.removeDirForce = function(dirPath) {
	fs.readdir(dirPath, function(err, files) {
		if (err) {
			console.log(JSON.stringify(err));
		} else {
			if (files.length === 0) {
				fs.rmdir(dirPath, function(err) {
					if (err) {
						console.log(JSON.stringify(err));
					} else {
						var parentPath = path.normalize(dirPath + '/..') + '/';
						if (parentPath != path.normalize(rootPath)) {
							removeDirForce(parentPath);
						}
					}
				});
			} else {
				files.forEach(function(file) {
					var filePath = dirPath + file;
					fs.stat(filePath, function(err, stats) {
						if (err) {
							console.log(JSON.stringify(err));
						} else {
							if (stats.isFile()) {
								fs.unlink(filePath, function(err) {
									if (err) {
										console.log(JSON.stringify(err));
									}
								});
							}
							if (stats.isDirectory()) {
								removeDirForce(filePath + '/');
							}
						}
					});
				});
			}
		}
	});
};