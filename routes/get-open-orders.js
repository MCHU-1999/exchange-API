const express = require('express');
var router = express.Router();
const bitgetApi = require("../bitget-node-sdk-api/build");
const binanceApi = require("../binance");
const bybitApi = require("../bybit-api");
require("dotenv").config();


const wrongPasswordMsg = "Invalid Password!";
const tokenTweetsPassword = process.env.PASSWORD;

// --------------------------------------------------------------------------------------------------------
// Get open orders in specific symbol
// --------------------------------------------------------------------------------------------------------

router.post('/bitget', async function (req, res) {
    try{
        const exchange = req.header('exchange');
        const apiKey = req.header('apiKey');
        const apiSecret = req.header('apiSecret');
        const passphrase = req.header('passphrase');
        const password = req.header('password');

        const symbol = req.body.symbol.toUpperCase();
        var order = [];

        if(password != tokenTweetsPassword){
            res.status(417).send({
                status: 'error',
                msg: wrongPasswordMsg
            });
            res.end();
        }else{
            const bitgetAccount = new bitgetApi.MixOrderApi(apiKey, apiSecret, passphrase);
            resData = await bitgetAccount.current(symbol+'_UMCBL');
            // console.log(resData);
            if(resData['msg'] != 'success'){
                res.status(417).send({
                    status: 'error',
                    msg: resData['msg']
                });
                res.end();
            }else{
                for(let i=0; i<resData['data'].length ; i++){
                    order.push({
                        symbol: resData['data'][i]['symbol'].split('_UMCBL')[0],
                        orderId: resData['data'][i]['orderId'],
                        clientOrderId: resData['data'][i]['clientOid'],
                        orderType: resData['data'][i]['orderType'],
                        side: resData['data'][i]['posSide'],
                        action: resData['data'][i]['side'].split('_')[0],
                        price: parseFloat(resData['data'][i]['price']),
                        timeInForce: resData['data'][i]['timeInForce'],
                        reduceOnly: resData['data'][i]['reduceOnly'],
                        // closePosition: resData.data[i]['closePosition'],
                        orderStatus: resData['data'][i]['state'],

                        createdTime: resData.data[i]['cTime'],
                        updatedTime: resData.data[i]['uTime'],

                        qty: parseFloat(resData['data'][i]['size']),
                        filledQty: parseFloat(resData['data'][i]['filledQty']),
                        filledValue: parseFloat(resData['data'][i]['filledAmount']),
                        presetTakeProfitPrice: parseFloat(resData['data'][i]['presetTakeProfitPrice']),
                        presetStopLossPrice: parseFloat(resData['data'][i]['presetStopLossPrice']),
                    });
                }
                order.sort(function(x, y){ return y.updatedTime - x.updatedTime; });
                res.status(200).send({
                    status: 'success',
                    data: order
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

        const symbol = req.body.symbol.toUpperCase();
        var order = [];
        var action = undefined;
        var side = undefined;

        if(password != tokenTweetsPassword){
            res.status(417).send({
                status: 'error',
                msg: wrongPasswordMsg
            });
            res.end();
        }else{
            const binanceAccount = new binanceApi.USDMClient({'api_key':apiKey,'api_secret': apiSecret});
            resData = await binanceAccount.getAllOpenOrders({ symbol: symbol });
            // console.log(resData);
            for(let i=0; i<resData.length ; i++){
                if (resData[i]['positionSide'] === 'LONG') {        //long side
                    side = 'long';
                    if (resData[i]['side'] === 'BUY') {
                        action = 'open';
                    }else{
                        action = 'close';
                    }
                } else if (resData[i]['positionSide'] === 'SHORT') { //short side
                    side = 'short';
                    if (resData[i]['side'] === 'SELL') {
                        action = 'open';
                    }else{
                        action = 'close';
                    }
                }
                order.push({
                    symbol: resData[i]['symbol'],
                    orderId: String(resData[i]['orderId']),
                    clientOrderId: resData[i]['clientOrderId'],
                    orderType: resData[i]['type'].toLowerCase(),
                    side: side,
                    action: action,
                    price: parseFloat(resData[i]['price']),
                    timeInForce: resData[i]['timeInForce'],
                    reduceOnly: resData[i]['reduceOnly'],
                    closePosition: resData[i]['closePosition'],
                    orderStatus: resData[i]['status'].toLowerCase(),

                    createdTime: resData[i]['time'],
                    updatedTime: resData[i]['updateTime'],

                    qty: parseFloat(resData[i]['origQty']),
                    filledQty: parseFloat(resData[i]['executedQty']),
                    filledValue: parseFloat(resData[i]['cumQuote']),
                    // presetTakeProfitPrice: 
                    // presetStopLossPrice: 
                });
            }
            order.sort(function(x, y){ return y.updatedTime - x.updatedTime; });
            res.status(200).send({
                status: 'success',
                data: order
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

        const symbol = req.body.symbol.toUpperCase();
        const orderId = req.body.orderId;
        const clientOrderId = req.body.clientOrderId;
        const orderFilter = req.body.orderFilter;
        const cursor = req.body.cursor;
        
        var order = [];
        var action = undefined;
        var side = undefined;

        if(password != tokenTweetsPassword){
            res.status(417).send({
                status: 'error',
                msg: wrongPasswordMsg
            });
            res.end();
        }else{
            const bybitAccount = new bybitApi.ContractClient({'key':apiKey,'secret': apiSecret});
            resData = await bybitAccount.getHistoricOrders({
                symbol: symbol,
                orderId: orderId,
                orderLinkId: clientOrderId,
                orderStatus: 'New',
                orderFilter: orderFilter,
                limit: 50,
                cursor: cursor,
            });
            // console.log(resData.result.list);
            if(resData['retMsg'] != 'OK'){
                res.status(417).send({
                    status: 'error',
                    msg: resData['retMsg']
                });
                res.end();
            }else{
                for(let i=0; i<resData['result']['list'].length ; i++){
                    if (resData['result']['list'][i]['positionIdx'] === 1) {        //long side
                        side = 'long';
                        if (resData['result']['list'][i]['side'] === 'Buy') {
                            action = 'open';
                        }else{
                            action = 'close';
                        }
                    } else if (resData['result']['list'][i]['positionIdx'] === 2) { //short side
                        side = 'short';
                        if (resData['result']['list'][i]['side'] === 'Sell') {
                            action = 'open';
                        }else{
                            action = 'close';
                        }
                    }
                    order.push({
                        symbol: resData['result']['list'][i]['symbol'],
                        orderId: resData['result']['list'][i]['orderId'],
                        clientOrderId: resData['result']['list'][i]['orderLinkId'],
                        orderType: resData['result']['list'][i]['orderType'].toLowerCase(),
                        side: side,
                        action: action,
                        price: parseFloat(resData['result']['list'][i]['price']),
                        timeInForce: resData['result']['list'][i]['timeInForce'],
                        reduceOnly: resData['result']['list'][i]['reduceOnly'],
                        closePosition: resData['result']['list'][i]['closeOnTrigger'],
                        orderStatus: resData['result']['list'][i]['orderStatus'].toLowerCase(),

                        createdTime: resData['result']['list'][i]['createdTime'],
                        updatedTime: resData['result']['list'][i]['updatedTime'],

                        qty: parseFloat(resData['result']['list'][i]['qty']),
                        filledQty: parseFloat(resData['result']['list'][i]['cumExecQty']),
                        filledValue: parseFloat(resData['result']['list'][i]['cumExecValue']),
                        
                        //below parameters are BYBIT ONLY:
                        presetTakeProfitPrice: resData['result']['list'][i]['takeProfit'],
                        presetStopLossPrice: resData['result']['list'][i]['stopLoss'],
                        // triggerPrice: resData['result']['list'][i]['triggerPrice'],
                    });
                }
                order.sort(function(x, y){ return y.updatedTime - x.updatedTime; });
                res.status(200).send({
                    status: 'success',
                    data: order,
                    cursor: resData.result.nextPageCursor,
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