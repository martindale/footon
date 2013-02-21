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

Server = function(onReady) {
 	// create server
	this.server = restify.createServer({
		name: 'Footon',
	});
	// remember what to do on ready
	this.onReady = onReady;
	// initialize routing
	this.bindRoutes();
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
	var svc = this.server;

	// for now we will just expose a json api
	// for querying only - jsonp also
	svc.get('/:database/:collection', function(req, res) {

		var dbName = req.params.database
		  , collName = req.params.collection
		  , query = JSON.parse(qs.parse(req.query()).query)
		  , jsonpCallback = qs.parse(req.query()).callback
		
		console.log('');
		console.log(
			clc.bold.cyan('Footon: '), 
			clc.white('received query request'), 
			'\n',
			clc.bold.whiteBright('* Database: '),
			clc.white(dbName), 
			'\n',
			clc.bold.whiteBright('* Collection: '),
			clc.white(collName),
			'\n',
			clc.bold.whiteBright('* Query: '), 
			clc.white(JSON.stringify(query))
		);

		  // get database
		  var db = new Database(dbName);

		  db.on('ready', function() {
		  	var coll = db.get(collName)
		  	  , results = JSON.stringify(coll.find(query))
		  	  , response = (jsonpCallback) ? jsonpCallback + '(' + results + ')' : results;
		  	res.end(response);
		  	console.log(
				clc.bold.cyan('Footon: '), 
				clc.white('responded with ' + JSON.parse(results).length + ' matched documents')
			);
		  });
	});
};

module.exports = Server;