const express = require('express');
var router = express.Router();
const bitgetApi = require("../bitget-node-sdk-api/build");
const binanceApi = require("../binance");
const bybitApi = require("../bybit-api");
const requestUtils_1 = require("../node_modules/binance/lib/util/requestUtils");
require("dotenv").config();


const wrongPasswordMsg = "Invalid Password!";
const tokenTweetsPassword = process.env.PASSWORD;

// --------------------------------------------------------------------------------------------------------
// Place ONE order
// --------------------------------------------------------------------------------------------------------

router.post('/bitget', async function (req, res) {
    try{
        const exchange = req.header('exchange');
        const apiKey = req.header('apiKey');
        const apiSecret = req.header('apiSecret');
        const passphrase = req.header('passphrase');
        const password = req.header('password');
    
    //--MANDATORY--
        const symbol = req.body.symbol.toUpperCase();
        const positionSize = req.body.positionSize;
        const price = req.body.price;
        const action = req.body.action.toLowerCase();
        const side = req.body.side.toLowerCase();
        const orderType = req.body.orderType.toLowerCase();
    // ------------
    //--OPTIONAL---
        const timeInForce = req.body.timeInForce;
        const clientOrderId = req.body.clientOrderId;
        const reduceOnly = req.body.reduceOnly
        const presetTakeProfitPrice = req.body.presetTakeProfitPrice
        const presetStopLossPrice = req.body.presetStopLossPrice
    // ------------
        const marginCoin = req.body.marginCoin == undefined ? 'USDT' : req.body.marginCoin;

        var orderData = {
            'symbol': symbol+'_UMCBL',
            'marginCoin': marginCoin,               //USDT
            'size': positionSize, 
            'price': price,
            'side': action+'_'+side,                //open_long, open_short, close_long, close_short, buy_single, sell_single
            'orderType': orderType,                 //limit, market  
            'timeInForceValue': timeInForce,        //normal, post_only, fok, ioc
            'clientOid': clientOrderId,
            'reduceOnly': reduceOnly,
            'presetTakeProfitPrice': presetTakeProfitPrice,
            'presetStopLossPrice': presetStopLossPrice
        }
    
        if(password != tokenTweetsPassword){
            res.status(417).send({
                status: 'error',
                msg: wrongPasswordMsg
            });
            res.end();
        }else{
            const bitgetAccount = new bitgetApi.MixOrderApi(apiKey, apiSecret, passphrase);
            resData = await bitgetAccount.placeOrder(orderData);
            if(resData['msg'] != 'success'){
                res.status(417).send({
                    status: 'error',
                    msg: resData['msg']
                });
                res.end();
            }else{
                res.status(200).send({
                    status: 'success',
                    data: {
                        orderId: resData['data']['orderId'],
                        clientOrderId: resData['data']['clientOId']
                    }
                });
                res.end();
            }
        }
    }catch(errorMsg){
        res.status(417).send({
            status: 'error',
            msg: errorMsg
        });
        res.end();
    }
});


router.post('/binance', async function (req, res) {
    try{
        const exchange = req.header('exchange');
        const apiKey = req.header('apiKey');
        const apiSecret = req.header('apiSecret');
        const password = req.header('password');
    
    //--MANDATORY--
        const symbol = req.body.symbol.toUpperCase();
        const positionSize = req.body.positionSize;
        const price = req.body.price;
        const action = req.body.action.toLowerCase();
        const side = req.body.side.toLowerCase();
        const orderType = req.body.orderType.toLowerCase();
    // ------------
    //--OPTIONAL---
        const timeInForce = req.body.timeInForce==undefined ? 'GTC' : req.body.timeInForce;
        const clientOrderId = req.body.clientOrderId;
        const reduceOnly = req.body.reduceOnly  //Cannot be sent in Hedge Mode
    // ------------
        var orderData = {
            'symbol': symbol,
            'quantity': positionSize,
            'price': price,
            'side': undefined,  
            'type': undefined,                      //LIMIT, MARKET, STOP/TAKE_PROFIT, STOP_MARKET/TAKE_PROFIT_MARKET, TRAILING_STOP_MARKET
            'positionSide': undefined,
        };
        if((action=='open')&&(side=='long')){
            orderData['side']='BUY';
            orderData['positionSide']='LONG';
        }else if((action=='open')&&(side=='short')){
            orderData['side']='SELL';
            orderData['positionSide']='SHORT';
        }else if((action=='close')&&(side=='long')){
            orderData['side']='SELL';
            orderData['positionSide']='LONG';
        }else if((action=='close')&&(side=='short')){
            orderData['side']='BUY';
            orderData['positionSide']='SHORT';
        }else{
            res.status(417).send({
                status: 'error',
                msg: 'Invalid action or side, action should be either [open] or [close], side should be either [long] or [short].'
            });
            res.end();
        }
        if(orderType=='market'){
            orderData['type'] = 'MARKET';
        }else if(orderType=='limit'){
            orderData['type'] = 'LIMIT';
            orderData['timeInForce'] = timeInForce;
        }else{
            res.status(417).send({
                status: 'error',
                msg: 'Invalid orderType, it should be either [market] or [limit].'
            });
            res.end();
        }
        
        if(password != tokenTweetsPassword){
            res.status(417).send({
                status: 'error',
                msg: wrongPasswordMsg
            });
            res.end();
        }else{
            const binanceAccount = new binanceApi.USDMClient({'api_key':apiKey,'api_secret': apiSecret});
            if((clientOrderId != undefined)&&(clientOrderId != null)){
                const idPrefix = 'x-'+requestUtils_1.getOrderIdPrefix(binanceAccount.clientId);
                orderData['newClientOrderId'] = idPrefix+'_'+clientOrderId;
            }
            resData = await binanceAccount.submitNewOrder(orderData);
            res.status(200).send({
                status: 'success',
                data: {
                    orderId: resData['orderId'],
                    clientOrderId: resData['clientOrderId']
                }
            });
            res.end();
        }    
    }catch(errorMsg){
        res.status(417).send({
            status: 'error',
            msg: errorMsg
        });
        res.end();
    }  
});


