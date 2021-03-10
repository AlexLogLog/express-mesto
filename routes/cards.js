const cards = require('express').Router();
const {
  likeCard,
  dislikeCard,
  getCards,
  newCard,
  getCardId,
} = require('../controlles/cards');

cards.get('/cards', getCards);

cards.post('/cards', newCard);

cards.get('/cards/:userId', getCardId);

cards.put('/cards/:cardId/likes', likeCard);

cards.delete('/cards/:cardId/likes', dislikeCard);

module.exports = cards;
