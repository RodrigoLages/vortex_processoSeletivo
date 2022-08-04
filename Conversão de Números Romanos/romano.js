const box = document.getElementById("input");
const display = document.getElementById("output");

const table = new Map();
table.set("M", 1000);
table.set("D", 500);
table.set("C", 100);
table.set("L", 50);
table.set("X", 10);
table.set("V", 5);
table.set("I", 1);
table.set("", 0);

var roman, value;

function convert() {
  roman = box.value;
  value = 0;

  for (let i = 0; i < roman.length; i++) {
    if (table.get(roman.charAt(i)) < table.get(roman.charAt(i + 1))) {
      value += table.get(roman.charAt(i + 1)) - table.get(roman.charAt(i));
      i++;
    } else {
      value += table.get(roman.charAt(i));
    }
  }

  display.innerHTML = value;
}
