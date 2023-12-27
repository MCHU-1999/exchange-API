const crypto = require('crypto');
// const fetch = require('node-fetch');
const urlencode = require('urlencode');
const sortJson = require('sort-json');
// import fetch from 'node-fetch';

class bingxApi {
    constructor(key, secret, baseUrl){
        this.apiKey = key;
        this.apiSecret = secret;
        this.baseUrl = baseUrl;
    }
    genSignature(method, path, paramsStr, SECRETKEY) {
        const originString = method + path + paramsStr
        var hmac = crypto.createHmac("sha256", SECRETKEY).update(originString, 'utf-8').digest('base64')
        hmac = urlencode(hmac)
        return hmac;
    }
    
    post(url, data) {
        // console.log(data)
        let options = {
            method: "POST",
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Content-Type': 'application/json;charset=utf-8'
            },
        };
        return fetch(url+'?'+data, options)
    }
    
    get(url) {
        let options = {
            method: "GET"
        };
        return fetch(url, options)
    }
    
    // ------------------------------------------------------------------------------------------------------------
    
    async getBalance(APIKEY, APIURL, SECRETKEY) {
        var paramsStr = "";
        var signature = "";
        var url = "";
        var paramsMap = {
            'apiKey': APIKEY,
            "currency": "USDT",
            'timestamp': Number(Date.now()),
        };
        paramsMap = sortJson(paramsMap);
        for(let i=0; i<Object.keys(paramsMap).length; i++){
            paramsStr = paramsStr + Object.keys(paramsMap)[i] + "=" + Object.values(paramsMap)[i] + "&"
        }
        paramsStr = paramsStr.substring(0, paramsStr.length - 1);
        signature = genSignature('POST', '/api/v1/user/getBalance', paramsStr, SECRETKEY);
        paramsStr = paramsStr + "&sign=" + signature;
        url = APIURL + "/api/v1/user/getBalance";
        const res = await post(url, paramsStr)
        return res.json();
    }
    
    async getPositions(symbol, APIKEY, APIURL, SECRETKEY) {
        var paramsStr = "";
        var signature = "";
        var url = "";
        var paramsMap = {
            'apiKey': APIKEY,
            'symbol': symbol,
            'timestamp': Number(Date.now()),
        };
        paramsMap = sortJson(paramsMap);
        for(let i=0; i<Object.keys(paramsMap).length; i++){
            paramsStr = paramsStr + Object.keys(paramsMap)[i] + "=" + Object.values(paramsMap)[i] + "&"
        }
        paramsStr = paramsStr.substring(0, paramsStr.length - 1);
        signature = genSignature('POST', '/api/v1/user/getPositions', paramsStr, SECRETKEY);
        paramsStr = paramsStr + "&sign=" + signature
        url = APIURL + "/api/v1/user/getPositions";
        const res = await post(url, paramsStr).json();
        return res.json();
    }
    
    async getContracts(APIURL){
        var url = APIURL + "/api/v1/market/getAllContracts";
        let res = await get(url);
        return res.json();
    }
    
    async setMarginMode(symbol, marginMode, APIKEY, APIURL, SECRETKEY){
        var paramsStr = "";
        var signature = "";
        var url = "";
        var paramsMap = {
            "symbol": symbol,
            "apiKey": APIKEY,
            "marginMode": marginMode,
            'timestamp': Number(Date.now()),
        }
        paramsMap = sortJson(paramsMap);
        for(let i=0; i<Object.keys(paramsMap).length; i++){
            paramsStr = paramsStr + Object.keys(paramsMap)[i] + "=" + Object.values(paramsMap)[i] + "&"
        }
        paramsStr = paramsStr.substring(0, paramsStr.length - 1);
        signature = genSignature('POST', '/api/v1/user/setMarginMode', paramsStr, SECRETKEY);
        paramsStr = paramsStr + "&sign=" + signature;
        url = APIURL+"/api/v1/user/setMarginMode";
        const res = await post(url, paramsStr);
        return res.json()
    }
    
    async setLeverage(symbol, side, leverage, APIKEY, APIURL, SECRETKEY){
        var paramsStr = "";
        var signature = "";
        var url = "";
        var paramsMap = {
            "symbol": symbol,
            "apiKey": APIKEY,
            "side": side,
            "leverage": leverage,
            'timestamp': Number(Date.now()),
        }
        paramsMap = sortJson(paramsMap);
        for(let i=0; i<Object.keys(paramsMap).length; i++){
            paramsStr = paramsStr + Object.keys(paramsMap)[i] + "=" + Object.values(paramsMap)[i] + "&"
        }
        paramsStr = paramsStr.substring(0, paramsStr.length - 1);
        signature = genSignature('POST', '/api/v1/user/setLeverage', paramsStr, SECRETKEY);
        paramsStr = paramsStr + "&sign=" + signature;
        url = APIURL+"/api/v1/user/setLeverage";
        const res = await post(url, paramsStr);
        return res.json()
    }
    
    async placeOrder(symbol, side, price, volume, tradeType, action, APIKEY, APIURL, SECRETKEY){
        var paramsStr = "";
        var signature = "";
        var url = "";
        var paramsMap = {
            "symbol": symbol,
            "apiKey": APIKEY,
            "side": side,
            "entrustPrice": price,
            "entrustVolume": volume,
            "tradeType": tradeType,
            "action": action,
            'timestamp': Number(Date.now()),
        }
        paramsMap = sortJson(paramsMap);
        for(let i=0; i<Object.keys(paramsMap).length; i++){
            paramsStr = paramsStr + Object.keys(paramsMap)[i] + "=" + Object.values(paramsMap)[i] + "&"
        }
        paramsStr = paramsStr.substring(0, paramsStr.length - 1);
        signature = genSignature('POST', '/api/v1/user/trade', paramsStr, SECRETKEY);
        paramsStr = paramsStr + "&sign=" + signature;
        url = APIURL+"/api/v1/user/trade";
        const res = await post(url, paramsStr)
        return res.json()
    }
    
    async closeOnePosition(symbol, positionId, APIKEY, APIURL, SECRETKEY){
        var paramsStr = "";
        var signature = "";
        var url = "";
        var paramsMap = {
            "symbol": symbol,
            "apiKey": APIKEY,
            "positionId": positionId,
            'timestamp': Number(Date.now()),
        }
        paramsMap = sortJson(paramsMap);
        for(let i=0; i<Object.keys(paramsMap).length; i++){
            paramsStr = paramsStr + Object.keys(paramsMap)[i] + "=" + Object.values(paramsMap)[i] + "&"
        }
        paramsStr = paramsStr.substring(0, paramsStr.length - 1);
        signature = genSignature('POST', '/api/v1/user/oneClickClosePosition', paramsStr, SECRETKEY);
        paramsStr = paramsStr + "&sign=" + signature;
        url = APIURL+"/api/v1/user/oneClickClosePosition";
        const res = await post(url, paramsStr)
        return res.json()
    }
    
    async closeAllPositions(APIKEY, APIURL, SECRETKEY){
        var paramsStr = "";
        var signature = "";
        var url = "";
        var paramsMap = {
            "apiKey": APIKEY,
            'timestamp': Number(Date.now()),
        }
        paramsMap = sortJson(paramsMap);
        for(let i=0; i<Object.keys(paramsMap).length; i++){
            paramsStr = paramsStr + Object.keys(paramsMap)[i] + "=" + Object.values(paramsMap)[i] + "&"
        }
        paramsStr = paramsStr.substring(0, paramsStr.length - 1);
        signature = genSignature('POST', '/api/v1/user/oneClickCloseAllPositions', paramsStr, SECRETKEY);
        paramsStr = paramsStr + "&sign=" + signature;
        url = APIURL+"/api/v1/user/oneClickCloseAllPositions";
        const res = await post(url, paramsStr)
        return res.json()
    }
}

exports.bingxApi = bingxApi