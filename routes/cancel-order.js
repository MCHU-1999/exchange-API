const express = require('express');
var router = express.Router();
const bitgetApi = require("../bitget-node-sdk-api/build");
const binanceApi = require("../binance");
const bybitApi = require("../bybit-api");
const requestUtils_1 = require("../binance/lib/util/requestUtils");
require("dotenv").config();


const wrongPasswordMsg = "Invalid Password!";
const tokenTweetsPassword = process.env.PASSWORD;

// --------------------------------------------------------------------------------------------------------
// Cancel ONE order
// --------------------------------------------------------------------------------------------------------

router.post('/bitget', async function (req, res) {
    try{
        const exchange = req.header('exchange');
        const apiKey = req.header('apiKey');
        const apiSecret = req.header('apiSecret');
        const passphrase = req.header('passphrase');
        const password = req.header('password');
    
    //--PARAMETER--
        const symbol = req.body.symbol.toUpperCase();
        const orderId = req.body.orderId;
    // ------------
    
        if(password != tokenTweetsPassword){
            res.status(417).send({
                status: 'error',
                msg: wrongPasswordMsg
            });
            res.end();
        }else{
            const bitgetAccount = new bitgetApi.MixOrderApi(apiKey, apiSecret, passphrase);
            resData = await bitgetAccount.cancelOrder({
                'symbol': symbol+'_UMCBL',
                'orderId': String(orderId),
                'marginCoin': 'USDT'
            });
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
    
    //--PARAMETER--
        const symbol = req.body.symbol.toUpperCase();
        const orderId = req.body.orderId;
        const clientOrderId = req.body.clientOrderId;
    // ------------

        var orderData = {
            'symbol': symbol,
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
                orderData['origClientOrderId'] = idPrefix+'_'+clientOrderId;
            }
            if(orderId!==undefined){
                orderData['orderId'] = orderId;
            }
            resData = await binanceAccount.cancelOrder(orderData);
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
    
    //--PARAMETER--
        const symbol = req.body.symbol.toUpperCase();
        const orderId = req.body.orderId;
        const clientOrderId = req.body.clientOrderId;
    // ------------
        
        if(password != tokenTweetsPassword){
            res.status(417).send({
                status: 'error',
                msg: wrongPasswordMsg
            });
            res.end();
        }else{
            const bybitAccount = new bybitApi.ContractClient({'key':apiKey,'secret': apiSecret});
            resData = await bybitAccount.cancelOrder({
                'symbol': symbol,
                'orderId': orderId,
                'orderLinkId': clientOrderId
            });
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