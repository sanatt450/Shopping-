import React from "react";
import "./Navbar.css";
import navlogo from "../../assets/nav-logo.svg";
import navProfile from "../../assets/nav-profile.svg";
const Navbar = () => {
  return (
    <div className="navbar">
      <img src={navlogo} className="nav-logo" alt="Logo" />
      <div className="second-things">
        <button
          className="back-to-store-btn"
          onClick={() => (window.location.href = "https://mern-ecom-tau.vercel.app/")}
        >
          Back to Shop Site
        </button>
        <img src={navProfile} className="nav-profile" alt="Profile" />
      </div>
    </div>
  );
};

export default Navbar;
