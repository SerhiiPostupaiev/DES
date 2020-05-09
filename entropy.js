const ARR_LEN = 8;

module.exports.calc = (roundValue) => {
  let roundArr = formTwoDimensionalArr(roundValue);
  let entropyArr = [];

  for (let i = 0; i < roundArr.length; i++) {
    let P = countProbability(roundArr, i, 1);
    let Q = 1 - P;

    let entropy = -(P * Math.log(P) + Q * Math.log(Q)).toFixed(3);

    entropyArr.push(entropy);
  }

  return entropyArr;
};

// - (p*log(2, p) + q*log(2, q))

function countProbability(roundArr, col, probItem) {
  let counter = 0;

  for (let i = 0; i < roundArr.length; i++) {
    if (+roundArr[i][col] === probItem) {
      counter++;
    }
  }

  return counter / ARR_LEN;
}

function formTwoDimensionalArr(roundValue) {
  let quantityArr = [];

  for (let i = 0; i < ARR_LEN; i++) {
    quantityArr.push(roundValue.slice(ARR_LEN * i, ARR_LEN * i + ARR_LEN));
  }

  return quantityArr;
}
