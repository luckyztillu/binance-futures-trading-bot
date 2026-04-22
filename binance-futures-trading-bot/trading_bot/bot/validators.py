import re

def validate_symbol(symbol: str):
    """Validates if the symbol looks like a Binance symbol (e.g., BTCUSDT)."""
    if not re.match(r"^[A-Z0-9]{5,15}$", symbol.upper()):
        raise ValueError(f"Invalid symbol format: {symbol}")
    return symbol.upper()

def validate_quantity(quantity: float):
    """Ensures quantity is positive."""
    if quantity <= 0:
        raise ValueError("Quantity must be greater than zero.")
    return quantity

def validate_price(price: float, order_type: str):
    """Ensures price is positive for LIMIT orders."""
    if order_type.upper() == "LIMIT" and (price is None or price <= 0):
        raise ValueError("Price must be provided and greater than zero for LIMIT orders.")
    return price
