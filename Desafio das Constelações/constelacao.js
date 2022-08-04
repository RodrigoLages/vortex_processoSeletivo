const box = document.getElementById("input");
const display1 = document.getElementById("constelation");
const display2 = document.getElementById("conection");
var size, star1, star2;
var constelation;
var text;

function getValues() {
  text = box.value;
  [size, star1, star2] = text.split(", ").map(Number);
  createConstelation();
  showValues();
}

function createConstelation() {
  constelation = [];

  for (let i = 0; i < size; i++) {
    constelation.push([]);
    for (let j = 0; j < i; j++) {
      constelation[i].push(Math.round(Math.random()));
    }
    constelation[i].push(0);
  }

  for (let i = 0; i < size; i++) {
    for (let j = i + 1; j < size; j++) {
      constelation[i][j] = constelation[j][i];
    }
  }
}

function showValues() {
  let message = "";
  for (let row of constelation) {
    message += "[ " + row.join(", ") + " ], </br>";
  }
  display1.innerHTML = message;

  if (constelation[star1][star2] == 0) {
    display2.innerHTML = "Não há ligação";
  } else {
    display2.innerHTML = "Há ligação";
  }
}
