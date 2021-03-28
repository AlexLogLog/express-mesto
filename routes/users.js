const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');
const {
  getUsers,
  getUserMe,
  patchUserInfo,
  patchUserAvatar,

} = require('../controlles/users');

users.get('/', getUsers);

users.get('/me', getUserMe);

users.patch('/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(40),
      about: Joi.string().required().min(2).max(200),
    }),
  }),
  patchUserInfo);

users.patch('/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom((value, helpers) => {
        if (!isURL(value)) return helpers.error('Не корректный email');
        return value;
      }),
    }),
  }),
  patchUserAvatar);

module.exports = users;
