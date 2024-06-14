import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const Card = ({courseCode, courseName,}) => {
  const navigate = useNavigate();
  return (
    <div className="course-card" onClick={() => navigate('/CourseHome')}>
        <img src="../../public/webpic.svg" alt="Course" />
        {/* <h2>COSC 499</h2> */}
        <h2>{courseCode}</h2>
        {/* <p>Software Engineering Capstone</p> */}
        <p>{courseName}</p>

    </div>
  );
};

export default Card;