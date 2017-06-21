var http = require('http'),
    fileSystem = require('fs'),
    path = require('path');

console.log("Initiating");
http.createServer(function(request, response) {
    console.log(`Receiving request`);
    var filePath = path.join(__dirname, 'file.json');
    var stat = fileSystem.statSync(filePath);

    response.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Length': stat.size
    });

    var readStream = fileSystem.createReadStream(filePath);
    readStream.pipe(response);
}).listen(2000);
console.log('Server running at http://localhost:2000/');
