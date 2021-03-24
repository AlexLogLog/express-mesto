const cards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');
const {
  likeCard,
  dislikeCard,
  getCards,
  newCard,
  getCardId,
  deleteCard,
} = require('../controlles/cards');

cards.get('/cards', getCards);

cards.post('/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(40),
      link: Joi.string().required().custom((value, helpers) => {
        if (!isURL(value)) return helpers.error('Невалидная ссылка');
        return value;
      }),
    }),
  }),
  newCard);

cards.get('/cards/:userId', getCardId);

cards.put('/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  likeCard);

cards.delete('/cards/:cardId/likes',

  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }), dislikeCard);

cards.delete('/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  deleteCard);

module.exports = cards;
