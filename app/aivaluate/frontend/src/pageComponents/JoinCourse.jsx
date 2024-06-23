import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // run npm install react-icons
import { useNavigate } from 'react-router-dom';
import '../SearchBar.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import CourseCards from '../components/CourseCards';
// import '../styles.css';

const JoinCourse = () => {
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
      <AIvaluateNavBar navBarText='Join a Course' tab="join-course" />
      <div className="search-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search a course" />
        </div>
      </div>
      <CourseCards />
    </div>
  );
};

export default JoinCourse;
