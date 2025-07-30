const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
let config = require("./config");

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

    let chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    let data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: buffer,
    };

    chosenHandler(data, function (statusCode, payload) {
      statusCode = typeof statusCode == "number" ? statusCode : 200;
      payload = typeof payload == "object" ? payload : {};
      let payloadString = JSON.stringify(payload);
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log("Returning this response: ", statusCode, payloadString);
    });
  });
});

server.listen(3000, () => {
  console.log(
    "The server is up and running on port " +
      config.port +
      " in " +
      config.envName +
      " mode."
  );
});

// Define all the handlers
let handlers = {};

// Sample handler
handlers.sample = function (data, callback) {
  callback(200, { name: "sample handler" });
};

handlers.ping = function (data, callback) {
  callback(200);
};

// Not found handler
handlers.notFound = function (data, callback) {
  callback(404);
};

// Define the request router
let router = {
  sample: handlers.sample,
  ping: handlers.ping,
  notFound: handlers.notFound,
};
