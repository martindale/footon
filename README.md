footon
======

**footon** is a simple file-system based JSON store with querying, built for packaged node-webkit applications.

## what footon is good for

At it's core, footon is a JavaScript interface for creating organized collections of JSON documents 
on the filesystem. It's a simple psueo-database that could be ideal for packaged applications with 
the need to persist small amounts of data between sessions. Once a "collection" is read, it's 
contents are stored in memory. It is a lightweight solution for applications needing to remember user 
configuration or other data. It supports both asynchonous and synchronous operation (defaults to sync).

## installation

Using Node Package Manager

```
$ npm install footon
```

## basic usage

Using database named "music", create a new collection of "playlists" and save a playlist document to it.

```javascript
var footon = require('footon')
  , music = footon('music');

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

music.on('ready', function() {
	var playlists = music.get('playlists');
	playlists.save(punkrock);
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
There is also support for "or"-style queries, by passing an array of object to query against.

```javascript
playlists.find({ rating : 5 }); // returns array of documents with a rating of 5
```
