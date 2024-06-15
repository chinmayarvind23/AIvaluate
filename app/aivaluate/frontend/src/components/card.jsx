import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const Card = ({courseCode, courseName, courseImage="../../public/student-course-image.svg"}) => {
  const navigate = useNavigate();
  
  return (
    <div className="course-card" onClick={() => navigate('/CourseHome')}>
        <img src={courseImage} />
        {/* <h2>COSC 499</h2> */}
        <h2>{courseCode}</h2>
        {/* <p>Software Engineering Capstone</p> */}
        <p>{courseName}</p>

    </div>
  );
};

export default Card;