import React, { useState } from 'react';
import '../GeneralStyling.css';
import '../NavBar.css';

const AIvaluateNavBarEval = ({navBarText , tab}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    console.log(`menu open - ${!menuOpen}`); 
  };


  const boostFromTop = {
    marginTop: '120px'
  };
    return (
        <div>
            <header className="header primary-colorbg rborder">
                <div className="circle secondary-colorbg"></div>
                <h1>{navBarText}</h1>
                <div className="menu">
                <button onClick={toggleMenu} className={menuOpen ? 'active' : ''}>
                    &#9776;
                </button>
                <div className={`dropdown ${menuOpen ? 'show secondary-colorbg' : 'primary-colorbg'}`}>
                    <a href="eval/dashboard" style={boostFromTop} className={`${tab === "home" ? 'primary-color-text' : 'third-color-text'}`}>Home</a>
                    <a href="account" className={`${tab === "account" ? 'primary-color-text' : 'third-color-text'}`}>Account</a>
                    <a href="AdminProfLogin" className={`${tab === "login" ? 'primary-color-text' : 'third-color-text'}`}>Logout</a>
                    <a href="help" className={`${tab === "help" ? 'primary-color-text' : 'third-color-text'}`}>Get Help...</a>
                </div>
                </div>
            </header>
        </div>
    ) 
}
export default AIvaluateNavBarEval;