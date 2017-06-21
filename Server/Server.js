var http = require('http');
var fileSystem = require('fs');
var path = require('path');
var os = require('os');

var ifaces = os.networkInterfaces();
var localIp;

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      //console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      //console.log(ifname, iface.address);
      localIp = iface.address;
    }
    ++alias;
  });
});

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
console.log('Server listening at http://'+ localIp + ':2000/');