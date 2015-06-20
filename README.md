#Description
A Promise based JS client library for the OMDb api.

#Installation and Usage
Use npm to install:

```npm install omdbjs```


Import using es6 import syntax

```import omdb as * from 'omdb'```

##Example

The ```request``` function returns a promise that resolves to a [superagent response](http://visionmedia.github.io/superagent/#response-properties).  The [OMDb site](http://www.omdbapi.com/) can be used to see the format of the response body.
```javascript
omdb
  .title('Wedding')
  .year(2005)
  .type('movie')
  .format('json')
  .request()
  .then(res => {
    res.body.Title === 'Wedding Crashers'
  })
);
```

##Top Level Api

###Single Results

```omdb.title(title: String)```: The movie title to find

```omdb.imdbId(id: String)```: The imdb id to find

###Multiple Results
```omdb.searchTitle(title: String)```: The movie title to search for

##Extra Criteria

```type(type: String)```: The type of media to find (movie, series, or episode)

```year(year: Number)```: The year the movie was released

```format(format: String)```: The format of the response body (json, xml.  Defaults to json)

```plot(plot: String)```: The length of the plot synopsis (short, full.  Defaults to short)

```tomatoes(tomatoes: Boolean)```: Whether or not to include Rotten Tomatoes ratings (Defaults to false)
