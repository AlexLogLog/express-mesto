const CardSchema = require('../models/card');

module.exports.likeCard = (req, res) => {
  CardSchema.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id }, new: true, runValidators: true })
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Нет карточки с таким id' });
      }
      return res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400).send({ message: error.message });
      } else {
        res.status(500).send({ message: error.message });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  CardSchema.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id }, new: true, runValidators: true })
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Нет карточки с таким id' });
      }
      return res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400).send({ message: error.message });
      } else {
        res.status(500).send({ message: error.message });
      }
    });
};

module.exports.getCards = (req, res) => {
  CardSchema.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.newCard = (req, res) => {
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
};

module.exports.getCardId = (req, res) => {
  CardSchema.findById(req.params.userId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Нет карточки с таким id' });
      }
      return res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400).send({ message: error.message });
      } else {
        res.status(500).send({ message: error.message });
      }
    });
};
