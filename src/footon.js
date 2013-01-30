/*
 * footon - simple file-system based JSON store with querying, built for packaged node-webkit applications
 * author: gordon hall <gordon@gordonwritescode.com>
 */

var fServer = require('./footon-server.js');

// expose function to return new instance of "Database" class
// this is for local databases
module.exports = function(db_name) {
	return new require('./classes/database.js')(db_name);
};

module.exports.listen = fServer.listen;
module.exports.connect = fServer.connect;
