const keyGen = require('./keyGen');
const roundMapper = require('./rounds');
const converter = require('./helpers/textConverter');

const keys = keyGen.getKeys('awserf45');

const encValue = roundMapper.mapThroughRounds('hello wo', keys, 'encrypt');
const decValue = roundMapper.mapThroughRounds(encValue, keys, 'decrypt');
const textResult = converter.toText(decValue);

console.log(`Encrypted value: ${encValue}`);
console.log(`Decrypted value: ${decValue}`);
console.log(`Decrypted text: ${textResult}`);
