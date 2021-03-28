const cards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');
const {
  likeCard,
  dislikeCard,
  getCards,
  newCard,
  deleteCard,
} = require('../controlles/cards');

cards.get('/', getCards);

cards.post('/',
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

cards.put('/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  likeCard);

cards.delete('/:cardId/likes',

  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }), dislikeCard);

cards.delete('/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  deleteCard);

module.exports = cards;
