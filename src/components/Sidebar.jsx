import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiTrendingUp,
  FiCreditCard,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut
} from "react-icons/fi";
import "../styles/sidebar.css";

function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
    setOpen(false); // close on mobile
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="menu-btn" onClick={() => setOpen(true)}>
        <FiMenu size={24} />
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${open ? "open" : ""}`} style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="sidebar-header">
          <h2 className="logo">VaultCore</h2>
          <FiX className="close-btn" onClick={() => setOpen(false)} />
        </div>

        <ul style={{ flex: 1 }}>
          <li onClick={() => handleNav("/dashboard")}>
            <FiHome /> Dashboard
          </li>

          <li onClick={() => handleNav("/trading")}>
            <FiTrendingUp /> Stock Market
          </li>

          <li onClick={() => handleNav("/transactions")}>
            <FiCreditCard /> Transactions
          </li>

          <li onClick={() => handleNav("/profile")}>
            <FiUser /> Profile
          </li>
        </ul>

        <div className="sidebar-footer" style={{ marginTop: 'auto' }}>
          <ul>
            <li onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }} style={{ color: '#ef4444' }}>
              <FiLogOut /> Logout
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Sidebar;