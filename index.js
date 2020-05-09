const keyGen = require('./keyGen');
const roundMapper = require('./rounds');

const keys = keyGen.getKeys('!fyrhctf');

const encValue = roundMapper.mapThroughRounds('hello wo', keys);

console.log(encValue);
