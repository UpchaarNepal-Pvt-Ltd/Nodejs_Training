const fs = require("fs");

let jokes = {};

jokes.allJokes = () => {
  let readJokesFromTxtFile = fs.readFileSync(__dirname + "/jokes.txt", "utf-8");
  return readJokesFromTxtFile.split(/\r?\n/);
};

module.exports = jokes;
