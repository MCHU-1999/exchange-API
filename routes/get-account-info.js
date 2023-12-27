const express = require('express');
var router = express.Router();
const bitgetApi = require("../bitget-node-sdk-api/build");
const binanceApi = require("../binance");
const bybitApi = require("../bybit-api");
require("dotenv").config();


const wrongPasswordMsg = "Invalid Password!";
const tokenTweetsPassword = process.env.PASSWORD;

// --------------------------------------------------------------------------------------------------------
// Get current leverage & margin mode on a specific symbol
// --------------------------------------------------------------------------------------------------------

router.post('/bitget', async function (req, res) {
    try{
        const exchange = req.header('exchange');
        const apiKey = req.header('apiKey');
        const apiSecret = req.header('apiSecret');
        const passphrase = req.header('passphrase');
        const password = req.header('password');

        const symbol = req.body.symbol.toUpperCase();
        const marginCoin = "USDT"

        if(password != tokenTweetsPassword){
            res.status(417).send({
                status: 'error',
                msg: wrongPasswordMsg
            });
            res.end();
        }else{
            const bitgetAccount = new bitgetApi.MixAccountApi(apiKey, apiSecret, passphrase);
            resData = await bitgetAccount.account(symbol+'_UMCBL', marginCoin);
            if(resData['msg'] != 'success'){
                res.status(417).send({
                    status: 'error',
                    msg: resData['msg']
                });
                res.end();
            }else{
                let mMode = resData['data']['marginMode'];
                res.status(200).send({
                    status: 'success',
                    data: {
                        symbol: symbol,
                        dualSidePosition: resData['data']['holdMode']==='double_hold' ? true : false,
                        marginMode: mMode === 'crossed' ? 'cross' : 'isolated',
                        leverage: resData['data']['crossMarginLeverage'],
                        longLeverage: mMode === 'crossed' ? null : resData['data']['fixedLongLeverage'],
                        shortLeverage: mMode === 'crossed' ? null : resData['data']['fixedShortLeverage'],
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

        const symbol = req.body.symbol.toUpperCase();
        var data = [];
        var dualSidePosition;
        var marginMode;
        var leverage = null, longLeverage = null, shortLeverage = null;

        
        if(password != tokenTweetsPassword){
            res.status(417).send({
                status: 'error',
                msg: wrongPasswordMsg
            });
            res.end();
        }else{
            const binanceAccount = new binanceApi.USDMClient({'api_key':apiKey,'api_secret': apiSecret});
            resData = await binanceAccount.getAccountInformation();

            for(let i=0; i<resData['positions'].length; i++){
                if(resData['positions'][i]['symbol'] === symbol){
                    data.push(resData['positions'][i]);
                }
            }
            if(data.length === 1){      //means you are in one-way mode.
                if(resData['positions'][0]['isolated'] === false){      //means you are using cross margin.
                    dualSidePosition = false;
                    marginMode = 'cross';
                    leverage = parseInt(resData['positions'][0]['leverage']);
                } else {
                    dualSidePosition = false;
                    marginMode = 'isolated';
                    leverage = parseInt(resData['positions'][0]['leverage']);
                }
            } else {        //means you are in hedge mode.
                if(resData['positions'][0]['isolated'] === false){      //means you are using cross margin.
                    dualSidePosition = true;
                    marginMode = 'cross';
                    longLeverage = parseInt(resData['positions'][0]['leverage']);
                    shortLeverage = parseInt(resData['positions'][1]['leverage']);
                } else {
                    dualSidePosition = false;
                    marginMode = 'isolated';
                    longLeverage = parseInt(resData['positions'][0]['leverage']);
                    shortLeverage = parseInt(resData['positions'][1]['leverage']);
                }
            }
            res.status(200).send({
                status: 'success',
                data: {
                    symbol: symbol,
                    dualSidePosition: dualSidePosition,
                    marginMode: marginMode,
                    leverage: leverage,
                    longLeverage: longLeverage,
                    shortLeverage: shortLeverage,
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

        const symbol = req.body.symbol;
        var data = [];
        var dualSidePosition;
        var marginMode;
        var leverage = null, longLeverage = null, shortLeverage = null;

        if(password != tokenTweetsPassword){
            res.status(417).send({
                status: 'error',
                msg: wrongPasswordMsg
            });
            res.end();
        }else{
            const bybitAccount = new bybitApi.ContractClient({'key':apiKey,'secret': apiSecret});
            resData = await bybitAccount.getPositions({symbol: symbol, settleCoin:'USDT'});
            if(resData['retMsg'] != 'OK'){
                res.status(417).send({
                    status: 'error',
                    msg: resData['retMsg']
                });
                res.end();
            }else{
                for(let i=0; i<resData['result']['list'].length ; i++){
                    if(resData['result']['list'][i]['symbol'] === symbol){
                        data.push(resData['result']['list'][i]);
                    }
                }
                if(data.length === 1){      //means you are in one-way mode.
                    if(resData['result']['list'][0]['tradeMode'] === 0){      //means you are using cross margin.
                        dualSidePosition = false;
                        marginMode = 'cross';
                        leverage = parseInt(resData['result']['list'][0]['leverage']);
                    } else {
                        dualSidePosition = false;
                        marginMode = 'isolated';
                        leverage = parseInt(resData['result']['list'][0]['leverage']);
                    }
                } else {        //means you are in hedge mode.
                    if(resData['result']['list'][0]['tradeMode'] === 0){      //means you are using cross margin.
                        dualSidePosition = true;
                        marginMode = 'cross';
                        longLeverage = parseInt(resData['result']['list'][0]['leverage']);
                        shortLeverage = parseInt(resData['result']['list'][1]['leverage']);
                    } else {
                        dualSidePosition = true;
                        marginMode = 'isolated';
                        longLeverage = parseInt(resData['result']['list'][0]['leverage']);
                        shortLeverage = parseInt(resData['result']['list'][1]['leverage']);
                    }
                }
                res.status(200).send({
                    status: 'success',
                    data: {
                        symbol: symbol,
                        dualSidePosition: dualSidePosition,
                        marginMode: marginMode,
                        leverage: leverage,
                        longLeverage: longLeverage,
                        shortLeverage: shortLeverage,
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