import "../styles/topbar.css";

function Topbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="topbar">
      <h2 className="topbar-title">VaultCore Dashboard</h2>

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}

export default Topbar;