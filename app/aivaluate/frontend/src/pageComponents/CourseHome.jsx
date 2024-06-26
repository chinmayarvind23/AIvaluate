import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import '../CourseHome.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import SideMenuBar from '../components/SideMenuBar';
import '../styles.css';
import '../CourseHome.css';
import axios from 'axios';

const aivaluatePurple = {
    color: '#4d24d4'
  }

  const CourseHome = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
  
    useEffect(() => {
      axios.get(`http://localhost:4000/courses/${courseId}`)
        .then(response => {
          setCourse(response.data);
        })
        .catch(error => {
          console.error('Failed to fetch course details', error);
          // Handle failure properly
          navigate('/dashboard'); // redirect if the course is not found or error occurs
        });
    }, [courseId, navigate]);


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
    const confirmDelete = window.confirm("Are you sure you want to delete this course? Deleting this course will remove all associated assignments, rubrics, and student grades permanently.");
    axios.delete(`http://localhost:4000/courses/${courseId}`)
      .then(response => {
        console.log(response.data);
        window.confirm('Course deleted successfully');
        navigate('/dashboard');
      })
      .catch(error => {
        console.error('Failed to delete course', error);
        // Handle failure properly
      });
  }

  return (
    <div>
      <AIvaluateNavBar navBarText={course?.courseName || 'Course Details'} />
      <SideMenuBar tab='home' />
      <div style={{marginTop: '120px'}}>
        <button className="delete-button" onClick={handleDeleteCourse}>Delete Course</button>
      </div>
    </div>
  );
};

export default CourseHome;

