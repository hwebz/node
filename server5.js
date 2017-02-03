var connect = require('connect');
var util = require('util');
var form = require('fs').readFileSync('form.html');

connect(connect.limit('32kb'), connect.bodyParser(), function(request, response) {
    if (request.method === "GET") {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(form);
    } else if (request.method === "POST") {
        console.log('User Posted:\n', request.body);
        response.end('You Posted:\n' + util.inspect(request.body));
    }
}).listen(8080);