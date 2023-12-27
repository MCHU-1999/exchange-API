const express = require('express');
var router = express.Router();
const bitgetApi = require("../bitget-node-sdk-api/build");
const binanceApi = require("../binance");
const bybitApi = require("../bybit-api");
require("dotenv").config();


const wrongPasswordMsg = "Invalid Password!";
const tokenTweetsPassword = process.env.PASSWORD;

// --------------------------------------------------------------------------------------------------------
// Set leverage
// --------------------------------------------------------------------------------------------------------

router.post('/bitget', async function (req, res) {
    const exchange = req.header('exchange');
    const apiKey = req.header('apiKey');
    const apiSecret = req.header('apiSecret');
    const passphrase = req.header('passphrase');
    const password = req.header('password');

    const symbol = req.body.symbol;
    const leverage = req.body.leverage;
    const holdSide = req.body.holdSide;
    if(password != tokenTweetsPassword){
        res.status(417).send({
            status: 'error',
            msg: wrongPasswordMsg
        });
        res.end();
    }else{
        const bitgetAccount = new bitgetApi.MixAccountApi(apiKey, apiSecret, passphrase);
        try{
            resData = await bitgetAccount.setLeverage({
                "symbol": symbol+"_UMCBL",
                "marginCoin": "USDT",
                "leverage": leverage,
                "holdSide": holdSide
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
                    msg: 'Your ' + (holdSide == undefined ? "" : holdSide+" ") + 'leverage has been set to ' + leverage + '.',
                    data: {
                        longLeverage: resData['data']['longLeverage'],
                        shortLeverage: resData['data']['shortLeverage']
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
    }
});


router.post('/binance', async function (req, res) {
    const exchange = req.header('exchange');
    const apiKey = req.header('apiKey');
    const apiSecret = req.header('apiSecret');
    const password = req.header('password');

    const symbol = req.body.symbol;
    const leverage = req.body.leverage;
    if(password != tokenTweetsPassword){
        res.status(417).send({
            status: 'error',
            msg: wrongPasswordMsg
        });
        res.end();
    }else{
        const binanceAccount = new binanceApi.USDMClient({'api_key':apiKey,'api_secret': apiSecret});
        try{
            resData = await binanceAccount.setLeverage({"symbol": symbol, "leverage": leverage});
            if(resData['leverage']!=leverage){
                //pass
            }else{
                res.status(200).send({
                    status: 'success',
                    msg: 'Your leverage has been set to ' + leverage + '.',
                    data: {
                        'leverage': resData['leverage']
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
    }
});


router.post('/bybit', async function (req, res) {
    const exchange = req.header('exchange');
    const apiKey = req.header('apiKey');
    const apiSecret = req.header('apiSecret');
    const password = req.header('password');

    const symbol = req.body.symbol;
    const leverage = String(req.body.leverage);
    if(password != tokenTweetsPassword){
        res.status(417).send({
            status: 'error',
            msg: wrongPasswordMsg
        });
        res.end();
    }else{
        const bybitAccount = new bybitApi.ContractClient({'key':apiKey,'secret': apiSecret});
        try{
            resData = await bybitAccount.setLeverage(symbol, leverage, leverage);
            if(resData['retMsg'] == 'leverage not modified'){
                res.status(200).send({
                    status: 'success',
                    msg: resData['retMsg']
                });
                res.end();
            }else if(resData['retMsg'] != 'OK'){
                res.status(417).send({
                    status: 'error',
                    msg: resData['retMsg']
                });
                res.end();
            }else{
                res.status(200).send({
                    status: 'success',
                    msg: 'Your leverage has been set to ' + leverage + '.',
                    data: {
                        'leverage': leverage
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
    }
});


module.exports = router;