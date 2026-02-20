import "../styles/table.css";

function TransactionTable() {
  const transactions = [
    { id: 1, type: "Deposit", amount: "+₹10,000", status: "Success" },
    { id: 2, type: "Withdraw", amount: "-₹5,000", status: "Pending" },
    { id: 3, type: "Trade Buy", amount: "-₹12,000", status: "Success" },
    { id: 4, type: "Trade Sell", amount: "+₹18,500", status: "Success" },
  ];

  return (
    <div className="table-card">
      <h3>Recent Transactions</h3>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.type}</td>
              <td>{t.amount}</td>
              <td>
                <span className={`status ${t.status.toLowerCase()}`}>
                  {t.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;