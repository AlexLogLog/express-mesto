const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');
const {
  getUsers,
  getUserMe,
  patchUserInfo,
  patchUserAvatar,

} = require('../controlles/users');

users.get('/users', getUsers);

users.get('/users/me', getUserMe);

users.patch('/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(40),
      about: Joi.string().required().min(2).max(200),
    }),
  }),
  patchUserInfo);

users.patch('/users/me/avatar',
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
