const robo1 = {
  hand: [],
  finalHand: [],
  combination: 0,
};
const robo2 = {
  hand: [],
  finalHand: [],
  combination: 0,
};

var pulled;
var FH1string, FH2string, result;
const output = document.getElementById("display");

const nums = new Map();
nums.set(0, "2");
nums.set(1, "3");
nums.set(2, "4");
nums.set(3, "5");
nums.set(4, "6");
nums.set(5, "7");
nums.set(6, "8");
nums.set(7, "9");
nums.set(8, "10");
nums.set(9, "J");
nums.set(10, "Q");
nums.set(11, "K");
nums.set(12, "A");

const suits = new Map();
suits.set(0, "C");
suits.set(1, "E");
suits.set(2, "O");
suits.set(3, "P");

const combi = new Map();
combi.set(0, "Carta Alta");
combi.set(1, "Par");
combi.set(2, "Dois Pares");
combi.set(3, "Trio");
combi.set(4, "Straight");
combi.set(5, "Flush");
combi.set(6, "Full House");
combi.set(7, "Quadra");
combi.set(8, "Straight Flush");
combi.set(9, "Royal Flush");

//puxa as cartas dos 2 robos
function drawAndSort() {
  let r1aux = [];
  let r2aux = [];

  for (let i = 0; i < 5; i++) {
    let card = randomCard();
    r1aux.push(card);
    r2aux.push(card);
  }
  for (let i = 0; i < 2; i++) {
    r1aux.push(randomCard());
    r2aux.push(randomCard());
  }

  sortHand(r1aux);
  sortHand(r2aux);

  robo1.hand = r1aux.slice();
  robo1.finalHand = r1aux.slice();
  robo2.hand = r2aux.slice();
  robo2.finalHand = r2aux.slice();
}
//puxa uma carta aleatoria
function randomCard() {
  let n, s, c;

  while (true) {
    n = Math.floor(Math.random() * 13);
    s = Math.floor(Math.random() * 4);
    c = nums.get(n) + suits.get(s);

    if (checkIfPulled(c)) {
      break;
    }
  }

  let card = {
    num: n,
    suit: s,
    crd: c,
  };

  pulled.push(card);
  return card;
}
//confere se a carta ja foi puxada
function checkIfPulled(c) {
  for (let item of pulled) {
    if (c == item.crd) {
      return false;
    }
  }
  return true;
}
//organiza em ordem decrescente
function sortHand(A) {
  for (let i = 1; i < A.length; i++) {
    let j = i;
    let aux = A[i];

    while (j > 0 && A[j - 1].num <= aux.num) {
      A[j] = A[j - 1];
      j--;
    }

    A[j] = aux;
  }

  return A;
}

