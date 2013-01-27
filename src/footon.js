/*
 * footon - simple file-system based JSON store with querying, built for packaged node-webkit applications
 * author: gordon hall <gordon@gordonwritescode.com>
 */

// expose function to return new instance of "Database" class
module.exports = function(db_name) {
	return new require('./classes/database.js')(db_name);
};