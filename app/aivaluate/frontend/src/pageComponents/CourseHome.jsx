import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Assignment.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import SideMenuBar from '../components/SideMenuBar';
import '../styles.css';

const aivaluatePurple = {
    color: '#4d24d4'
  }

const AssignmentOverview = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    console.log(`menu open - ${!menuOpen}`); // Logging state change
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
      <AIvaluateNavBar navBarText='COSC 499 - Software Engineering Capstone'  />
      <SideMenuBar tab='home' />`
    </div>
  );
};

export default AssignmentOverview;
