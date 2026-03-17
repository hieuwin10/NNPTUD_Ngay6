var express = require('express');
var router = express.Router();
let inventoryController = require('../controllers/inventory');

router.get('/', inventoryController.getAll);
router.get('/:id', inventoryController.getById);
router.post('/add-stock', inventoryController.addStock);
router.post('/remove-stock', inventoryController.removeStock);
router.post('/reservation', inventoryController.reservation);
router.post('/sold', inventoryController.sold);

module.exports = router;
