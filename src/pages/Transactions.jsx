import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import TransactionTable from "../components/TransactionTable";

function Transactions() {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main">
        <Topbar />
        <TransactionTable />
      </div>
    </div>
  );
}

export default Transactions;