# exchange-API for TokenTweets
api website: https://exchange-api-cbkijv4tvq-de.a.run.app/api
### Header
**common header:**
```json
{
    "Content-Type": "application/json",
    "User-Agent": "mozilla/5.0",
    "Accept": "*/*",
    "Connection": "keep-alive",
}
```
**bitget:**
```json
{
    "exchange": "bitget",
    "apiKey": "YOURAPIKEY",
    "apiSecret": "YOURAPISECRET",
    "passphrase": "YOURBITGETPASSPHRASE",
    "password": "TOKENTWEETSPASSWORD"
}
```
**binance:**
```json
{
    "exchange": "binance",
    "apiKey": "YOURAPIKEY",
    "apiSecret": "YOURAPISECRET",
    "password": "TOKENTWEETSPASSWORD"
}
```
**bybit:**
```json
{
    "exchange": "bybit",
    "apiKey": "YOURAPIKEY",
    "apiSecret": "YOURAPISECRET",
    "password": "TOKENTWEETSPASSWORD"
}
```

## getBalance

GET method, request with only header.

## getTickers

GET method, request with only header.

## getTicker

* This is a POST method.
```json
{
    "symbol": "BTCUSDT",
}
```

## getAllPosition

GET method, request with only header.

## getPosition

* This is a POST method.
```json
{
    "symbol": "BTCUSDT",
}
```

## setDualSidePosition
```json
{
    "dualSidePosition": true,   //boolean value, true = hedge mode, false = one-way mode.
}
```

## setMarginMode
```json
{
    "symbol": "BTCUSDT",
    "marginMode": "cross"       //or "isolated"
}
```

## setLeverage
```json
{
    "symbol": "BTCUSDT",
    "leverage": 50
}
```

## placeOrder
Parameters that are mandatory:
```json
{
    "symbol": "ETHUSDT",
    "positionSize": 0.01,
    "price": 1000,
    "side": "long",
    "action": "open",
    "orderType": "limit"
}
```
Optional:
```json
{
    "timeInForce": "ETHUSDT",           //trading pair in UPPERCASE
    "clientOrderid": "test00123",       //client order id in string format
    "reduceOnly": false,                //boolean
    "presetTakeProfitPrice": 2000,      //number
    "presetStopLossPrice": 1000         //number
}
```

## cancelOrder
```json
{
    "symbol": "ETHUSDT",
    "orderId": 113994385738453,
    "clientOrderId": "clientOrderId01"  //only available in binance or bybit
}
```

## cancelAllOrder
```json
{
    "symbol": "ETHUSDT"                 //only available in binance or bybit
}
```

## replaceOrder

under developing...