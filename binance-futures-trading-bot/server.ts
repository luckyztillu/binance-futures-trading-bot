import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import crypto from "crypto";
import winston from "winston";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "trading_bot_node.log" }),
    new winston.transports.Console(),
  ],
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  const BINANCE_BASE_URL = "https://testnet.binancefuture.com";

  app.post("/api/order", async (req, res) => {
    const { symbol, side, type, quantity, price } = req.body;
    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_API_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({ error: "Binance API keys not configured in server environment." });
    }

    try {
      const timestamp = Date.now();
      let queryString = `symbol=${symbol.toUpperCase()}&side=${side.toUpperCase()}&type=${type.toUpperCase()}&quantity=${quantity}&timestamp=${timestamp}`;
      
      if (type.toUpperCase() === "LIMIT") {
        queryString += `&price=${price}&timeInForce=GTC`;
      }

      const signature = crypto
        .createHmac("sha256", apiSecret)
        .update(queryString)
        .digest("hex");

      const url = `${BINANCE_BASE_URL}/fapi/v1/order?${queryString}&signature=${signature}`;

      logger.info(`Placing order: ${side} ${type} ${quantity} ${symbol}`);
      
      const response = await axios.post(url, null, {
        headers: { "X-MBX-APIKEY": apiKey },
      });

      logger.info("Order response", { data: response.data });
      res.json(response.data);
    } catch (error: any) {
      const errorData = error.response?.data || error.message;
      logger.error("Order error", { error: errorData });
      res.status(error.response?.status || 500).json(errorData);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
