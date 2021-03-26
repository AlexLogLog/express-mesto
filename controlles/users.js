const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserSchema = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const { JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  UserSchema.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  UserSchema.findById(req.user._id)
    .orFail(new NotFoundError())
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.newUser = async (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const userNew = await UserSchema.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
    return res.status(200).send({
      name: userNew.name, about: userNew.about, avatar: userNew.avatar, email: userNew.email,
    })
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      return next(new ConflictError('Пользователь с данным email уже есть'));
    } else return next(err);
  };
};

module.exports.patchUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  UserSchema.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError())
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.patchUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  UserSchema.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError())
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  UserSchema.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.status(200).send({ token });
    })
    .catch(() => next(new UnauthorizedError('Неверный email или пароль')));
};
