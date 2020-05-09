const binaryConverter = require('./helpers/binaryConverter');
const roundHelpers = require('./value_storages/roundHelpers');
const boxes = require('./value_storages/s-boxes');

const ROUNDS = 16;
const PART_LEN = 32;
const BOX_LEN = 6;
const BOX_QUANTITY = 8;
let L = '';
let R = '';

let R_ZERO = '';

let initialData = '';
let encryptedValue = '';

module.exports.mapThroughRounds = (inputData, keys, mode) => {
  if (mode === 'encrypt') {
    for (let i = 0; i < inputData.length; i++) {
      let concreteSymbol = binaryConverter.toFullBinary(
        inputData[i].charCodeAt(0).toString(2)
      );
      initialData += concreteSymbol;
    }
  } else {
    initialData = inputData;
  }

  initialData = initialPermutation(initialData);

  L = initialData.slice(0, PART_LEN).join('');
  R = initialData.slice(PART_LEN).join('');

  if (mode === 'encrypt') {
    for (let i = 0; i < ROUNDS; i++) {
      mixer(keys[i], i);
    }
  } else {
    for (let i = ROUNDS - 1; i >= 0; i--) {
      mixer(keys[i], i);
    }
  }

  encryptedValue = R + L;

  encryptedValue = finalPermutation(encryptedValue.split('')).join('');

  let k = '';
  for (let i = 0; i < 16; i++) {
    let t = encryptedValue.slice(4 * i, 4 * i + 4);

    k += parseInt(t, 2).toString(16).toLocaleUpperCase();
  }

  return encryptedValue;
};

function initialPermutation(data) {
  return roundHelpers.initialPermutationTable.map((bit) => data[bit - 1]);
}

function finalPermutation(data) {
  return roundHelpers.finalPermutationTable.map((bit) => data[bit - 1]);
}

function mixer(roundKey, iteration) {
  let funcOutput = mixerFunction(roundKey);
  let mixerRes = '';

  // xor with L
  for (let i = 0; i < funcOutput.length; i++) {
    mixerRes += funcOutput[i] ^ L[i];
  }

  // swapper
  L = R;
  R = mixerRes;

  // console.log(`Round #${iteration}: \nL: ${L}`);
  // console.log(`R: ${R}`);
  // console.log(`Key: ${roundKey}\n`);
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
