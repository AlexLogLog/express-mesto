const cards = require('express').Router();
const CardSchema = require('../models/card');

cards.get('/cards', (req, res) => {
  CardSchema.find({})
    .then((card) => res.status(200).send(card))
    .catch((error) => res.status(500).send({ message: error.message }));
});

cards.post('/cards', (req, res) => {
  const { name, link } = req.body;
  CardSchema.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: error.message });
      } else {
        res.status(500).send({ message: error.message });
      }
    });
});

cards.get('/cards/:userId', (req, res) => {
  CardSchema.findById(req.params.userId)
    .then((card) => res.status(200).send(card))
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Нет карточки с таким id' });
      }
      return res.status(200).send(card);
    })
    .catch((error) => res.status(500).send({ message: error.message }));
});

cards.put('/cards/:cardId/likes', (req, res) => {
  CardSchema.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id }, new: true, runValidators: true })
    .then((card) => res.status(200).send(card))
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Нет карточки с таким id' });
      }
      return res.status(200).send(card);
    })
    .catch((error) => res.status(500).send({ message: error.message }));
});

cards.delete('/cards/:cardId/likes', (req, res) => {
  CardSchema.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id }, new: true, runValidators: true })
    .then((card) => res.status(200).send(card))
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Нет карточки с таким id' });
      }
      return res.status(200).send(card);
    })
    .catch((error) => res.status(500).send({ message: error.message }));
});

module.exports = cards;
