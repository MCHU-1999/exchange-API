const express = require('express');
var router = express.Router();
const bitgetApi = require("../bitget-node-sdk-api/build");
const binanceApi = require("../binance");
const bybitApi = require("../bybit-api");
require("dotenv").config();


const wrongPasswordMsg = "Invalid Password!";
const tokenTweetsPassword = process.env.PASSWORD;

// --------------------------------------------------------------------------------------------------------
// Set dual side position (true for hedge mode, false for one-way mode)
// --------------------------------------------------------------------------------------------------------

router.post('/bitget', async function (req, res) {
    try{
        const exchange = req.header('exchange');
        const apiKey = req.header('apiKey');
        const apiSecret = req.header('apiSecret');
        const passphrase = req.header('passphrase');
        const password = req.header('password');

        const dualSidePosition = req.body.dualSidePosition;
    
        if(password != tokenTweetsPassword){
            res.status(417).send({
                status: 'error',
                msg: wrongPasswordMsg
            });
            res.end();
        }else{
            const bitgetAccount = new bitgetApi.MixAccountApi(apiKey, apiSecret, passphrase);
            resData = await bitgetAccount.setPositionMode({
                "productType": "umcbl",
                "holdMode": dualSidePosition ? "double_hold" : "single_hold",
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
                        "dualSidePosition": resData['data']['dualSidePosition'],
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

        const dualSidePosition = req.body.dualSidePosition;
        
        if(password != tokenTweetsPassword){
            res.status(417).send({
                status: 'error',
                msg: wrongPasswordMsg
            });
            res.end();
        }else{
            const binanceAccount = new binanceApi.USDMClient({'api_key':apiKey,'api_secret': apiSecret});
            resData = await binanceAccount.setPositionMode({
                "dualSidePosition": dualSidePosition,
            });
            if(resData['msg'] == 'success'){
                res.status(200).send({
                    status: 'success',
                    data: {
                        "dualSidePosition": dualSidePosition,
                    },
                });
                res.end();
            }
        }    
    }catch(errorMsg){
        if(errorMsg['message'] == 'No need to change position side.'){
            res.status(200).send({
                status: 'success',
                data: {
                    "msg": errorMsg['message'],
                },
            });
            res.end();
        }else{
            res.status(417).send({
                status: 'error',
                msg: errorMsg
            });
            res.end();
        }
    }  
});


router.post('/bybit', async function (req, res) {
    try{
        const exchange = req.header('exchange');
        const apiKey = req.header('apiKey');
        const apiSecret = req.header('apiSecret');
        const password = req.header('password');
    
        const symbol = req.body.symbol;
        const coin = req.body.coin == undefined ? "USDT" : req.body.coin;
        const dualSidePosition = req.body.dualSidePosition;

        if(password != tokenTweetsPassword){
            res.status(417).send({
                status: 'error',
                msg: wrongPasswordMsg
            });
            res.end();
        }else{
            const bybitAccount = new bybitApi.ContractClient({'key':apiKey,'secret': apiSecret});
            resData = await bybitAccount.setPositionMode({
                "symbol": symbol,
                "coin": coin,
                "mode": dualSidePosition? 3 : 0,
            });
            if(resData['retCode'] != 0){
                res.status(417).send({
                    status: 'error',
                    msg: resData['retMsg'],
                });
                res.end();
            }else{
                res.status(200).send({
                    status: 'success',
                    data: {
                        "dualSidePosition": dualSidePosition,
                    },
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