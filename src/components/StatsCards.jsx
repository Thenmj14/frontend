import "../styles/stats.css";

function StatsCards({ totalTransactions, totalBuy, totalSell, profit, price }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-title">Trade Volume</span>
        <span className="stat-value">{totalTransactions}</span>
      </div>
      <div className="stat-card">
        <span className="stat-title">Portfolio Limit</span>
        <span className="stat-value">₹{totalBuy.toFixed(2)}</span>
      </div>
      <div className="stat-card">
        <span className="stat-title">Realized Revenue</span>
        <span className="stat-value">₹{totalSell.toFixed(2)}</span>
      </div>
      <div className="stat-card">
        <span className="stat-title">Net P&L</span>
        <span className="stat-value" style={{ color: profit >= 0 ? '#10b981' : '#ef4444' }}>
          {(profit >= 0 ? '+' : '-')}₹{Math.abs(profit).toFixed(2)}
        </span>
      </div>
      <div className="stat-card">
        <span className="stat-title">Live Asset Price</span>
        <span className="stat-value">₹{price.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default StatsCards;