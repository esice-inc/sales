const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  router.get('/', (req, res) => {});
  router.get('/:saleId', (req, res) => {});
  router.get('/:saleId', () => {});
  router.get('/:saleId/quotations', () => {});
  router.get('/:saleId/quotations/:quotationId', () => {});
  router.get('/:saleId/orders', () => {});
  router.get('/:saleId/orders/:orderId', () => {});
  router.get('/:saleId/deliveries', () => {});
  router.get('/:saleId/deliveries/:deliveryId', () => {});

  return router;
}
