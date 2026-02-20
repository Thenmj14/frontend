import "../styles/stats.css";

function StatsCards() {
  const stats = [
    { title: "Total Balance", value: "₹4,25,000", icon: "💰" },
    { title: "Today's Profit", value: "+₹12,540", icon: "📈" },
    { title: "Active Trades", value: "08", icon: "⚡" },
    { title: "Transactions", value: "152", icon: "📊" },
  ];

  return (
    <div className="stats-grid">
      {stats.map((item, index) => (
        <div className="stat-card" key={index}>
          <div className="stat-icon">{item.icon}</div>
          <div>
            <h4>{item.title}</h4>
            <h2>{item.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;