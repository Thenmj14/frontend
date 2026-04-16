import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import API from "../services/api";
import "../styles/profile.css";
import "../styles/dashboard.css";

function Profile() {
  const [username, setUsername] = useState("Loading...");
  const [profileImage, setProfileImage] = useState("");
  const [balance, setBalance] = useState(0);
  const [profit, setProfit] = useState(0);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdMessage, setPwdMessage] = useState("");
  const [showSecurity, setShowSecurity] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const fileInputRef = useRef(null);

  const [transferAmount, setTransferAmount] = useState("");
  const [transferMessage, setTransferMessage] = useState("");

  const fetchBalance = () => {
    API.get("/accounts")
      .then(res => {
        const acc = res.data.find(a => a.id === 1) || res.data[0];
        if (acc) setBalance(acc.balance);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUsername(payload.sub || "Trader");
      }
    } catch (e) {}

    API.get("/auth/me")
      .then((res) => {
        setUsername(res.data.username);
        setProfileImage(res.data.profileImage || "");
      })
      .catch((err) => console.log("Could not load user profile"));

    fetchBalance();

    API.get("/transactions/1")
      .then((res) => {
        const extractedData = res.data?.transactions || res.data?.content || res.data?.data || (Array.isArray(res.data) ? res.data : []);
        let txs = Array.isArray(extractedData) ? extractedData : [];
        const totalBuy = txs.filter((t) => t.type === "BUY").reduce((acc, t) => acc + t.amount, 0);
        const totalSell = txs.filter((t) => t.type === "SELL").reduce((acc, t) => acc + t.amount, 0);
        setProfit(totalSell - totalBuy);
      })
      .catch(() => {
        setProfit(0);
      });
  }, []);

  const handleTransfer = async (type) => {
    if (!transferAmount || isNaN(transferAmount) || Number(transferAmount) <= 0) {
      setTransferMessage("❌ Enter a valid amount");
      return;
    }
    setTransferMessage("Processing...");
    try {
      const url = type === "deposit" ? "/accounts/1/deposit" : "/accounts/1/withdraw";
      await API.post(`${url}?amount=${transferAmount}`);
      setTransferMessage(`✅ ${type === "deposit" ? "Deposited" : "Transferred"} successfully!`);
      setTransferAmount("");
      fetchBalance();
    } catch (err) {
      setTransferMessage(`❌ Failed: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMessage("");
    if (!oldPassword || !newPassword) return;
    try {
      await API.post("/auth/change-password", { oldPassword, newPassword });
      setPwdMessage("✅ Password changed successfully");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setPwdMessage("❌ " + (err.response?.data?.message || "Failed to change password"));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    try {
      const newName = editUsername.trim() || username;
      const res = await API.post("/auth/update-profile", { username: newName, profileImage });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      setUsername(newName);
      setIsEditingProfile(false);
    } catch (err) {
      alert("Failed to save profile: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  const getSuggestion = () => {
    if (profit < 0) return "Markets fluctuate. Consider holding your underperforming assets or establishing a stop-loss.";
    if (profit > 1000) return "Excellent returns! Diversifying some profits into stablecoins might be a wise choice.";
    if (profit > 0) return "You're in the green. Keep a close eye on resistance levels to secure your gains.";
    return "You have a clean slate. Analyze the order book before making your first move.";
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="profile-container">
          
          <div className="profile-header-card">
            <div 
              className="profile-avatar" 
              onClick={() => {
                 if(isEditingProfile) fileInputRef.current.click();
              }}
              style={{
                cursor: isEditingProfile ? "pointer" : "default",
                backgroundImage: profileImage ? `url(${profileImage})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              {!profileImage && username.charAt(0).toUpperCase()}
              {isEditingProfile && <div className="avatar-edit-overlay">📷</div>}
            </div>
            <input 
               type="file" 
               accept="image/*" 
               ref={fileInputRef} 
               style={{ display: "none" }} 
               onChange={handleImageUpload} 
            />

            <div className="profile-info" style={{ flexGrow: 1 }}>
              {isEditingProfile ? (
                <input 
                  type="text" 
                  className="profile-name-input"
                  value={editUsername} 
                  onChange={e => setEditUsername(e.target.value)} 
                  placeholder={username}
                />
              ) : (
                <h2>{username}</h2>
              )}
              <p>Pro Member</p>
            </div>

            <div className="profile-actions">
              {isEditingProfile ? (
                 <button className="save-profile-btn" onClick={saveProfile}>Save Profile</button>
              ) : (
                 <button className="edit-profile-btn" onClick={() => {
                   setEditUsername(username);
                   setIsEditingProfile(true);
                 }}>Edit Profile</button>
              )}
            </div>
          </div>

          <div className="profile-grid">
            <div className="profile-side-col">
              <div className="profile-stat-card">
                <span className="stat-label">Wallet</span>
                <span className="stat-val">₹{balance.toFixed(2)}</span>
              </div>
              <div className="profile-stat-card">
                <span className="stat-label">Total Profit / Loss</span>
                <span className={`stat-val ${profit >= 0 ? "profit-up" : "profit-down"}`}>
                  {profit >= 0 ? "+" : "-"}₹{Math.abs(profit).toFixed(2)}
                </span>
              </div>
              <div className="suggestion-card">
                <h3>💡 AI Suggestion</h3>
                <p>{getSuggestion()}</p>
              </div>
            </div>

            <div className="profile-main-col">
              <div className="funds-card">
                <h3>Manage Funds</h3>
                <p>Deposit to your Wallet or transfer to your Bank Account</p>
                <div className="input-group">
                   <label>Amount (₹)</label>
                   <input
                     type="number"
                     placeholder="Enter amount"
                     value={transferAmount}
                     onChange={(e) => setTransferAmount(e.target.value)}
                   />
                </div>
                <div className="funds-buttons">
                   <button className="deposit-btn" onClick={() => handleTransfer("deposit")}>Add to Wallet</button>
                   <button className="withdraw-btn" onClick={() => handleTransfer("withdraw")}>Transfer to Bank</button>
                </div>
                {transferMessage && <p className="transfer-msg">{transferMessage}</p>}
              </div>

              <div className="security-toggle-card" style={{ marginTop: '24px' }}>
                <div className="security-toggle-header" onClick={() => setShowSecurity(!showSecurity)}>
                  <h3>Security Settings</h3>
                  <button className="toggle-btn">{showSecurity ? "Hide" : "Show"}</button>
                </div>

                {showSecurity && (
                  <div className="security-content">
                    <p>Change your password</p>
                    <form onSubmit={handleChangePassword}>
                      <div className="input-group">
                        <label>Current Password</label>
                        <input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="Enter current password"
                        />
                      </div>
                      <div className="input-group">
                        <label>New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                        />
                      </div>
                      <button type="submit" className="save-btn">Update Password</button>
                      {pwdMessage && <p className="pwd-msg">{pwdMessage}</p>}
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;
