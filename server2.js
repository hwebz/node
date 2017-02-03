var http = require('http');
var path = require('path');

var url = require('url');
var fs = require('fs');

var whitelist = [
    '/index.html',
    '/subcontent/styles.css',
    '/subcontent/script.js'
];

http.createServer(function(request, response) {
    var lookup = url.parse(decodeURI(request.url)).pathname;
    /*lookup = (lookup === "/") ? '/index.html' : lookup;
    lookup = path.normalize(lookup);
    var f = 'content' + lookup;*/
    
    lookup = (lookup === "/") ? '/index.html-serve' : lookup + "-server";
    var f = 'content-pseduosafe' + lookup;
    console.log(f);
    if (whitelist.indexOf(lookup) === -1) {
        /*fs.readFile(f, function(err, data) {
            response.end(data);
        });*/
    }
    
    /*fs.exists(f, function(exists) {
        if (!exists) {
            response.writeHead(404);
            response.end('Page not found!');
            return;
        }
    });*/
    
}).listen(8080);