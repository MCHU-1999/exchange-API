const express = require('express');
var router = express.Router();
const bitgetApi = require("../bitget-node-sdk-api/build");
const binanceApi = require("../binance");
const bybitApi = require("../bybit-api");
require("dotenv").config();


const wrongPasswordMsg = "Invalid Password!";
const tokenTweetsPassword = process.env.PASSWORD;

// --------------------------------------------------------------------------------------------------------
// Get mark price
// --------------------------------------------------------------------------------------------------------

router.post('/bitget', async function (req, res) {
    try{
        const exchange = req.header('exchange');
        const apiKey = req.header('apiKey');
        const apiSecret = req.header('apiSecret');
        const passphrase = req.header('passphrase');
        const password = req.header('password');

        const symbol = req.body.symbol;
    
        if(password != tokenTweetsPassword){
            res.status(417).send({
                status: 'error',
                msg: wrongPasswordMsg
            });
            res.end();
        }else{
            const bitgetAccount = new bitgetApi.MixMarketApi(apiKey, apiSecret, passphrase);
            resData = await bitgetAccount.markPrice(symbol+'_UMCBL');
            // console.log(resData.data);
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
                        symbol: symbol,
                        markPrice: resData.data.markPrice,
                        timestamp: resData.data.timestamp,
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

        const symbol = req.body.symbol;
        var data = [];
        
        if(password != tokenTweetsPassword){
            res.status(417).send({
                status: 'error',
                msg: wrongPasswordMsg
            });
            res.end();
        }else{
            const binanceAccount = new binanceApi.USDMClient({'api_key':apiKey,'api_secret': apiSecret});
            resData = await binanceAccount.getMarkPrice({"symbol": symbol});
            if (symbol == undefined){
                for(let i=0; i<resData.length ; i++){
                    data.push({
                        symbol: resData[i].symbol,
                        markPrice: resData[i].markPrice,
                        timestamp: resData[i].time,
                    });
                }
            } else {
                data = {
                    symbol: symbol,
                    markPrice: resData.markPrice,
                    timestamp: resData.time,
                }
            }
            res.status(200).send({
                status: 'success',
                data: data,
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
    
    //--OPTIONAL---
        const category = "linear";
        const symbol = req.body.symbol;
    // ------------ 
        var data = [];

        if(password != tokenTweetsPassword){
            res.status(417).send({
                status: 'error',
                msg: wrongPasswordMsg
            });
            res.end();
        }else{
            const bybitAccount = new bybitApi.ContractClient({'key':apiKey,'secret': apiSecret});
            resData = await bybitAccount.getSymbolTicker(category, symbol);
            // console.log(resData);
            if(resData['retMsg'] != 'OK'){
                res.status(417).send({
                    status: 'error',
                    msg: resData['retMsg']
                });
                res.end();
            }else{
                if (symbol == undefined){
                    for(let i=0; i<resData.result.list.length ; i++){
                        data.push({
                            symbol: resData.result.list[i].symbol,
                            markPrice: resData.result.list[i].markPrice,
                            timestamp: resData.time,
                        });
                    }
                } else {
                    data = {
                        symbol: symbol,
                        markPrice: resData.result.list[0].markPrice,
                        timestamp: resData.time,
                    }
                }
                res.status(200).send({
                    status: 'success',
                    data: data,
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