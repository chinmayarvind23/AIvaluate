import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import CourseCards from '../components/CourseCards';
import '../styles.css';

const Dashboard = () => {
  const navigate = useNavigate();
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
      <AIvaluateNavBar navBarText='Hello Colton' tab="home" />
      <CourseCards />
    </div>
  );
};

export default Dashboard;
