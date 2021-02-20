const express = require('express');
const path = require('path');

const users = require('./routes/users.js');
const cards = require('./routes/cards.js');

const { PORT = 3000, BASE_PATH } = process.env;

const app = express();

app.use(express.static(path.join(__dirname, '/public')));

app.use(users);
app.use(cards);
app.all('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log('Ссылка на сервер:');
  console.log(BASE_PATH);
});