function checkCombination(obj) {
  let numAux = [];
  let suitAux = [];
  for (let i = 0; i < 13; i++) {
    numAux.push([]);
  }
  for (let i = 0; i < 4; i++) {
    suitAux.push([]);
  }
  //2 arrays bidimensionais organizados por numero e naipe
  for (i = 0; i < 7; i++) {
    numAux[obj.hand[i].num].push(obj.hand[i]);
    suitAux[obj.hand[i].suit].push(obj.hand[i]);
  }

  //checa se ha sequencia ou flush
  let flushSuit = checkFlush(suitAux);
  let sequence = checkStraight(obj.hand, flushSuit);

  //carta alta
  obj.combination = 0;

  //par
  let pairCounter = 0;
  for (let arr of numAux) {
    if (arr.length == 2) {
      pairCounter++;
      obj.combination = 1;

      let handAux = obj.finalHand.filter((card) => card.num != arr[0].num);
      for (let card of arr) {
        handAux.unshift(card);
      }
      obj.finalHand = handAux.slice();
    }
  }

  //dois pares
  if (pairCounter >= 2) obj.combination = 2;

  //trio
  let trioCounter = 0;
  for (let arr of numAux) {
    if (arr.length == 3) {
      trioCounter++;
      obj.combination = 3;

      let handAux = obj.finalHand.filter((card) => card.num != arr[0].num);
      for (let card of arr) {
        handAux.unshift(card);
      }
      obj.finalHand = handAux.slice();
    }
  }

  //straight
  if (sequence.length > 0) {
    obj.combination = 4;
    obj.finalHand = sequence;
  }

  //flush
  if (flushSuit >= 0) {
    obj.finalHand = suitAux[flushSuit].slice();
    obj.combination = 5;
  }

  //full house
  if (trioCounter > 0 && trioCounter + pairCounter > 1) obj.combination = 6;

  //quadra
  for (let arr of numAux) {
    if (arr.length == 4) {
      obj.combination = 7;

      let handAux = obj.finalHand.filter((card) => card.num != arr[0].num);
      for (let card of arr) {
        handAux.unshift(card);
      }
      obj.finalHand = handAux.slice();
    }
  }

  //straight flush
  let straightFlush = [];
  if (flushSuit >= 0 && sequence.length > 0) {
    straightFlush = checkStraightFlush(sequence, flushSuit);
  }

  if (straightFlush.length > 0) {
    obj.combination = 8;
    obj.finalHand = straightFlush.slice();
    //royal flush
    if (straightFlush[0].num == 12) {
      obj.combination = 9;
    }
  }

  obj.finalHand.length = 5;
}

function checkFlush(suits) {
  for (let i in suits) {
    if (suits[i].length >= 5) {
      return i;
    }
  }
  return -1;
}

function checkStraight(hand, flush) {
  let arr = hand.slice();

  //cria uma copia dos As e joga no fim da sequencia
  for (let i = 0; i < 7; i++) {
    if (arr[i].num == 12) {
      let aux = Object.create(arr[i]);
      aux.num = -1;
      arr.push(aux);
    }
  }

  //remove numeros repetidos
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i].num == arr[i + 1].num) {
      if (arr[i].suit != flush) {
        arr.splice(i, 1);
      } else {
        arr.splice(i + 1, 1);
      }
    }
  }

  let sequenceCounter = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i].num + 1 == arr[i - 1].num) sequenceCounter++;
    else sequenceCounter = 0;

    if (sequenceCounter == 4) return arr.slice(i - 4, i + 1);
  }
  return [];
}

function checkStraightFlush(seq, fs) {
  let SFCounter = 0;
  for (let i in seq) {
    if (seq[i].suit == fs) SFCounter++;
    else SFCounter = 0;

    if (SFCounter == 5) {
      return seq.slice(i - 4, i + 1);
    }
  }
}
//nomeia as cartas em uma string
function finalHandString(arr) {
  let str = "";
  for (let i in arr) {
    str += arr[i].crd;
    if (i < 4) str += ", ";
  }
  return str;
}
//verifica o ganhador
function checkWinner() {
  if (robo1.combination > robo2.combination) return "Robô 1 venceu!";
  else if (robo1.combination < robo2.combination) return "Robô 2 venceu!";
  else if (robo1.combination == 0)
    return checkHighestCard(robo1.finalHand, robo2.finalHand);
  else return "Empate!";
}
//Desempate em caso de carta alta
function checkHighestCard(arr1, arr2) {
  for (let i in arr1) {
    if (arr1[i].num > arr2[i].num) return "Robô 1 venceu!";
    if (arr1[i].num < arr2[i].num) return "Robô 2 venceu!";
  }
  return "Empate!";
}

//chama as funções para iniciar
function startGame() {
  pulled = [];
  drawAndSort();
  checkCombination(robo1);
  checkCombination(robo2);
  FH1string = finalHandString(robo1.finalHand);
  FH2string = finalHandString(robo2.finalHand);
  result = checkWinner();

  output.innerHTML =
    `Robô 1: ${combi.get(robo1.combination)} (${FH1string}), ` +
    `Robô 2: ${combi.get(robo2.combination)} (${FH2string}), ` +
    `${result}`;

  console.log(robo1.hand, robo2.hand);
}
