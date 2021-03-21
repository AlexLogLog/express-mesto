const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, CelebrateError } = require('celebrate');
const cors = require('cors');
const BadRequestError = require('./errors/BadRequestError');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const users = require('./routes/users.js');
const cards = require('./routes/cards.js');
const auth = require('./middlewares/auth');
const {
  newUser,
  login,
} = require('./controlles/users');

const { PORT = 3000 } = process.env;

const app = express();

const options = {
  origin: [
    'http://localhost:8080',
    'https://domainname.students.nomoredomains.icu',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use('*', cors(options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Массив разешённых доменов
const allowedCors = [
  'https://domainname.students.nomoredomains.icu',
  'http://domainname.students.nomoredomains.icu',
  'http://localhost:3000',
];

app.use((req, res, next) => {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');

  next();
});

const userValidate = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
};

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);

app.post('/signin', celebrate(userValidate), login);
app.post('/signup', celebrate(userValidate), newUser);
app.use('/', auth, users);
app.use('/', auth, cards);

app.use(errorLogger);

app.all('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use((err, req, res, next) => {
  let error = err;
  if (error instanceof CelebrateError) error = new BadRequestError();
  const { statusCode = 500, message } = error;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
