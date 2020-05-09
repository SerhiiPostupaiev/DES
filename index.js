const keyGen = require('./keyGen');
const roundMapper = require('./rounds');
const converter = require('./helpers/textConverter');

const key = 'sadgsdgd';
const message = 't3rno wo';

const keys = keyGen.getKeys(key);

const encValue = roundMapper.mapThroughRounds(message, keys, 'encrypt');
const decValue = roundMapper.mapThroughRounds(encValue, keys, 'decrypt');
const textResult = converter.toText(decValue);

console.log(`Encrypted value: ${encValue}`);
console.log(`Decrypted value: ${decValue}`);
console.log(`Decrypted text: ${textResult}`);
