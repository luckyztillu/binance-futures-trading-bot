import hmac
import hashlib
import time
import requests
import logging

class BinanceFuturesClient:
    BASE_URL = "https://testnet.binancefuture.com"

    def __init__(self, api_key: str, api_secret: str):
        self.api_key = api_key
        self.api_secret = api_secret
        self.logger = logging.getLogger("TradingBot.Client")

    def _generate_signature(self, query_string: str) -> str:
        return hmac.new(
            self.api_secret.encode("utf-8"),
            query_string.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()

    def _request(self, method: str, endpoint: str, params: dict = None):
        url = f"{self.BASE_URL}{endpoint}"
        query_params = params.copy() if params else {}
        query_params["timestamp"] = int(time.time() * 1000)
        
        query_string = "&".join([f"{k}={v}" for k, v in query_params.items()])
        signature = self._generate_signature(query_string)
        query_params["signature"] = signature

        headers = {"X-MBX-APIKEY": self.api_key}
        
        self.logger.info(f"Request: {method} {endpoint} params={query_params}")
        
        try:
            response = requests.request(method, url, params=query_params, headers=headers)
            res_json = response.json()
            
            if response.status_code != 200:
                self.logger.error(f"API Error: {res_json}")
                raise Exception(f"Binance API Error: {res_json.get('msg', 'Unknown Error')}")
            
            self.logger.info(f"Response: {res_json}")
            return res_json
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Network Error: {str(e)}")
            raise Exception(f"Network failure: {str(e)}")

    def place_order(self, symbol: str, side: str, order_type: str, quantity: float, price: float = None):
        endpoint = "/fapi/v1/order"
        params = {
            "symbol": symbol,
            "side": side.upper(),
            "type": order_type.upper(),
            "quantity": quantity,
        }
        if price:
            params["price"] = price
            params["timeInForce"] = "GTC"  # Good Till Cancelled
            
        return self._request("POST", endpoint, params)
