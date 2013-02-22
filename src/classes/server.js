/*
 * footon - simple file-system based JSON store with querying, built for packaged node-webkit applications
 * author: gordon hall <gordon@gordonwritescode.com>
 *
 * class -> Server
 * descr -> Creates a net.Server that passes data to remote footon.Connection
 */

var restify = require('restify')
  , util = require('util')
  , path = require('path')
  , clc = require('cli-color')
  , EventEmitter = require('events').EventEmitter
  , qs = require('querystring')
  , config = require('../config.js')
  , Database = require('./database.js')
  , Server;

Server = function(dbName, onReady) {
	var server = this;
 	// create server
	server.server = restify.createServer({
		name: 'Footon',
	});
	// remember what to do on ready
	server.onReady = onReady;

	// get database
	server.db = new Database(dbName);
	server.db.on('ready', function() {
		// initialize routing
		server.bindRoutes();
	});
};

util.inherits(Server, EventEmitter);

Server.prototype.listen = function(port) {
	var server = this;
	// go ahead and listen
	server.server.listen(port || config.net.port, function() {
		if (server.onReady) server.onReady.call(this, server.server);
		server.emit('ready', server);
	});
};

Server.prototype.bindRoutes = function() {
	var svc = this.server
	  , db = this.db;

	// for now we will just expose a json api
	// for querying only - jsonp also
	svc.get('/:collection', function(req, res) {

		var collName = req.params.collection
		  , query = JSON.parse(qs.parse(req.query()).query)
		  , jsonpCallback = qs.parse(req.query()).callback
		
		console.log('');
		console.log(
			clc.bold.cyan('Footon: '), 
			clc.white('received query request'), 
			'\n',
			clc.bold.whiteBright('* Collection: '),
			clc.white(collName),
			'\n',
			clc.bold.whiteBright('* Query: '), 
			clc.white(JSON.stringify(query))
		);

	  	var coll = db.get(collName)
	  	  , results = JSON.stringify(coll.find(query))
	  	  , response = (jsonpCallback) ? jsonpCallback + '(' + results + ')' : results;
	  	res.end(response);
	  	console.log(
			clc.bold.cyan('Footon: '), 
			clc.white('responded with ' + JSON.parse(results).length + ' matched documents')
		);
	});
};

module.exports = Server;