// Run in frontend terminal: npm i -D @klarr-agency/circum-icons-react
import CircumIcon from "@klarr-agency/circum-icons-react";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';


const Card = ({courseCode, courseName, user="stu"}) => {
  const navigate = useNavigate();
  
  return (
    <div className={courseCode === 'Create Course' ? "add-course-card course-card" : "course-card"} onClick={() => navigate('/CourseHome')}>
        {courseCode === 'Create Course' ? (
        <img src="../../public/create-course2.svg" alt="Default Course Image" />
      ) : (
        user === 'stu' ? (
          <img src="../../public/student-course-image.svg" alt="Student Course Image" />
        ) : (
          <img src="../../public/prof-course-image.svg" alt="Professor Course Image" />
        )

      )}
        {/* <h2>COSC 499</h2> */}
        <h2>{courseCode}</h2>
        {/* <p>Software Engineering Capstone</p> */}
        <p>{courseName}</p>
        <div>
          {courseCode === 'Create Course' && <CircumIcon name="circle_plus" />}
        </div>
    </div>
  );
};

export default Card;