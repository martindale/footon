/*
 * footon - simple file-system based JSON store with querying, built for packaged node-webkit applications
 * author: gordon hall <gordon@gordonwritescode.com>
 *
 * configuration options
 */

module.exports = {
	path : __dirname + '/.databases',
	collectionExtension : 'footon',
	net : {
		port : 3333,
		pass : null
	},
	queueInterval : 10
};