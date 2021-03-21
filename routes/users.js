const users = require('express').Router();
const {
  getUsers,
  getUserMe,
  patchUserInfo,
  patchUserAvatar,

} = require('../controlles/users');

users.get('/users', getUsers);

users.get('/users/me', getUserMe);

users.patch('/users/me', patchUserInfo);

users.patch('/users/me/avatar', patchUserAvatar);

module.exports = users;
