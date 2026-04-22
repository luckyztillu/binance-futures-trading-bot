from .client import BinanceFuturesClient
from .validators import validate_symbol, validate_quantity, validate_price

class OrderManager:
    def __init__(self, client: BinanceFuturesClient):
        self.client = client

    def execute_order(self, symbol: str, side: str, order_type: str, quantity: float, price: float = None):
        # Validate inputs
        symbol = validate_symbol(symbol)
        quantity = validate_quantity(quantity)
        price = validate_price(price, order_type)
        
        # Place order
        return self.client.place_order(symbol, side, order_type, quantity, price)
