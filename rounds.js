const binaryConverter = require('./binaryConverter');
const roundHelpers = require('./roundHelpers');
const boxes = require('./s-boxes');

const ROUNDS = 16;
const PART_LEN = 32;
const BOX_LEN = 6;
const BOX_QUANTITY = 8;
let L = '';
let R = '';

let R_ZERO = '';

let initialData = '';
let encryptedValue = '';

module.exports.mapThroughRounds = (inputData, keys) => {
  for (let i = 0; i < inputData.length; i++) {
    let concreteSymbol = binaryConverter.toFullBinary(
      inputData[i].charCodeAt(0).toString(2)
    );
    initialData += concreteSymbol;
  }

  initialData = initialPermutation(initialData);

  L = initialData.slice(0, PART_LEN).join('');
  R = initialData.slice(PART_LEN).join('');

  for (let i = 0; i < ROUNDS; i++) {
    mixer(keys[i]);
  }

  encryptedValue = R + L;

  encryptedValue = finalPermutation(encryptedValue.split('')).join('');

  return encryptedValue;
};

function initialPermutation(data) {
  return roundHelpers.initialPermutationTable.map((bit) => data[bit - 1]);
}

function finalPermutation(data) {
  return roundHelpers.finalPermutationTable.map((bit) => data[bit - 1]);
}

function mixer(roundKey) {
  let funcOutput = mixerFunction(roundKey);
  let mixerRes = '';

  // xor with L
  for (let i = 0; i < funcOutput.length; i++) {
    mixerRes += funcOutput[i] ^ L[i];
  }

  // swapper
  L = R;
  R = mixerRes;
}

function mixerFunction(roundKey) {
  let xorResult = '';

  // expansion permutation
  let permutKey = roundHelpers.expansionPermutation
    .map((bit) => R[bit - 1])
    .join('');

  //   xor
  for (let i = 0; i < permutKey.length; i++) {
    xorResult += permutKey[i] ^ roundKey[i];
  }

  let sBoxesArr = boxesDivision(xorResult);

  //   s-boxes convert

  for (let i = 0; i < sBoxesArr.length; i++) {
    let row = parseInt(
      sBoxesArr[i][0] + sBoxesArr[i][sBoxesArr[i].length - 1],
      2
    );
    let col = parseInt(sBoxesArr[i].substring(1, sBoxesArr[i].length - 1), 2);

    let sBoxesPart = boxes.sBoxes[i][row][col];

    sBoxesArr[i] = (sBoxesPart >>> 0).toString(2);

    let zeroStr = '';
    for (let j = 0; j < 4 - sBoxesArr[i].length; j++) {
      zeroStr += '0';
    }
    sBoxesArr[i] = zeroStr + sBoxesArr[i];
  }

  sBoxesArr = sBoxesArr.join('').split('');

  // straight permutation
  sBoxesArr = roundHelpers.straightPermutationTable.map(
    (bit) => sBoxesArr[bit - 1]
  );

  return sBoxesArr.join('');
}

function boxesDivision(xorRes) {
  const sBoxesArr = [];
  for (let i = 0; i < BOX_QUANTITY; i++) {
    sBoxesArr.push(xorRes.slice(BOX_LEN * i, BOX_LEN * i + BOX_LEN));
  }

  return sBoxesArr;
}
