const http = require("http");
const url = require("url");
const https = require("https");
const StringDecoder = require("string_decoder").StringDecoder;
let config = require("../31072025/database/config");

const _data = require("../31072025/database/lib/data");

_data.create("test", "newFile", { foo: "bar" }, (err) => {
  console.log("It worked", err);
});

const httpServer = http.createServer(function (req, res) {
  unifiedServer(req, res);
});

httpServer.listen(config.httpPort, function () {
  console.log("The HTTP server is running on port " + config.httpPort);
});

// const httpsServerOptions = {
//   key: fs.readFileSync(""),
//   cert: fs.readFileSync(""),
// };

// httpsServer = https.createServer(httpsServerOptions, function (req, res) {
//   unifiedServer(req, res);
// });

// httpsServer.listen(config.httpsPort, function () {
//   console.log("The HTTPS server is running on port " + config.httpsPort);
// });

let unifiedServer = function (req, res) {
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
};

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
