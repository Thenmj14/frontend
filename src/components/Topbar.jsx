import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import API from "../services/api";
import "../styles/topbar.css";

function Topbar() {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    API.get("/auth/me")
      .then((res) => {
        if (res.data && res.data.profileImage) {
          setProfileImage(res.data.profileImage);
        }
      })
      .catch((err) => console.log("Failed to load user info for topbar"));
  }, []);

  return (
    <div className="topbar">
      <h2 className="topbar-title">VaultCore Market Overview</h2>

      <div className="topbar-right">
        <div 
          className="profile" 
          onClick={() => navigate('/profile')}
          style={{ 
             cursor: 'pointer',
             backgroundImage: profileImage ? `url(${profileImage})` : "none",
             backgroundSize: "cover",
             backgroundPosition: "center"
          }}
          title="Profile Settings"
        >
          {!profileImage && <FiUser />}
        </div>
      </div>
    </div>
  );
}

export default Topbar;