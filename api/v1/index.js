const express = require('express');

const middlewares = require('./middlewares');
const contactsAPI = require('./contacts');
const organizationsAPI = require('./organizations');
const salesAPI = require('./sales');

const app = express();

app.use(express.json());
// app.use(middlewares.<something>)

module.exports = (db) => {

  app.use('/v1/contacts', contactsAPI(db));
  app.use('/v1/organizations', organizationsAPI(db));
  app.use('/v1/sales', salesAPI(db));

  app.disable('x-powered-by')

  return app;
};
