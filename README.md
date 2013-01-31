footon
======

**footon** is a simple file-system based JSON store with querying, built for packaged node-webkit applications.

## what footon is good for

At it's core, footon is a JavaScript interface for creating organized collections of JSON documents 
on the filesystem. It's a simple psueo-database that could be ideal for packaged applications with 
the need to persist small amounts of data between sessions. Once a "collection" is read, it's 
contents are stored in memory. It is a lightweight solution for applications needing to remember user 
configuration or other data. All operations are asynchronous and all classes inherit from `EventEmitter` 
where applicable.

## installation

Using Node Package Manager

```
$ npm install footon
```

## basic usage

Using database named "music", create a new collection of "playlists" and save a playlist document to it.

```javascript
// require footon and select the music database
var footon = require('footon')
  , music = footon('music');

// create a playlist document
var punkrock = {
	name : 'Punk Rock',
	songs : [
		{ 
			artist : 'Bad Religion', 
			album : 'How Could Hell Be Any Worse?', 
			track : 'F*** Armageddon, This Is Hell' 
		},
		{
			artist : 'Minor Threat', 
			album : 'Minor Threat EP', 
			track : 'Seeing Red'
		}
	],
	rating : 5
};

// when the database is ready, get the playlists collection
// and save our playlist document to it
music.on('ready', function() {
	var playlists = music.get('playlists');
	playlists.add(punkrock);
});


```

Now we can use the playlist and operate on it.

```javascript
punkrock.songs.push({
	artist : 'Dead Kennedys', 
	album : 'Fresh Fruit For Rotting Vegetables', 
	track : 'I Kill Children'
});
```

To delete a document from a collection, just call `remove()`.

```javascript
punkrock.remove();
```

To commit your changes to disk, call `Collection.write()`

```javascript
punkrock.write(function(err) {
	console.log(err || 'Changes saved!');
});
```

Every document has a `__id` property, which can be used to target it directly using the `find()` 
method.

```javascript
playlists.find({ __id : '42' }); // returns single document
// this works too!
playlists.find('42'); // returns single document
```

You can also use this method to query documents, by passing in other properties to be matched.
There is also support for "or"-style queries, by passing an array of objects to query against.

```javascript
playlists.find({ rating : 5 }); // returns array of documents with a rating of 5
```

## Public API

#### footon(database_name String)

Returns an instance of `footon.Database` and populates it. If an existing database does not exist, it is created.  
Inherits from `EventEmitter`.

```javascript
var myDatabase = footon('myDatabase');

myDatabase.on('ready', function() {
	// do stuff here
});
```

#### footon.createServer(options Object)

Feature currently unavailable.

#### footon.createConnection(options Object)

Feature currently unavailable.

## Class Reference

#### footon.Database


#### footon.Collection


#### footon.Document


#### footon.Server


#### footon.Connection