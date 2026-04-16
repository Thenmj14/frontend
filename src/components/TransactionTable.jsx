import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/table.css";

function TransactionTable() {
  const [transactions, setTransactions] = useState([]);

  const ACCOUNT_ID = 1;

 useEffect(() => {
  fetchData();

  const interval = setInterval(() => {
    fetchData();
  }, 2000); // refresh every 2 sec

  return () => clearInterval(interval);
}, []);

 const fetchData = async () => {
  try {
    const res = await API.get(`/transactions/${ACCOUNT_ID}`);
    
    console.log("FULL API:", res.data);

    // 🔥 force convert into array
    const extractedData =
      res.data?.transactions ||
      res.data?.content ||
      res.data?.data ||
      (Array.isArray(res.data) ? res.data : []);

    console.log("FINAL ARRAY:", extractedData);

    setTransactions(Array.isArray(extractedData) ? extractedData : []);
  } catch (err) {
    console.error(err);
    setTransactions([]);
  }
};

  return (
    <div className="table-card">
      <h3>Transactions</h3>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Asset</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>

       <tbody>
    {Array.isArray(transactions) && transactions.length > 0 ? (
      transactions.map((t, index) => {
        let dateObj = new Date();
        if (t.createdAt) {
            if (Array.isArray(t.createdAt)) {
                const [y, m, d, h, min, s] = t.createdAt;
                dateObj = new Date(y, (m || 1) - 1, d || 1, h || 0, min || 0, s || 0);
            } else {
                dateObj = new Date(t.createdAt);
            }
        }
        
        const dateStr = dateObj.toLocaleDateString();
        const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        let displayType = t.type || "N/A";
        let baseType = displayType;
        let assetName = "-";
        
        if (displayType.includes("_")) {
            const [action, symbol] = displayType.split("_");
            baseType = action;
            assetName = symbol;
        } else if (baseType === "DEPOSIT" || baseType === "WITHDRAW") {
            assetName = "Fiat Funds";
        }

        return (
        <tr key={index}>
          <td>{dateStr}</td>
          <td>{timeStr}</td>
          <td style={{fontWeight: '600', color: '#4b5563'}}>{assetName}</td>
          <td>{baseType}</td>
          <td style={{ 
            color: (baseType === 'DEPOSIT' || baseType === 'SELL') ? '#10b981' : 
                   (baseType === 'WITHDRAW' || baseType === 'BUY') ? '#ef4444' : '#111827',
            fontWeight: '500'
          }}>
            {(baseType === 'WITHDRAW' || baseType === 'BUY') ? '-' : '+'}₹{t.amount || 0}
          </td>
        </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan="5" style={{ textAlign: "center" }}>
          No transactions found
        </td>
      </tr>
    )}
  </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionTable;