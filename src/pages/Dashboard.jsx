import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatsCards from "../components/StatsCards";
import TradingChart from "../components/TradingChart";
import TransactionTable from "../components/TransactionTable";
import FraudAlert from "../components/FraudAlert";
import API from "../services/api";
import "../styles/dashboard.css";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [price, setPrice] = useState(100);

  // 🔹 Fetch Transactions
  useEffect(() => {
    API.get("/transactions/1")
      .then((res) => setTransactions(res.data))
      .catch(() => setTransactions([]));
  }, []);

  // 🔹 Live Price Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPrice((prev) => prev + (Math.random() * 10 - 5));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // 🔹 Calculations
  const totalTransactions = transactions.length;

  const totalBuy = transactions
    .filter((t) => t.type && t.type.startsWith("BUY"))
    .reduce((acc, t) => acc + t.amount, 0);

  const totalSell = transactions
    .filter((t) => t.type && t.type.startsWith("SELL"))
    .reduce((acc, t) => acc + t.amount, 0);

  const profit = totalSell - totalBuy;

  const frauds = transactions.filter((t) => t.amount > 5000);

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main">
        <Topbar />

        <div className="content">
          
          {/* ✅ Top Stats Hero Section */}
          <div className="dashboard-hero">
            <StatsCards
              totalTransactions={totalTransactions}
              totalBuy={totalBuy}
              totalSell={totalSell}
              profit={profit}
              price={price}
            />
          </div>

          <div className="stock-dashboard-grid">
            {/* ✅ Main Left Column */}
            <div className="dashboard-main-col">
              <TradingChart transactions={transactions} />
              <FraudAlert frauds={frauds} />
            </div>

            {/* ✅ Right Side Column */}
            <div className="dashboard-side-col">
              <TransactionTable transactions={transactions} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;