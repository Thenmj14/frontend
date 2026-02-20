import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatsCards from "../components/StatsCards";
import TradingChart from "../components/TradingChart";
import TransactionTable from "../components/TransactionTable";
import "../styles/dashboard.css";
import FraudAlert from "../components/FraudAlert";

function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main">
        <Topbar />

        <div className="content">
          <StatsCards />
          <TradingChart />
          <TransactionTable />
          <FraudAlert />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;