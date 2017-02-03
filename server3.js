var http = require('http');
var static = require('node-static');
var fileServer = new static.Server('./content');

http.createServer(function(request, response) {
    request.addListener('end', function() {
        fileServer.serve(request, response);
    });
}).listen(8080);