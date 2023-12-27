const express = require('express');
var router = express.Router();
const bitgetApi = require("../bitget-node-sdk-api/build");
const binanceApi = require("../binance");
const bybitApi = require("../bybit-api");
require("dotenv").config();


const wrongPasswordMsg = "Invalid Password!";
const tokenTweetsPassword = process.env.PASSWORD;

// --------------------------------------------------------------------------------------------------------
// Set margin mode
// --------------------------------------------------------------------------------------------------------

router.post('/bitget', async function (req, res) {
    const exchange = req.header('exchange');
    const apiKey = req.header('apiKey');
    const apiSecret = req.header('apiSecret');
    const passphrase = req.header('passphrase');
    const password = req.header('password');

    const symbol = req.body.symbol;
    const marginMode = (req.body.marginMode=='cross') ? 'crossed' : (req.body.marginMode=='isolated') ? 'fixed' : req.body.marginMode;
    if(password != tokenTweetsPassword){
        res.status(417).send({
            status: 'error',
            msg: wrongPasswordMsg
        });
        res.end();
    }else{
        const bitgetAccount = new bitgetApi.MixAccountApi(apiKey, apiSecret, passphrase);
        try{
            resData = await bitgetAccount.setMarginMode({"symbol": symbol+"_UMCBL","marginCoin": "USDT","marginMode": marginMode});
            if(resData['msg'] != 'success'){
                res.status(417).send({
                    status: 'error',
                    msg: resData['msg']
                });
                res.end();
            }else{
                res.status(200).send({
                    status: 'success',
                    msg: 'Your margin mode has been set to ' + req.body.marginMode + '.'
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
    const marginMode = (req.body.marginMode=='cross') ? 'CROSSED' : (req.body.marginMode=='isolated') ? 'ISOLATED' : req.body.marginMode;

    if(password != tokenTweetsPassword){
        res.status(417).send({
            status: 'error',
            msg: wrongPasswordMsg
        });
        res.end();
    }else{
        const binanceAccount = new binanceApi.USDMClient({'api_key':apiKey,'api_secret': apiSecret});
        try{
            resData = await binanceAccount.setMarginType({"symbol": symbol, "marginType": marginMode});
            if(resData['msg']!='success'){
                //pass
            }else{
                res.status(200).send({
                    status: 'success',
                    msg: 'Your margin mode has been set to ' + req.body.marginMode + '.'
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
    const marginMode = (req.body.marginMode=='cross') ? 0 : (req.body.marginMode=='isolated') ? 1 : req.body.marginMode;
    if(password != tokenTweetsPassword){
        res.status(417).send({
            status: 'error',
            msg: wrongPasswordMsg
        });
        res.end();
    }else{
        const bybitAccount = new bybitApi.ContractClient({'key':apiKey,'secret': apiSecret});
        try{
            resData = await bybitAccount.setMarginSwitch({symbol: symbol, tradeMode: marginMode, buyLeverage: '10', sellLeverage: '10'});
            if(resData['retMsg'] == 'Isolated not modified'){
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
                    msg: 'Your margin mode has been set to ' + req.body.marginMode + '.'
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