router.post('/bybit', async function (req, res) {
    try{
        const exchange = req.header('exchange');
        const apiKey = req.header('apiKey');
        const apiSecret = req.header('apiSecret');
        const password = req.header('password');
    
    //--MANDATORY--
        const symbol = req.body.symbol.toUpperCase();
        const positionSize = req.body.positionSize;
        const price = req.body.price;
        const action = req.body.action.toLowerCase();
        const side = req.body.side.toLowerCase();
        const orderType = req.body.orderType.toLowerCase();
    // ------------
    //--OPTIONAL---
        const timeInForce = req.body.timeInForce == undefined ? "GoodTillCancel" : req.body.timeInForce;
        const clientOrderId = req.body.clientOrderId;
        const reduceOnly = req.body.reduceOnly
        const presetTakeProfitPrice = req.body.presetTakeProfitPrice
        const presetStopLossPrice = req.body.presetStopLossPrice
    // ------------
        var orderData = {
            'symbol': symbol,
            'qty': String(positionSize),
            'price': String(price),
            'side': undefined,  
            'orderType': undefined,
            'positionIdx': undefined,       //positionSide 0 = oneway, 1 = long side, 2 = short side.
            'orderLinkId': clientOrderId,
            'takeProfit': presetTakeProfitPrice==undefined ? undefined : String(presetTakeProfitPrice),
            'stopLosss': presetStopLossPrice==undefined ? undefined : String(presetStopLossPrice),
            'timeInForce': timeInForce,
            'reduceOnly': reduceOnly == undefined ? undefined : reduceOnly
        };
        if((action=='open')&&(side=='long')){
            orderData['side']='Buy';
            orderData['positionIdx']= 1;
        }else if((action=='open')&&(side=='short')){
            orderData['side']='Sell';
            orderData['positionIdx']= 2;
        }else if((action=='close')&&(side=='long')){
            orderData['side']='Sell';
            orderData['positionIdx']= 1;
        }else if((action=='close')&&(side=='short')){
            orderData['side']='Buy';
            orderData['positionIdx']= 2;
        }else{
            res.status(417).send({
                status: 'error',
                msg: 'Invalid action or side, action should be either [open] or [close], side should be either [long] or [short].'
            });
            res.end();
        }
        if(orderType=='market'){
            orderData['orderType'] = 'Market';
        }else if(orderType=='limit'){
            orderData['orderType'] = 'Limit';
        }else{
            res.status(417).send({
                status: 'error',
                msg: 'Invalid orderType, it should be either [market] or [limit].'
            });
            res.end();
        }
        
        if(password != tokenTweetsPassword){
            res.status(417).send({
                status: 'error',
                msg: wrongPasswordMsg
            });
            res.end();
        }else{
            const bybitAccount = new bybitApi.ContractClient({'key':apiKey,'secret': apiSecret});
            resData = await bybitAccount.submitOrder(orderData);
            if(resData['retMsg'] != 'OK'){
                res.status(417).send({
                    status: 'error',
                    msg: resData['retMsg']
                });
                res.end();
            }else{
                res.status(200).send({
                    status: 'success',
                    data: {
                        orderId: resData['result']['orderId'],
                        clientOrderId: resData['result']['orderLinkId']
                    }
                });
                res.end();
            }
        }
    }catch(errorMsg){
        res.status(417).send({
            status: 'error',
            msg: errorMsg
        });
        res.end();
    }
});


module.exports = router;