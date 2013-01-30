/*
 * footon - simple file-system based JSON store with querying, built for packaged node-webkit applications
 * author: gordon hall <gordon@gordonwritescode.com>
 *
 * class -> Database
 * descr -> Creates a new DB or connects to an existing DB and loads collections into memory
 */

var fs = require('fs')
  , util = require('util')
  , path = require('path')
  , helpers = require('../helpers.js')
  , config = require('../footon-config.js')
  , EventEmitter = require('events').EventEmitter
  , Collection = require('./collection.js')
  , Database;

Database = function(db_name) {
	var db = this
	  , db_path = path.normalize(config.path) + '/' + db_name
	  , totalCollections = 0;

	this.name = db_name;
	this.path = db_path;
	this.collections = {};

	// determine if db already exists
	fs.exists(db_path, function(exists) {
		if (exists) {
			loadCollections(db_path, db);
		} else {
			createDatabase(db_path, loadCollections);
		}
	});

	// loads collections from path and attaches them to db
	function loadCollections(target, database) {
		// read the collections
		fs.readdir(db_path, function(err, files) {
			if (err) {
				db.emit('error', err);
			} else {
				if (files.length) {
					totalCollections = files.length;
					files.forEach(files, loadIn)
				} else {
					db.emit('ready', db);
				}
			}
		});
		// verify collection path and read in documents
		// as new Document instances, then push to array
		// and push new Collection instance to this.collections
		// emit "ready" event when done
		function loadIn(collection_path, index) {
			var new_collection = [];
			// make sure it's a file
			fs.stat(collection_path, function(err, stats) {
				if (err) {
					db.emit('error', err);
				} else {
					if (stats.isFile()) {
						// read the file
						readCollection(collection_path, function(contents) {
							parseCollection(contents);
						});
					}
				}
			});
			
			function readCollection(collection_path, callback) {
				fs.readFile(collection_path, function(err, contents) {
					if (err) {
						db.emit('error', err);
					} else {
						callback.call(this, contents)
					}
				});
			};
			
			function parseCollection(contents) {
				// try to parse as JSON
				try {
					var parsed = JSON.parse(contents);
					// make sure its an array
					if (contents intanceof Array) {
						// make sure they are all objects
						contents.forEach(contents, function(doc, index) {
							if (typeof this === 'object') {
								// add it to collection
								new_collection.push(new Document(doc));
								// on last one push Collection instance to db
								if (index === contents.length - 1) {
									var collName = path.basename(collection_path);
									db.collections[collName] = new Collection(new_collection, collName, db);
									checkReadiness();
								}
							}
						});
					}
				} catch(e) {
					checkReadiness();
				}
			};
			
			function checkReadiness() {
				// do this after loadin
				if (index === totalCollections - 1) {
					db.emit('ready', db);
				}
			};
		};
	};

	// creates a new database and fires the callback
	// passing in the path and db instance
	function createDatabase(target, callback) {
		fs.mkdir(target, function(err) {
			if (err) {
				db.emit('error', err);
			} else {
				if (callback) callback.apply([target, db]);
			}
		});
	};

};

// inherit from EventEmitter
util.inherits(Database, EventEmitter);

// set options for database
Database.prototype.config = function(collection_name) {
	
};

// return specified collection or create new collection and return it
Database.prototype.get = function(collection_name) {
	var db = this;
	// if it exists then return a new instance
	if (this.collections[collection_name]) {
		return this.collections[collection_name]
	}
	// doesn't already exists so create it
	fs.writeFile(this.path + '/' + collection_name, '[]', function(err) {
		if (err) db.emit('error', err);
	});
	return this.collections[collection_name] = new Collection([], collection_name, this);
};

// remove database and delete from disk
Database.prototype.remove = function(callback) {
	
};

module.exports = Database;
