const express = require('express');
const router = express.Router();

const validator = require('./validator');
const routeHandler = require('./routeHandler');



router.post('/signup', validator.signup, routeHandler.signup);
router.post('/login', validator.login, routeHandler.login);
router.post('/addStocks', validator.addStocks, routeHandler.addStocks);
router.put('/trade', validator.putTrade, routeHandler.putTrade);
router.patch('/trade', validator.updateTrade, routeHandler.updateTrade);
router.delete('/trade', validator.deleteTrade, routeHandler.deleteTrade);
router.get('/portfolio', validator.getPortfolio, routeHandler.getPortfolio);
router.get('/portfolio/holding', validator.getHolding, routeHandler.getHolding);
router.get('/portfolio/returns', validator.getReturns, routeHandler.getReturns);

module.exports = router;