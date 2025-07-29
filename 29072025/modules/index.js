const mathLib = require("./randomJokes/math");
const jokesLib = require("./randomJokes/generateJokes");

let app = {};

app.config = {
  intervalBetweenJokes: 1000,
};

app.printRandomJokes = () => {
  let allJokes = jokesLib.allJokes();

  let jokesLength = allJokes.length;

  let randomIndex = mathLib.getRandomNumber(1, jokesLength);

  let selectedJoke = allJokes[randomIndex - 1];
  console.log(selectedJoke);
};

app.indefiniteLoop = () => {
  setInterval(app.printRandomJokes, app.config.intervalBetweenJokes);
};

app.indefiniteLoop();
