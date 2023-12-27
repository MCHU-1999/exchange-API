const express = require('express');
var router = express.Router();
const bitgetApi = require("../bitget-node-sdk-api/build");
const binanceApi = require("../binance");
const bybitApi = require("../bybit-api");
require("dotenv").config();


const wrongPasswordMsg = "Invalid Password!";
const tokenTweetsPassword = process.env.PASSWORD;

// --------------------------------------------------------------------------------------------------------
// Get contract
// --------------------------------------------------------------------------------------------------------

router.get('/bitget', async function (req, res) {
    try{
        const exchange = req.header('exchange');
        const apiKey = req.header('apiKey');
        const apiSecret = req.header('apiSecret');
        const passphrase = req.header('passphrase');
        const password = req.header('password');

        var contract = [];
    
        if(password != tokenTweetsPassword){
            res.status(417).send({
                status: 'error',
                msg: wrongPasswordMsg
            });
            res.end();
        }else{
            const bitgetAccount = new bitgetApi.MixMarketApi(apiKey, apiSecret, passphrase);
            resData = await bitgetAccount.contracts('umcbl');
            if(resData['msg'] != 'success'){
                res.status(417).send({
                    status: 'error',
                    msg: resData['msg']
                });
                res.end();
            }else{
                for(let i=0; i<resData.data.length ; i++){
                    contract.push({
                        symbol: resData.data[i]['symbol'].split('_UMCBL')[0],
                        pricePrecision: parseInt(resData.data[i]['pricePlace']),
                        quantityPrecision: parseInt(resData.data[i]['volumePlace']),
                        minQty: resData.data[i]['minTradeNum'],
                        qtyStep: resData.data[i]['sizeMultiplier'],
                    });
                }
                res.status(200).send({
                    status: 'success',
                    data: contract
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


router.get('/binance', async function (req, res) {
    try{
        const exchange = req.header('exchange');
        const apiKey = req.header('apiKey');
        const apiSecret = req.header('apiSecret');
        const password = req.header('password');

        var contract = [];
        
        if(password != tokenTweetsPassword){
            res.status(417).send({
                status: 'error',
                msg: wrongPasswordMsg
            });
            res.end();
        }else{
            const binanceAccount = new binanceApi.USDMClient({'api_key':apiKey,'api_secret': apiSecret});
            resData = await binanceAccount.getExchangeInfo();
            // console.log(resData.symbols);
            for(let i=0; i<resData.symbols.length ; i++){
                contract.push({
                    symbol: resData.symbols[i]['symbol'],
                    pricePrecision: resData.symbols[i]['pricePrecision'],
                    quantityPrecision: resData.symbols[i]['quantityPrecision'],
                    minQty: resData.symbols[i].filters[1]['minQty'],
                    qtyStep: resData.symbols[i].filters[1]['stepSize'],
                });
            }
            res.status(200).send({
                status: 'success',
                data: contract,
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


router.get('/bybit', async function (req, res) {
    try{
        const exchange = req.header('exchange');
        const apiKey = req.header('apiKey');
        const apiSecret = req.header('apiSecret');
        const password = req.header('password');
    
    //--OPTIONAL---
        const category = req.body.category == undefined ? "linear" : req.body.category;
        const symbol = req.body.symbol;
        const baseCoin = req.body.baseCoin
    // ------------
        parseData = {
            "category": category,
            "symbol": undefined,
            "baseCoin": undefined,
        }    
        var contract = [];

        if(password != tokenTweetsPassword){
            res.status(417).send({
                status: 'error',
                msg: wrongPasswordMsg
            });
            res.end();
        }else{
            const bybitAccount = new bybitApi.ContractClient({'key':apiKey,'secret': apiSecret});
            resData = await bybitAccount.getInstrumentInfo(parseData);
            // console.log(resData.result.list);
            if(resData['retMsg'] != 'OK'){
                res.status(417).send({
                    status: 'error',
                    msg: resData['retMsg']
                });
                res.end();
            }else{
                for(let i=0; i<resData.result.list.length ; i++){
                    var qtyStep = resData.result.list[i]['lotSizeFilter']['qtyStep'];
                    contract.push({
                        symbol: resData.result.list[i]['symbol'],
                        pricePrecision: parseInt(resData.result.list[i]['priceScale']),
                        quantityPrecision: qtyStep.indexOf('.') + 1 > 0 ? qtyStep.length - (qtyStep.indexOf('.') + 1) : 0,
                        minQty: parseFloat(resData.result.list[i]['lotSizeFilter']['minOrderQty']),
                        qtyStep: parseFloat(resData.result.list[i]['lotSizeFilter']['qtyStep']),
                    });
                }
                res.status(200).send({
                    status: 'success',
                    data: contract,
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