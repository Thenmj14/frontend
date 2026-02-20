import { useState } from "react";
import {
  FiHome,
  FiTrendingUp,
  FiCreditCard,
  FiMenu,
  FiX,
} from "react-icons/fi";
import "../styles/sidebar.css";

function Sidebar() {
  const [open, setOpen] = useState(false);

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
      <div className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2 className="logo">VaultCore</h2>
          <FiX className="close-btn" onClick={() => setOpen(false)} />
        </div>

        <ul>
          <li><FiHome /> Dashboard</li>
          <li><FiTrendingUp /> Trading</li>
          <li><FiCreditCard /> Transactions</li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;