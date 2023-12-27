const express = require('express');
var router = express.Router();
const bitgetApi = require("../bitget-node-sdk-api/build");
const binanceApi = require("../binance");
const bybitApi = require("../bybit-api");
require("dotenv").config();


const wrongPasswordMsg = "Invalid Password!";
const failedGetMsg = "Failed to get your USDT balance in contract wallet."
const tokenTweetsPassword = process.env.PASSWORD;

// --------------------------------------------------------------------------------------------------------
// Get balance (contract wallet)
// --------------------------------------------------------------------------------------------------------

router.get('/bitget', async function (req, res) {
    const exchange = req.header('exchange');
    const apiKey = req.header('apiKey');
    const apiSecret = req.header('apiSecret');
    const passphrase = req.header('passphrase');
    var hasData = false;
    const password = req.header('password');
    if(password != tokenTweetsPassword){
        res.status(417).send({
            status: 'error',
            msg: wrongPasswordMsg
        });
        res.end();
    }else{
        const bitgetAccount = new bitgetApi.MixAccountApi(apiKey, apiSecret, passphrase);
        try{
            resData = await bitgetAccount.accounts('umcbl');
            if(resData['msg'] != 'success'){
                res.status(417).send({
                    status: 'error',
                    msg: resData['msg']
                });
                res.end();
            }else{
                for(let i=0; i<resData['data'].length; i++){
                    if(resData['data'][i]['marginCoin']=='USDT'){
                        // console.log(resData['data'][i]);
                        bal = resData['data'][i]['usdtEquity'];
                        availableBal = resData['data'][i]['available'];
                        res.status(200).send({
                            status: 'success',
                            balance: bal,
                            available: availableBal,
                            coin: 'USDT'
                        });
                        res.end();
                        hasData = true;
                    }
                }
                if(hasData == false){
                    res.status(417).send({
                        status: 'error',
                        msg: failedGetMsg
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
    }
});


router.get('/binance', async function (req, res) {
    const exchange = req.header('exchange');
    const apiKey = req.header('apiKey');
    const apiSecret = req.header('apiSecret');
    var hasData = false;
    const password = req.header('password');
    if(password != tokenTweetsPassword){
        res.status(417).send({
            status: 'error',
            msg: wrongPasswordMsg
        });
        res.end();
    }else{
        const binanceAccount = new binanceApi.USDMClient({'api_key':apiKey,'api_secret': apiSecret});
        try{
            resData = await binanceAccount.getBalance();
            for(let i = 0; i< resData.length;i++){
                if (resData[i]['asset']=='USDT'){
                    // console.log(resData[i]);
                    bal = resData[i]['balance'];
                    availableBal = resData[i]['availableBalance'];
                    res.status(200).send({
                        status: 'success',
                        balance: bal,
                        available: availableBal,
                        coin: 'USDT'
                    });
                    res.end();
                    hasData = true;
                }
            }
            if(hasData == false){
                res.status(417).send({
                    status: 'error',
                    msg: failedGetMsg
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


router.get('/bybit', async function (req, res) {
    const exchange = req.header('exchange');
    const apiKey = req.header('apiKey');
    const apiSecret = req.header('apiSecret');
    var hasData = false;
    const password = req.header('password');
    if(password != tokenTweetsPassword){
        res.status(417).send({
            status: 'error',
            msg: wrongPasswordMsg
        });
        res.end();
    }else{
        const bybitAccount = new bybitApi.ContractClient({'key':apiKey,'secret': apiSecret});
        try{
            resData = await bybitAccount.getBalances('USDT');
            // console.log(resData['result']['list']);
            if(resData['retMsg'] != 'OK'){
                res.status(417).send({
                    status: 'error',
                    msg: resData['retMsg']
                });
                res.end();
            }else{
                for(let i=0; i<resData['result']['list'].length; i++){
                    if(resData['result']['list'][i]['coin'] == 'USDT'){
                        // console.log(resData['result']['list'][i]);
                        bal = resData['result']['list'][i]['walletBalance'];
                        availableBal = resData['result']['list'][i]['availableBalance']; 
                        res.status(200).send({
                            status: 'success',
                            balance: bal,
                            available: availableBal,
                            coin: 'USDT'
                        });
                        res.end();
                        hasData = true;
                    }
                }
                if(hasData == false){
                    res.status(417).send({
                        status: 'error',
                        msg: failedGetMsg
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
    }
});

module.exports = router;