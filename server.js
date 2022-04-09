const express = require('express');
const routes = require('./routes');
const { Sequelize } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server
Sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}! 🚀`);
});