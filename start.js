const http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(`git clone ${process.env.USERNAME}@${process.env.FQDN}:~/repo/${process.env.APP_NAME}.git\n`);
}).listen(process.env.PORT);
