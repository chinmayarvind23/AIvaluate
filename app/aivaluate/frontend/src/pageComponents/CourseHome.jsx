import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CourseHome.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import SideMenuBar from '../components/SideMenuBar';
import '../styles.css';

const aivaluatePurple = {
    color: '#4d24d4'
  }

const CourseHome = () => {
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

  const handleDeleteCourse = () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
        // Add your deletion logic here
        console.log('Course deleted');
        // Optionally navigate to another page after deletion
    }
};

  return (
    <div>
      <AIvaluateNavBar navBarText='COSC 499 - Software Engineering Capstone'  />
      <SideMenuBar tab='home' />
      <div style={{marginTop: '120px'}}>
                {/* <button style={buttonStyle} onClick={handleEditCourse}>Edit Course</button> */}
                {/* <button style={buttonStyle} onClick={handleDeleteCourse}>Delete Course</button> */}
            </div>
    </div>
  );
};

export default CourseHome;
