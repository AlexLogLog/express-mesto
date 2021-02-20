const fsPromises = require('fs').promises;

function getFile(path) {
  return fsPromises.readFile(path, { encoding: 'utf-8' })
    .then((data) => JSON.parse(data));
}

module.exports = getFile;
