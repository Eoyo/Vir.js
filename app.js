let http = require("http"),
url = require("url"),
path = require("path"),
fs = require("fs");

let port = 8006;

http.createServer(function (req, res) {
var pathname = __dirname + url.parse(req.url).pathname;
//LocalServer
if (path.extname(pathname) == "") {
  pathname += "/";
}
if (pathname.charAt(pathname.length - 1) == "/") {
  pathname += "index.html";
}
if (path.extname(pathname) == "/data") {
  res.write('ok');
}
var params = url.parse(req.url, true)
fs.exists(pathname, function (exists) {
  if (exists) {
    switch (path.extname(pathname)) {
      case ".html":
        res.writeHead(200, { "Content-Type": "text/html" });
        break;
      case ".js":
        res.writeHead(200, { "Content-Type": "text/javascript" });
        break;
      case ".css":
        res.writeHead(200, { "Content-Type": "text/css" });
        break;
      case ".gif":
        res.writeHead(200, { "Content-Type": "image/gif" });
        break;
      case ".jpg":
        res.writeHead(200, { "Content-Type": "image/jpeg" });
        break;
      case ".png":
        res.writeHead(200, { "Content-Type": "image/png" });
        break;
      case ".json":
        res.writeHead(200, { "Content-Type": "text/json" });
        break;
      case ".less":
        res.writeHead(200, { "Content-Type": "text/css" });
      default:
        res.writeHead(200, { "Content-Type": "application/octet-stream" });
    }
    
    fs.readFile(pathname, function (err, data) {
      res.end(data);
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1>404 Not Found</h1>");
  }
});

}).listen(port, "127.0.0.1");

console.log("listen at:   http://localhost:"+port);

