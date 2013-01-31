/*
 * footon - simple file-system based JSON store with querying, built for packaged node-webkit applications
 * author: gordon hall <gordon@gordonwritescode.com>
 * 
 * helper functions
 */

var crypto = require('crypto')
  , fs = require('fs');

// helpers
module.exports.createId = function() {
	var current_date = (new Date()).valueOf().toString()
	  , random = Math.random().toString();
	return crypto.createHash('sha1').update(current_date + random).digest('hex');
};

// borrowed from https://gist.github.com/807712
module.exports.removeDirForce = function(dirPath, onErr) {
	fs.readdir(dirPath, function(err, files) {
		if (err) {
			onErr(err);
		} else {
			if (files.length === 0) {
				fs.rmdir(dirPath, function(err) {
					if (err) {
						onErr(err);
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
							onErr(err);
						} else {
							if (stats.isFile()) {
								fs.unlink(filePath, function(err) {
									if (err) {
										onErr(err);
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

// finds the first object in an array whose __id property matches
module.exports.getObjectById = function(id, arr) {
	for (var obj = 0; obj < arr.length; obj++) {
		var current = arr[obj];
		if (current.__id === id) {
			return current;
		}
	}
	return null;
};

// uses the passed object to select matching items in the specified collection
// and return them in an array
module.exports.queryCollection = function(obj, collection_contents) {
	
	var results = [], numParams;
	
	function query(obj) {
		if (typeof obj === 'object') {
			// keep track of number of query params
			numParams = Object.keys(obj).length
			var documents = collection_contents;
			
			// otherwise let's start matching up objects
			for (var doc = 0; doc < documents.length; doc++) {
				var current = documents[doc]
				  , matchesQuery = false;
				  
				// iterate over query properties
				for (var prop in obj) {
					// check if current has a corresponding property and matches query
					matchesQuery = (current[prop] && current[prop] === obj[prop]);
				}
				
				if (matchesQuery) {
					results.push(current);
				}
			}
		}
	};
	
	// if multiple queries
	if (obj instanceof Array) {
		obj.forEach(function(val) {
			query(val);
		});
	} else {
		// if just one
		query(obj);
	}
	
	// if no params just return everything
	if (numParams === 0) {
		return collection_contents;
	}
	
	return results;
};

// takes an array of objects and converts them into Document instances for the specified collection
module.exports.convertToDocuments = function(obj_array, collection) {
	var converted = [];
	for (var obj = 0; obj < obj_array.length; obj++) {
		converted.push(new Document(obj_array[obj], collection));
	}
	return converted;
};
