## node-google-weather

### What it does

Fetch weather forecast from Google's weather API, return as javascript object.

### Requires

* libxmljs https://github.com/polotek/libxmljs in order to use libxmljs.SaxParser

### How to use

	var Weather = require('node-google-weather').Weather;
	var weather = new Weather();
	
	var options = {
    	  'query': {'weather': 'Washington, DC'},
          'format': 'plain'
  	};
	weather.forecast(options, function(data) {
	  // data will be an object with response
	})


### Credits

* @mscdex for the xml to js parser, from https://gist.github.com/416021
