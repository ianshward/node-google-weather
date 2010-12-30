var http = require('http'),
    q = require('querystring'),
    libxml = require('libxmljs');

var baseUrl = '/ig/api';

function Weather (options) {
  // Nothing here.
};

Weather.prototype.forecast = function(options, callback) {
  //@TODO check whether options are valid.
  var host = 'www.google.com';
  var google = http.createClient(80, host);
  var request = google.request('GET', baseUrl + '?' + q.stringify(options.query), {'host': host});
  request.end();
  request.on('response', function (response) {
    var data = [];
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      data.push(chunk);
    });
    response.on('end', function() {
      var xml = data.join('');
      // TODO: move the parser out of here.
      var stack = [];
      parser = new libxml.SaxParser(function(cb) {
        // Based on https://gist.github.com/416021 by @mscdex
        cb.onStartElementNS(function(elem, attrs, prefix, uri, namespaces) {
          var obj = {};
          obj['@'] = {};
          obj['#'] = "";
          for (var i=0,len=attrs.length; i<len; i++)
            obj['@'][attrs[i][0]] = attrs[i][3];
            stack.push(obj);
        });
        cb.onEndElementNS(function(elem, prefix, uri) {
          var obj = stack.pop();
          if (stack.length > 0) {
            if (typeof stack[stack.length-1][elem] === 'undefined')
              stack[stack.length-1][elem] = obj;
            else if (Array.isArray(stack[stack.length-1][elem]))
              stack[stack.length-1][elem].push(obj);
            else {
              var old = stack[stack.length-1][elem];
              stack[stack.length-1][elem] = [];
              stack[stack.length-1][elem].push(old);
            }
          } 
          else {
            // Done parsing to object.
          }
        });
        cb.onCharacters(function(chars) {
          chars = chars.trim();
          if (chars != "")
            stack[stack.length-1]['#'] += chars;
          });
        });
      parser.parseString(xml);
      return callback(data.join(''));
    });
  });
}

exports.Weather = Weather;
