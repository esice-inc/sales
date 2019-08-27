const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    /*
    let contacts;

    try {
      contacts = db.contacts.all();
    } catch (error) {
      res.status(500).send(error);
    }

    res.send(contacts);
    */
  });

  router.get('/:contactId', (req, res) => {});

  return router;
}
