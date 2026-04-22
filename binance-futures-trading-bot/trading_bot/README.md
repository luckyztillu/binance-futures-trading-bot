# Binance Futures Trading Bot (Testnet)

A simplified Python application to place Market and Limit orders on Binance Futures Testnet (USDT-M).

## Features
- Place **Market** and **Limit** orders.
- Supports **BUY** and **SELL** sides.
- CLI interface using **Typer**.
- Structured logging to `trading_bot.log`.
- Robust error handling and input validation.

## Setup

1. **Clone the repository** (or extract the zip).
2. **Create a virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Environment Variables**:
   Create a `.env` file in the `trading_bot` directory:
   ```env
   BINANCE_API_KEY=your_testnet_key
   BINANCE_API_SECRET=your_testnet_secret
   ```
   Get your keys from [Binance Futures Testnet](https://testnet.binancefuture.com/).

## Usage Examples

### Place a Market BUY Order
```bash
python cli.py BTCUSDT BUY MARKET --quantity 0.001
```

### Place a Limit SELL Order
```bash
python cli.py BTCUSDT SELL LIMIT --quantity 0.001 --price 60000
```

## Project Structure
- `bot/client.py`: API client wrapper for Binance REST calls.
- `bot/orders.py`: High-level order placement logic.
- `bot/validators.py`: Input validation helpers.
- `bot/logging_config.py`: Centralized logging configuration.
- `cli.py`: Entry point for the CLI.

## Bonus Implemented
- **Enhanced CLI UX**: Using `Typer` for better command-line experience with automatic help generation and validation.
- **Lightweight UI**: A React-based web interface is also provided in the root directory for a live preview.
