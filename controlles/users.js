const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserSchema = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.getUsers = (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  UserSchema.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  const { _id: userId } = req.user;
  UserSchema.findById(userId)
    .orFail(new NotFoundError())
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

module.exports.newUser = (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      UserSchema.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => res.status(200).send(user))
        .catch(next);
    });
};

module.exports.patchUserInfo = (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  const { name, about } = req.body;
  UserSchema.findOneAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError())
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

module.exports.patchUserAvatar = (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  const { avatar } = req.body;
  UserSchema.findOneAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError())
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  const { email, password } = req.body;
  UserSchema.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => next(new UnauthorizedError('Неверный email или пароль')));
};
