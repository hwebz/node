var http = require('http');
var url = require('url');
var urlOpts = {host: 'www.nodejs.org', path: '/', port: '80', method: 'POST'};

// node server8.js www.google.com

/*if (process.argv[2]) {
    if (!process.argv[2].match('http://')) {
        process.argv[2] = 'http://' + process.argv[2];
    }
    urlOpts = url.parse(process.argv[2]);
}*/

var request = http.get(urlOpts, function(response) {
        response.on('data', function(chunk) {
            console.log(chunk.toString());
        });
    }).on('error', function(e) {
        console.log('error: ' + e.message);
    });
process.argv.forEach(function(postItem, index) {
   if (index > 1) { request.write(postItem + '\n');} 
});

request.end();