var http = require('http');
var formidable = require('formidable');
var form = require('fs').readFileSync('form2.html');

http.createServer(function(request, response) {
   if (request.method === "POST") {
       var incoming = new formidable.IncomingForm();
       incoming.uploadDir = 'uploads';
       incoming.on('fileBegin', function(field, file) {
           if (file.name) {
               file.path += "-" + file.name;
           }
       }).on('file', function(field, file) {
            if (!file.size) return;
           response.write(file.name + ' received\n');
       }).on('field', function(field, value) {
           response.write(field + ' : ' + value + '\n');
       }).on('end', function() {
           response.end('All files reveived');
       });
       
       incoming.parse(request);
   } else if (request.method === 'GET') {
       response.writeHead(200, {'Content-Type': 'text/html'});
       response.end(form);
   }
}).listen(8080);