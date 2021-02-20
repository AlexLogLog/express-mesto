const fsPromises = require('fs').promises;
const path = require('path');

const getFile = (path) => {
  return fsPromises.readFile(path, { encoding: 'utf-8' })
    .then(data => JSON.parse(data))
    .catch((error) => console.log(error));
}

module.exports = getFile;