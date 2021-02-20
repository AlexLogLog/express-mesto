const users = require('express').Router();
const path = require('path');
const getFile = require('../helpers/fileRead');

const usersPath = path.join(__dirname, '..', 'data', 'users.json');

users.get('/users', (req, res) => {
  getFile(usersPath)
    .then((usersList) => res.status(200).send(usersList))
    .catch((error) => res.status(500).send({ message: error.message }));
});

users.get('/users/:id', (req, res) => {
  getFile(usersPath)
    .then((userList) => userList.find((user) => user._id === req.params.id))
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      return res.status(200).send(user);
    })
    .catch((error) => res.status(500).send({ message: error.message }));
});

module.exports = users;
