/*
 * footon - simple file-system based JSON store with querying, built for packaged node-webkit applications
 * author: gordon hall <gordon@gordonwritescode.com>
 *
 * class -> Document
 * descr -> Creates a document instance for the specified collection
 */

var fs = require('fs')
  , util = require('util')
  , path = require('path')
  , helpers = require('../helpers.js')
  , config = require('../footon-config.js')
  , EventEmitter = require('events').EventEmitter
  , Document;
  
Document = function(object, collection) {
	
};

Document.prototype.update = function(callback) {
	
};

Document.prototype.remove = function(callback) {
	
};
