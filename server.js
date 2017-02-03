var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var pages = [
    {route: '/', output: 'Wooho!'},
    {route: '/about', output: 'A simple routing with Node example'},
    {route: '/about/this', output: 'Multilevel routing with Node'},
    {route: '/about/node', output: 'Evented I/O for V8 JavaScript.'},
    {route: 'another page', output: function() { return 'Here\'s ' + this.route;}}
];

var anotherPages = [
    {route: 'about', childRoutes: [
        {route: 'node', output: 'Evented I/O for V8 JavaScript'},
        {route: 'this', output: 'Complex Multilevel Example'}
    ]}
];

var otherPages = [
    {id: '1', route: '', output: 'Wooho!' },
    {id: '2', route: 'about', output: 'A simple routing with Node example'},
    {id: '3', route: 'another page', output: function() { return 'Here\'s' + this.route;}}
];

var mimeTypes = {
    '.js': 'text/javascript',
    '.html': 'text/html',
    '.css': 'text/css'
};

var cache = {
    store: {},
    maxSize: 26214400, // (bytes) 25mb
    maxAge: 5400 * 1000, // (ms) 1 and a half hours
    cleanAfter: 7200 * 1000, // (ms) two hours
    cleanAt: 0, // to be set dynamically
    clean: function(now) {
        if (now - this.cleanAfter > this.cleanAt) {
            this.cleanAt = now;
            var that = this;
            Object.keys(this.store).forEach(function(file) {
               if (now > that.store[file].timestamp + that.maxAge) {
                   delete that.store[file];
               } 
            });
        }
        
    }
};
/*function cacheAndDeliver(f, cb) {
    if (!cache[f]) {
        fs.readFile(f, function(err, data) {
            if (!err) {
                cache[f] = {content: data};
            }
            cb(err, data);
        });
        return;
    }
    console.log('loading ' + f + ' from cache');
    cb(null, cache[f].content);
}*/

function cacheAndDeliver(f, cb) {
    fs.stat(f, function(err, stats) {
       var lastChanged = Date.parse(stats.ctime),
           isUpdated = (cache[f]) && lastChanged > cache[f].timestamp;
        if (!cache[f] || isUpdated) {
            fs.readFile(f, function(err, data) {
                console.log('loading ' + f + ' from file');
                
                if (!err) {
                    cache[f] = {content: data, timestamp: Date.now()};
                }
                cb(err, data);
            });
            return;
        }
        
        console.log('loading ' + f + " from cache");
        cb(null, cache[f].content);
    });
}

http.createServer(function(request, response) {
    var lookup = path.basename(decodeURI(request.url));
    var lookup2 = decodeURI(request.url);
    var lookup3 = path.basename(decodeURI(request.url)) || 'index.html', f = 'content/' + lookup3;
    var id = url.parse(decodeURI(request.url), true).query.id;
    var s = fs.createReadStream(f).once('open', function() { // .on() or .once()
        // do stuff when the readStream opens
        var headers = {'Content-Type': mimeTypes[path.extname(lookup3)]};
        response.writeHead(200, headers);
        this.pipe(response);
    }).once('error', function(e) {
        console.log(e);
        response.writeHead(500);
        response.end('Server error!');
    });
    
    /*fs.stat(f, function(err, stats) {
        var bufferOffset = 0;
        cache[f] = {content: new Buffer(stats.size)};
        s.on('data', function(chunk) {
            chunk.copy(cache[f].content, bufferOffset);
            bufferOffset += chunk.length;
        });
    });*/
    
    fs.stat(f, function(err, stats) {
        if (stats.size < cache.maxSize) {
            var bufferOffset = 0;
            cache.store[f] = {content: new Buffer(stats.size), timestamp: Date.now()};
            s.on('data', function(data) {
                data.copy(cache.store[f].content, bufferOffset);
                bufferOffset += data.length;
            });
        }
    });
    cache.clean(Date.now());
    
    /*response.writeHead(200, {'Content-Type' : 'text/html'});
    response.end('Wooho!');*/
    
    /*pages.forEach(function(page) {
        if (page.route === lookup) {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(typeof page.output === 'function' ? page.output() : page.output);
        }
    });
    
    if (!response.finished) {
        response.writeHead(404);
        response.end('Page not found');
    }*/
    
    /*if (id) {
        otherPages.forEach(function(page) {
            if (page.id === id) {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(typeof page.output === 'function' ? page.output() : page.output);
            }
        });
        
        if (!response.finished) {
            response.writeHead(404);
            response.end('Page not found');
        }
    }*/
    
    /*fs.exists(f, function(exists) {
        if (exists) {
            fs.readFile(f, function(err, data) {
                if (err) { 
                    response.writeHead(500); 
                    response.end('Server Error!');
                    return;
                }
                var headers = {'Content-Type': mimeTypes[path.extname(lookup3)]};
                response.writeHead(200, headers);
                response.end(data);
            });
            return;
        }
        response.writeHead(404); //no such file found!
        response.end();
    });*/
    
    /*fs.exists(f, function(exists) {
        if (exists) {
            cacheAndDeliver(f, function(err, data) {
                if (err) { 
                    response.writeHead(500); 
                    response.end('Server error!');
                    return;
                }
                var headers = {'Content-Type': mimeTypes[path.extname(f)]};
                response.writeHead(200, headers);
                response.end(data);
            });
            return;
        }
        response.writeHead(404); //no such file found!
        response.end();
    });*/
    
    
    
}).listen(8080);