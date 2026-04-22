import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Terminal, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowRightLeft,
  Settings,
  History,
  LayoutDashboard
} from 'lucide-react';
import axios from 'axios';

interface OrderResponse {
  orderId: number;
  symbol: string;
  status: string;
  side: string;
  type: string;
  executedQty: string;
  avgPrice: string;
  origQty: string;
  price?: string;
}

export default function App() {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [type, setType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [quantity, setQuantity] = useState('0.001');
  const [price, setPrice] = useState('60000');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const placeOrder = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await axios.post('/api/order', {
        symbol,
        side,
        type,
        quantity,
        price: type === 'LIMIT' ? price : undefined
      });
      
      setOrders(prev => [response.data, ...prev]);
      setSuccess(`Order ${response.data.orderId} placed successfully!`);
    } catch (err: any) {
      setError(err.response?.data?.msg || err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-amber-500 selection:text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 rounded-lg">
              <Activity className="w-5 h-5 text-slate-900" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">TradingBot <span className="text-slate-500 text-sm font-medium">Testnet</span></h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              API Connected
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Trading Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6 text-slate-400">
              <LayoutDashboard className="w-4 h-4" />
              <h2 className="text-sm font-semibold uppercase tracking-wider">Execute Order</h2>
            </div>

            <div className="space-y-5">
              {/* Symbol */}
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase mb-2 block">Symbol</label>
                <select 
                  value={symbol} 
                  onChange={(e) => setSymbol(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="BTCUSDT">BTC/USDT</option>
                  <option value="ETHUSDT">ETH/USDT</option>
                  <option value="BNBUSDT">BNB/USDT</option>
                  <option value="SOLUSDT">SOL/USDT</option>
                </select>
              </div>

              {/* Side */}
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setSide('BUY')}
                  className={`py-2 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                    side === 'BUY' ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(22,163,74,0.3)]' : 'bg-slate-950 border border-slate-800 text-slate-500 hover:border-green-600/50'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" /> BUY
                </button>
                <button 
                  onClick={() => setSide('SELL')}
                  className={`py-2 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                    side === 'SELL' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'bg-slate-950 border border-slate-800 text-slate-500 hover:border-red-600/50'
                  }`}
                >
                  <TrendingDown className="w-4 h-4" /> SELL
                </button>
              </div>

              {/* Type */}
              <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-xl">
                <button 
                  onClick={() => setType('MARKET')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    type === 'MARKET' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  MARKET
                </button>
                <button 
                  onClick={() => setType('LIMIT')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    type === 'LIMIT' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  LIMIT
                </button>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase mb-2 block">Quantity</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 transition-colors font-mono"
                    placeholder="0.000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600">{symbol.replace('USDT', '')}</span>
                </div>
              </div>

              {/* Price (Limit Only) */}
              <AnimatePresence mode="wait">
                {type === 'LIMIT' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <label className="text-xs font-medium text-slate-500 uppercase mb-2 block">Price</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-amber-500 transition-colors font-mono"
                        placeholder="0.00"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600">USDT</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Execution Button */}
              <button 
                onClick={placeOrder}
                disabled={loading || !quantity || (type === 'LIMIT' && !price)}
                className={`w-full py-4 rounded-xl font-black text-lg tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  side === 'BUY' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'
                }`}
              >
                {loading ? 'PROCESSING...' : `PLACE ${side} ORDER`}
              </button>

              {/* Status Messages */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-red-950/30 border border-red-500/50 rounded-xl p-4 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="text-xs text-red-200">{error}</p>
                  </motion.div>
                )}
                {success && (
                  <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className="bg-green-950/30 border border-green-500/50 rounded-xl p-4 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <p className="text-xs text-green-200">{success}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" /> Node.js Backend Proxy
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              For security, API requests are proxied through an Express server. This hides your API secret from the browser and bypasses CORS restrictions.
            </p>
          </div>
        </div>

        {/* History & Logs */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-full overflow-hidden shadow-xl min-h-[600px]">
             <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="text-sm font-bold border-b-2 border-amber-500 pb-1 flex items-center gap-2">
                    <History className="w-4 h-4" /> Order History
                  </button>
                  <button className="text-sm font-medium text-slate-500 pb-1 hover:text-slate-300 transition-colors flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4" /> Open Orders
                  </button>
                </div>
             </div>

             <div className="flex-1 overflow-auto">
               <table className="w-full text-left">
                 <thead className="bg-slate-950/50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Time</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Symbol</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Side</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Price</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800 text-sm">
                   <AnimatePresence initial={false}>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-600 italic">
                          No orders executed in this session.
                        </td>
                      </tr>
                    ) : orders.map((order) => (
                      <motion.tr 
                        key={order.orderId}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-[11px] text-slate-500">
                          {new Date().toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-4 font-bold">{order.symbol}</td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-bold">{order.type}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-bold ${order.side === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                            {order.side}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-300">
                          {order.avgPrice === '0' || !order.avgPrice ? (order.price || 'MARKET') : parseFloat(order.avgPrice).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-300">
                          {order.origQty}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            order.status === 'FILLED' ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber-500'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                   </AnimatePresence>
                 </tbody>
               </table>
             </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                 <Terminal className="w-4 h-4" /> Live Terminal Log
               </h3>
               <span className="text-[10px] font-mono text-slate-600 uppercase tracking-tighter">Connected to Binance Stream</span>
             </div>
             <div className="bg-black/50 rounded-xl p-4 font-mono text-[11px] h-48 overflow-auto space-y-1.5 custom-scrollbar">
               <div className="text-slate-600">[SYSTEM] Initializing trading stream...</div>
               <div className="text-slate-600">[SYSTEM] Authentication successful. Ready to transmit.</div>
               {orders.map((o, i) => (
                 <div key={i} className="text-green-500/80">
                   {`> SUCCESS: ${o.side} ${o.type} ${o.symbol} - ID: ${o.orderId} - STATUS: ${o.status}`}
                 </div>
               ))}
               {error && (
                 <div className="text-red-500/80">
                   {`> ERROR: ${error}`}
                 </div>
               )}
               <div className="text-slate-700 animate-pulse">_</div>
             </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-7xl mx-auto px-4 py-8 border-t border-slate-800 text-center space-y-4">
        <p className="text-slate-500 text-sm">
          Built for the Binance Developer Task using Python, TypeScript, and React.
        </p>
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center font-bold text-[10px]">Py</div>
            Python CLI
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center font-bold text-[10px]">Ts</div>
             Express Proxy
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center font-bold text-[10px]">Re</div>
            React Dashboard
          </div>
        </div>
      </footer>
    </div>
  );
}
