/*
 * footon - simple file-system based JSON store with querying, built for packaged node-webkit applications
 * author: gordon hall <gordon@gordonwritescode.com>
 *
 * class -> Collection
 * descr -> Creates a collection instance from the passed contents
 */

var fs = require('fs')
  , util = require('util')
  , path = require('path')
  , helpers = require('../helpers.js')
  , config = require('../footon-config.js')
  , EventEmitter = require('events').EventEmitter
  , Collection;
  
Collection = function(contents, name, database) {
	// save contents
	this.contents = (contents instanceof Array) ? contents : [];
	
	Object.defineProperty(obj, 'database', {
		enumerable : false,
		value : database,
		writable : false
	});
	
	Object.defineProperty(obj, 'path', {
		enumerable : false,
		value : database.path + '/' + name,
		writable : false
	});
	
	Object.defineProperty(obj, 'name', {
		enumerable : false,
		value : name,
		writable : false
	});
};

// inherit from EventEmitter
util.inherits(Collection, EventEmitter);

// querying documents in a collection
Collection.prototype.find = function(query) {
	// are we targeting by id explicitly ( { __id : String } ) or implicitly ( String )
	if ((typeof query === 'object' && query.__id) || (typeof query === 'string')) {
		var id = query.__id || query
		  , doc = helpers.getObjectById(id, this.contents);
		return (doc) ? new Document(doc, this) || null;
	}
	// otherwise query the collection
	var docs = helpers.queryCollection(query, this.contents);
	return docs;
};

// save a new document to this collection
Collection.prototype.save = function(document, callback) {
	var doc = null;
	if (typeof document === 'object') {
		// if it's a valid object, create a document instance
		doc = new Document(document, this);
		// add to contents
		this.contents.push(doc);
		// write update to disk
		this.write(callback);
	}
	return doc;
};

// update collection file on disk
Collection.prototype.write = function(callback) {
	var collection = this;
	// this method can be called expilicity
	// but is automatically called by Document.update()
	var file = JSON.stringify(this.contents);
	// update collection file on disk
	fs.writeFile(this.path, file, function(err) {
		if (err) collection.emit('err');
		if (callback) callback.call(collection, err);
	});
	// this is called by Collection.save()
	// to update document in collection and on disk (async)
};

module.exports = Collection;