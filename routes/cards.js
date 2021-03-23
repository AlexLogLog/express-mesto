const cards = require('express').Router();
const {
  likeCard,
  dislikeCard,
  getCards,
  newCard,
  getCardId,
  deleteCard,
} = require('../controlles/cards');

cards.get('/cards', getCards);

cards.post('/cards', newCard);

cards.get('/cards/:userId', getCardId);

cards.put('/cards/:cardId/likes', likeCard);

cards.delete('/cards/:cardId/likes', dislikeCard);

cards.delete('/cards/:cardId', deleteCard);

module.exports = cards;
