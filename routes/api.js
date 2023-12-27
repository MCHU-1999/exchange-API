const express = require('express');
var router = express.Router();


var getAccountInfoRouter = require('./get-account-info');
var getContractRouter = require('./get-contract');
var getMarkPriceRouter = require('./get-mark-price');
var getTickerRouter = require('./get-ticker');
var getTickersRouter = require('./get-tickers');
var getBalanceRouter = require('./get-balance');
var getPositionRouter = require('./get-position');
var getAllPositionRouter = require('./get-all-position');
var getOpenOrdersRouter = require('./get-open-orders');
var getAllOpenOrdersRouter = require('./get-all-open-orders');
var getOrderHistoryRouter = require('./get-order-history');
var getAllOrderHistoryRouter = require('./get-all-order-history');
var setDualSidePositionRouter = require('./set-dual-side-position');
var setMarginRouter = require('./set-margin-mode');
var setLeverageRouter = require('./set-leverage');
var placeOrderRouter = require('./place-order');
var cancelOrderRouter = require('./cancel-order');
var cancelAllOrderRouter = require('./cancel-all-order');


// --------------------------------------------------------------------------------------------------------
// Set router (sub-level)
// --------------------------------------------------------------------------------------------------------

router.use('/getAccountInfo', getAccountInfoRouter);
router.use('/getContract', getContractRouter);
router.use('/getMarkPrice', getMarkPriceRouter);
router.use('/getTicker', getTickerRouter);
router.use('/getTickers', getTickersRouter);
router.use('/getBalance', getBalanceRouter);
router.use('/getPosition', getPositionRouter);
router.use('/getAllPosition', getAllPositionRouter);
router.use('/getOpenOrders', getOpenOrdersRouter);
router.use('/getAllOpenOrders', getAllOpenOrdersRouter);
router.use('/getOrderHistory', getOrderHistoryRouter);
router.use('/getAllOrderHistory', getAllOrderHistoryRouter);
router.use('/setDualSidePosition', setDualSidePositionRouter);
router.use('/setMarginMode', setMarginRouter);
router.use('/setLeverage', setLeverageRouter);
router.use('/placeOrder', placeOrderRouter);
router.use('/cancelOrder', cancelOrderRouter);
router.use('/cancelAllOrder', cancelAllOrderRouter);


// --------------------------------------------------------------------------------------------------------


module.exports = router;