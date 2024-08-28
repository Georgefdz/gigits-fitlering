import React from 'react'
import logo from '../logo.png'
import globe from '../globe.png'


function Header() {
  return (
    <div className='header-container'>
        <div className='link-container'>
            <a href='https://gigits.io/'>Time Hacker</a>
            <a href='https://gigits.io/about'>About Gigits</a>
            <a href='https://gigits.io/platform'>Productivity App</a>
        </div>
        <div className='logo-container'>
            <img src={logo} alt='logo' />
        </div>
        <div className='signin-container'>
            <span> <img src={globe} alt="" />English</span>
            <button>Sign in</button>
        </div>
    </div>
  )
}

export default Header