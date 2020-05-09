const CHUNK_LEN = 8;

module.exports.toText = (binaryCode) => {
  let result = '';

  for (let i = 0; i < CHUNK_LEN; i++) {
    let chunk = binaryCode.slice(CHUNK_LEN * i, CHUNK_LEN * i + CHUNK_LEN);
    chunk = parseInt(chunk, 2);

    result += String.fromCharCode(chunk);
  }
  return result;
};
