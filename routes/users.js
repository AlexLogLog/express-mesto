const users = require('express').Router();
const {
  getUsers,
  getUserId,
  newUser,
  patchUserInfo,
  patchUserAvatar,

} = require('../controlles/users');

users.get('/users', getUsers);

users.get('/users/:userId', getUserId);

users.post('/users', newUser);

users.patch('/users/me', patchUserInfo);

users.patch('/users/me/avatar', patchUserAvatar);

module.exports = users;
