const CardSchema = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.likeCard = (req, res, next) => {
  CardSchema.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true })
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  CardSchema.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true })
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(next);
};

module.exports.getCards = (req, res, next) => {
  CardSchema.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports.newCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id: userId } = req.user;
  CardSchema.create({ name, link, owner: userId })
    .then((card) => res.status(200).send(card))
    .catch(() => next(new BadRequestError()));
};

module.exports.getCardId = (req, res, next) => {
  CardSchema.findById(req.params.userId)
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  CardSchema.findById(cardId)
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалять чужие карточки');
      }
      card.remove()
        .then((newListCards) => res.send(newListCards));
    })
    .catch(next);
};
