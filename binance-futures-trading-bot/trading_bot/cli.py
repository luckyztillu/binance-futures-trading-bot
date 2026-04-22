import typer
import os
from dotenv import load_dotenv
from bot.client import BinanceFuturesClient
from bot.orders import OrderManager
from bot.logging_config import setup_logging

# Load environment variables
load_dotenv()

app = typer.Typer(help="Binance Futures Trading Bot CLI")
logger = setup_logging()

@app.command()
def place(
    symbol: str = typer.Argument(..., help="Symbol (e.g., BTCUSDT)"),
    side: str = typer.Argument(..., help="BUY or SELL"),
    order_type: str = typer.Argument(..., help="MARKET or LIMIT"),
    quantity: float = typer.Option(..., "--quantity", "-q", help="Quantity to trade"),
    price: float = typer.Option(None, "--price", "-p", help="Price (required for LIMIT orders)")
):
    """
    Places an order on Binance Futures Testnet.
    """
    api_key = os.getenv("BINANCE_API_KEY")
    api_secret = os.getenv("BINANCE_API_SECRET")

    if not api_key or not api_secret:
        typer.secho("Error: BINANCE_API_KEY and BINANCE_API_SECRET must be set in .env", fg=typer.colors.RED)
        raise typer.Exit(code=1)

    try:
        client = BinanceFuturesClient(api_key, api_secret)
        manager = OrderManager(client)
        
        typer.echo(f"🚀 Placing {order_type} {side} order for {quantity} {symbol}...")
        
        response = manager.execute_order(symbol, side, order_type, quantity, price)
        
        typer.secho("✅ Order Placed Successfully!", fg=typer.colors.GREEN, bold=True)
        typer.echo("--- Order Summary ---")
        typer.echo(f"Order ID: {response.get('orderId')}")
        typer.echo(f"Status: {response.get('status')}")
        typer.echo(f"Executed Qty: {response.get('executedQty')}")
        typer.echo(f"Avg Price: {response.get('avgPrice')}")
        typer.echo("----------------------")
        
    except ValueError as ve:
        typer.secho(f"Validation Error: {str(ve)}", fg=typer.colors.YELLOW)
        raise typer.Exit(code=1)
    except Exception as e:
        typer.secho(f"Execution Error: {str(e)}", fg=typer.colors.RED)
        raise typer.Exit(code=1)

if __name__ == "__main__":
    app()
