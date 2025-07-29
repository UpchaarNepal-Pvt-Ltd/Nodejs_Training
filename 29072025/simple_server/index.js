const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  let parserUrl = url.parse(req.url, true);

  let path = parserUrl.pathname;

  let method = req.method;

  res.end("Received request on path:" + path + " with http method:" + method);
});

server.listen(3000, () => {
  console.log("Server is running now");
});
