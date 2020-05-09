module.exports.toFullBinary = (num) => {
  let zeroStr = '';
  for (let i = 0; i < 8 - num.length; i++) {
    zeroStr += '0';
  }

  return zeroStr + num;
};
