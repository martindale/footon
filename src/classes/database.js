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
  , config = require('../config.js')
  , EventEmitter = require('events').EventEmitter
  , Collection = require('./collection.js')
  , Database;

Database = function(db_name) {
	var db = this
	  , db_path = path.normalize(config.path) + '/' + db_name;

	this.name = db_name;
	this.path = db_path;
	this.collections = {};

	db.load();
};

// inherit from EventEmitter
util.inherits(Database, EventEmitter);

// load local database into memory
Database.prototype.load = function() {
	var totalCollections = 0
	  , db_path = this.path
	  , db = this;
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
					files.forEach(loadIn)
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
			collection_path = db_path + '/' + collection_path;
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
			//	try {
					var parsed = JSON.parse(contents);
					// make sure its an array
					if (parsed instanceof Array) {
						var name = path.basename(collection_path);
						db.collections[name] = new Collection(parsed, name, db);
						checkReadiness();
					}
			//	} catch(e) {
			//		checkReadiness();
			//	}
			};
			
			function checkReadiness() {
				// do this after loadin
				if (index === totalCollections - 1 || totalCollections === 0) {
					db.emit('ready', db);
				}
			};
		};
	};

	// creates a new database and fires the callback
	// passing in the path and db instance
	function createDatabase(target, callback) {
		// first make sure path is valid
		fs.exists(config.path, function(exists) {
			if (exists) {
				make(target);
			} else {
				setup(make);
			}
		});
		
		function make(target) {
			fs.mkdir(target, function(err) {
				if (err) {
					db.emit('error', err);
				} else {
					if (callback) callback.apply([target, db]);
				}
			});
		};
		
		function setup(fn) {
			fs.mkdir(config.path, function(err) {
				if (err) {
					db.emit('error', err);
				} else {
					if (fn) fn(target);
				}
			});
		};
	};
};

// return specified collection or create new collection and return it
Database.prototype.get = function(collection_name) {
	var db = this;
	// if it exists then return a new instance
	if (this.collections[collection_name]) {
		return this.collections[collection_name]
	}
	return this.collections[collection_name] = new Collection([], collection_name, this);
};

// remove database and delete from disk
Database.prototype.reset = function() {
	var db = this;
	helpers.removeDirForce(this.path + '/', function(err) {
		db.emit('error', err);
	});
};

module.exports = Database;
