const cards = require('express').Router();
const path = require('path');
const getFile = require('../helpers/fileRead');

const cardsPath = path.join(__dirname, '..', 'data', 'cards.json');

cards.get('/cards', (req, res) => {
  return getFile(cardsPath)
    .then((cadrs) => res.status(200).send(cadrs))
    .catch((error) => res.status(500).send({ message: error.message }));
});

module.exports = cards;