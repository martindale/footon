/*
 * footon - simple file-system based JSON store with querying, built for packaged node-webkit applications
 * author: gordon hall <gordon@gordonwritescode.com>
 */

var Server = require('./classes/server.js')
  , Connection = require('./classes/connection.js')
  , Database = require('./classes/database.js');

// expose function to return new instance of "Database" class
// this is for local databases
module.exports = function(db_name) {
	return new Database(db_name);
};

module.exports.createServer = function() {
	return new Server();
};

module.exports.createConnection = function() {
	return new Connection();
};
