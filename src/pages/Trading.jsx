import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import API from "../services/api";
import "../styles/trading.css";

const INITIAL_STOCKS = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2950.45, change: 1.2 },
  { symbol: "TCS", name: "Tata Consultancy", price: 3890.10, change: -0.5 },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 1430.75, change: 2.1 },
  { symbol: "INFY", name: "Infosys", price: 1420.00, change: 0.8 },
  { symbol: "SBIN", name: "State Bank of India", price: 745.30, change: -1.1 },
  { symbol: "ICICIBANK", name: "ICICI Bank", price: 1050.25, change: 1.5 },
  { symbol: "ITC", name: "ITC Limited", price: 420.60, change: 0.3 },
  { symbol: "LT", name: "Larsen & Toubro", price: 3600.80, change: -0.9 },
  { symbol: "BAJFINANCE", name: "Bajaj Finance", price: 7120.30, change: 3.4 },
  { symbol: "WIPRO", name: "Wipro Limited", price: 405.15, change: -0.2 }
];

function Trading() {
  const [stocks, setStocks] = useState(INITIAL_STOCKS);
  const [selectedStock, setSelectedStock] = useState(INITIAL_STOCKS[0]);
  
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const ACCOUNT_ID = 1;

  // Live Market Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks => prevStocks.map(stock => {
        const volatility = stock.price * 0.0005; // 0.05% typical tick
        const randomShift = (Math.random() - 0.5) * volatility;
        const newPrice = stock.price + randomShift;
        return { ...stock, price: newPrice };
      }));
    }, 1500); // Ticks every 1.5 seconds for live feel
    return () => clearInterval(interval);
  }, []);

  // Sync selected stock price dynamically
  useEffect(() => {
    const updated = stocks.find(s => s.symbol === selectedStock.symbol);
    if(updated) setSelectedStock(updated);
  }, [stocks]);

  const totalOrderValue = quantity ? (quantity * selectedStock.price).toFixed(2) : 0;

  const executeTrade = async (type) => {
    if (!quantity || quantity <= 0) {
      setMessage("⚠ Enter valid quantity of shares");
      return;
    }
    
    try {
      setLoading(true);
      await API.post("/transactions", {
        type: `${type}_${selectedStock.symbol}`,
        amount: Number(totalOrderValue),
        accountId: ACCOUNT_ID,
      });

      setMessage(`✅ ${type === "BUY" ? "Bought" : "Sold"} ${quantity} shares of ${selectedStock.symbol}`);
      setQuantity("");
    } catch (err) {
      setMessage(`❌ ${type === "BUY" ? "Insufficient Buying Power" : "Transaction Failed"}`);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 5000); // Clear message after 5 seconds
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main">
        <Topbar />
        
        <div className="market-container">
          <div className="market-header">
             <h2>Live Stock Market</h2>
             <p>Track volatility and execute equity trades in real-time.</p>
          </div>

          <div className="market-grid">
            
            {/* Stocks List (Left Panel) */}
            <div className="stocks-card">
               <div className="stocks-card-header">
                 <h3>Market Movers</h3>
               </div>
               <div className="stocks-list">
                  {stocks.map(stock => (
                    <div 
                      key={stock.symbol} 
                      className={`stock-item ${selectedStock.symbol === stock.symbol ? "active" : ""}`}
                      onClick={() => { setQuantity(""); setSelectedStock(stock); setMessage(""); }}
                    >
                      <div className="stock-info">
                         <span className="stock-sym">{stock.symbol}</span>
                         <span className="stock-name">{stock.name}</span>
                      </div>
                      <div className="stock-price-info">
                         <span className="stock-price">₹{stock.price.toFixed(2)}</span>
                         <span className={`stock-change ${stock.change >= 0 ? 'up' : 'down'}`}>
                           {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                         </span>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Order Ticket (Right Panel) */}
            <div className="order-ticket-card">
               <div className="ticket-header">
                 <div>
                   <h1 className="ticket-symbol">{selectedStock.symbol}</h1>
                   <p className="ticket-name">{selectedStock.name}</p>
                 </div>
                 <div className="ticket-live-price">
                   <h2>₹{selectedStock.price.toFixed(2)}</h2>
                   <span className={selectedStock.change >= 0 ? "up" : "down"}>
                     Live Market Price
                   </span>
                 </div>
               </div>

               <div className="ticket-form">
                 <div className="input-group">
                   <label>Shares</label>
                   <input
                     type="number"
                     placeholder="0"
                     value={quantity}
                     onChange={(e) => setQuantity(e.target.value)}
                     min="1"
                   />
                 </div>

                 <div className="order-summary">
                   <span className="summary-label">Estimated Cost:</span>
                   <span className="summary-value">₹{totalOrderValue}</span>
                 </div>

                 <div className="ticket-actions">
                   <button 
                     className="buy-action-btn" 
                     onClick={() => executeTrade("BUY")}
                     disabled={loading}
                   >
                     {loading ? "Approving..." : "Buy"}
                   </button>
                   <button 
                     className="sell-action-btn" 
                     onClick={() => executeTrade("SELL")}
                     disabled={loading}
                   >
                     {loading ? "Liquidating..." : "Sell"}
                   </button>
                 </div>

                 {message && (
                   <div className={`ticket-msg ${message.includes("❌") || message.includes("⚠") ? "error" : "success"}`}>
                     {message}
                   </div>
                 )}
               </div>

               <div className="market-disclaimer">
                 <p>Options trading entails significant risk and is not appropriate for all investors. Market data is delayed by 15 minutes.</p>
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Trading;