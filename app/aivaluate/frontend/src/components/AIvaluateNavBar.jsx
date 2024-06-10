import React, { useState } from 'react';
import '../styles.css';

const AIvaluateNavBar = ({navBarText}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    console.log(`menu open - ${!menuOpen}`); 
  };

  const clickedMenu = {
    color: 'white',
    background: '#4d24d4',
    float: 'right',
    marginBottom: '10px'
  };

  const boostFromTop = {
    marginTop: '120px',
    color: '#4d24d4',
  };
    return (
        <div>
            <header className="header">
                <div className="circle"></div>
                <h1>{navBarText}</h1>
                <div className="menu">
                <button onClick={toggleMenu}>
                    &#9776;
                </button>
                <div className={`dropdown ${menuOpen ? 'show' : ''}`}>
                <button onClick={toggleMenu}  style={clickedMenu}>
                    &#9776;
                </button>
                    <a href="#" style={boostFromTop} className="selected">Home</a>
                    <a href="#">Account</a>
                    <a href="login">Logout</a>
                    <a href="#">Join a Course</a>
                    <a href="#">Get Help...</a>
                </div>
                </div>
            </header>
        </div>
    )
}
export default AIvaluateNavBar;