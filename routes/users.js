const users = require('express').Router();
const UserSchema = require('../models/user');

users.get('/users', (req, res) => {
  UserSchema.find({})
    .then((usersall) => res.status(200).send(usersall))
    .catch((error) => res.status(500).send({ message: error.message }));
});

users.get('/users/:userId', (req, res) => {
  UserSchema.findById(req.params.userId)
    .then((user) => res.status(200).send(user))
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      return res.status(200).send(user);
    })
    .catch((error) => res.status(500).send({ message: error.message }));
});

users.post('/users', (req, res) => {
  const { name, about, avatar } = req.body;
  UserSchema.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: error.message });
      } else {
        res.status(500).send({ message: error.message });
      }
    });
});

users.patch('/users/me', (req, res) => {
  const { name, about } = req.body;
  UserSchema.findOneAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((error) => res.status(500).send({ message: error.message }));
});

users.patch('/users/me/avatar', (req, res) => {
  const { avatar } = req.body;
  UserSchema.findOneAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((error) => res.status(500).send({ message: error.message }));
});

module.exports = users;
