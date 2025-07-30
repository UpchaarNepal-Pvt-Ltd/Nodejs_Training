const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

const server = http.createServer((req, res) => {
  let parserUrl = url.parse(req.url, true);

  let path = parserUrl.pathname;

  let trimmedPath = path.replace(/^\/+|\/+$/g, "");

  let headers = req.headers;

  let method = req.method.toLowerCase();
  let queryStringObject = parserUrl.query;

  let decoder = new StringDecoder("utf-8");
  let buffer = "";
  req.on("data", (data) => {
    buffer += decoder.write(data);
  });
  req.on("end", () => {
    buffer += decoder.end();
    res.end(
      "Received request on path: " +
        trimmedPath +
        " with http method: " +
        method +
        " and this query string: " +
        JSON.stringify(queryStringObject) +
        "with data: " +
        buffer
    );
  });
});

server.listen(3000, () => {
  console.log("Server is running now");
});
