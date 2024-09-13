import React from "react";
import logo from "../logo.png";
import PlusCircle from "./PlusCircle.jsx";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  function handleGigitsRoute() {
    window.location.href = "https://gigits.io/";
  }

  function handleHomeRoute() {
    navigate("/");
  }

  return (
    <div className='header-container'>
      <div className='left-side' onClick={handleHomeRoute}>
        <div className='title-container'>
          <PlusCircle fill='transparent' />
          <h2>
            The <span>School</span> of Life
          </h2>
          <h3>real-world knowledge</h3>
        </div>
      </div>
      <div className='logo-container' onClick={handleGigitsRoute}>
        <span>back to</span>
        <img src={logo} alt='logo' />
      </div>
    </div>
  );
}

export default Header;
