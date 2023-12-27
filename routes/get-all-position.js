const express = require('express');
var router = express.Router();
const bitgetApi = require("../bitget-node-sdk-api/build");
const binanceApi = require("../binance");
const bybitApi = require("../bybit-api");
require("dotenv").config();


const wrongPasswordMsg = "Invalid Password!";
const tokenTweetsPassword = process.env.PASSWORD;

// --------------------------------------------------------------------------------------------------------
// Get ALL positions
// --------------------------------------------------------------------------------------------------------

router.get('/bitget', async function (req, res) {
    try{
        const exchange = req.header('exchange');
        const apiKey = req.header('apiKey');
        const apiSecret = req.header('apiSecret');
        const passphrase = req.header('passphrase');
        const password = req.header('password');
        var pos = [];
        var margin = 0.00;

        if(password != tokenTweetsPassword){
            res.status(417).send({
                status: 'error',
                msg: wrongPasswordMsg
            });
            res.end();
        }else{
            const bitgetAccount = new bitgetApi.MixPositionApi(apiKey, apiSecret, passphrase);
            resData = await bitgetAccount.allPosition('umcbl','USDT');
            if(resData['msg'] != 'success'){
                res.status(417).send({
                    status: 'error',
                    msg: resData['msg']
                });
                res.end();
            }else{
                for(let i=0; i<resData['data'].length ; i++){
                    if(resData['data'][i]['total'] > 0.00){
                        margin = parseFloat(resData['data'][i]['margin']);
                        pos.push({
                            // exchange: 'bitget',
                            symbol: resData['data'][i]['symbol'].split('_UMCBL')[0],
                            amount: parseFloat(resData['data'][i]['total']),
                            margin: margin,
                            side: resData['data'][i]['holdSide'].toLowerCase(),
                            leverage: parseInt(resData['data'][i]['leverage']),
                            marginMode: (resData['data'][i]['marginMode']=='crossed') ? 'cross' : 'isolated',
                            entryPrice: parseFloat(resData['data'][i]['averageOpenPrice']),
                            markPrice: parseFloat(resData['data'][i]['marketPrice']),
                            unrealizedPNL: parseFloat(resData['data'][i]['unrealizedPL']),
                            unrealizedPNLPercentage: 100*parseFloat(resData['data'][i]['unrealizedPL'])/margin,
                            liquidationPrice: parseFloat(resData['data'][i]['liquidationPrice']),
                            createdTime: resData['data'][i]['cTime'],
                            updatedTime: resData['data'][i]['uTime'],
                        });
                    }
                }
                res.status(200).send({
                    status: 'success',
                    data: pos
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
        var pos = [];
        var margin = 0.00;

        if(password != tokenTweetsPassword){
            res.status(417).send({
                status: 'error',
                msg: wrongPasswordMsg
            });
            res.end();
        }else{
            const binanceAccount = new binanceApi.USDMClient({'api_key':apiKey,'api_secret': apiSecret});
            resData = await binanceAccount.getPositions();
            // console.log(resData);
            for(let i=0; i<resData.length ; i++){
                if(resData[i]['positionAmt'] != 0.00){
                    margin = Math.abs(parseFloat(resData[i]['positionAmt'])*parseFloat(resData[i]['entryPrice']));
                    pos.push({
                        // exchange: 'binance',
                        symbol: resData[i]['symbol'],
                        amount: Math.abs(parseFloat(resData[i]['positionAmt'])),
                        margin: margin,
                        side: resData[i]['positionSide'].toLowerCase(),
                        leverage: parseInt(resData[i]['leverage']),
                        marginMode: (resData[i]['marginType']=='cross') ? 'cross' : 'isolated',
                        entryPrice: parseFloat(resData[i]['entryPrice']),
                        markPrice: parseFloat(resData[i]['markPrice']),
                        unrealizedPNL: parseFloat(resData[i]['unRealizedProfit']),
                        unrealizedPNLPercentage: 100*parseFloat(resData[i]['unRealizedProfit'])/margin,
                        liquidationPrice: parseFloat(resData[i]['liquidationPrice']),
                        createdTime: resData[i]['createTime'],
                        updatedTime: resData[i]['updateTime'],
                    });
                }
            }
            res.status(200).send({
                status: 'success',
                data: pos
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
        var pos = [];
        var margin = 0.00;

        if(password != tokenTweetsPassword){
            res.status(417).send({
                status: 'error',
                msg: wrongPasswordMsg
            });
            res.end();
        }else{
            const bybitAccount = new bybitApi.ContractClient({'key':apiKey,'secret': apiSecret});
            resData = await bybitAccount.getPositions({settleCoin:'USDT'});
            if(resData['retMsg'] != 'OK'){
                res.status(417).send({
                    status: 'error',
                    msg: resData['retMsg']
                });
                res.end();
            }else{
                for(let i=0; i<resData['result']['list'].length ; i++){
                    if(resData['result']['list'][i]['size'] > 0.00){
                        margin = parseFloat(resData['result']['list'][i]['positionBalance']);
                        pos.push({
                            // exchange: 'bybit',
                            symbol: resData['result']['list'][i]['symbol'],
                            amount: parseFloat(resData['result']['list'][i]['size']),
                            margin: margin,
                            side: (resData['result']['list'][i]['side'] == 'Buy') ? 'long' : 'short',
                            leverage: parseInt(resData['result']['list'][i]['leverage']),
                            marginMode: (resData['result']['list'][i]['tradeMode'] == 0) ? 'cross' : 'isolated',
                            entryPrice: parseFloat(resData['result']['list'][i]['entryPrice']),
                            markPrice: parseFloat(resData['result']['list'][i]['markPrice']),
                            unrealizedPNL: parseFloat(resData['result']['list'][i]['unrealisedPnl']),
                            unrealizedPNLPercentage: 100*parseFloat(resData['result']['list'][i]['unrealisedPnl'])/margin,
                            liquidationPrice: parseFloat(resData['result']['list'][i]['liqPrice']),
                            createdTime: resData['result']['list'][i]['createdTime'],
                            updatedTime: resData['result']['list'][i]['updatedTime'],
                        });
                    }
                }
                res.status(200).send({
                    status: 'success',
                    data: pos
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