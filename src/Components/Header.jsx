import React from "react";
import logo from "../logo.png";
import PlusCircle from "./PlusCircle.jsx";
import { useNavigate } from "react-router-dom";
import styles from "./header.module.css";

function Header() {
  const navigate = useNavigate();
  function handleGigitsRoute() {
    window.location.href = "https://gigits.io/";
  }

  function handleHomeRoute() {
    navigate("/");
  }

  return (
    <div className={styles.headerContainer}>
      <div className={styles.leftSide} onClick={handleHomeRoute}>
        <div className={styles.titleContainer}>
          {/* <PlusCircle fill='transparent' /> */}
          <h2>
            The <span>School</span> of Life
          </h2>
          <h3>real-world knowledge</h3>
        </div>
      </div>
      <div className={styles.logoContainer} onClick={handleGigitsRoute}>
        <img src={logo} alt='logo' />
      </div>
    </div>
  );
}

export default Header;
