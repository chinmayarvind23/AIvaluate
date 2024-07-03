import CircumIcon from "@klarr-agency/circum-icons-react";
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CourseCards.css';

const Card = ({courseId, courseCode, courseName, user="stu"}) => {
  // console.log("Card props:", { courseId, courseCode, courseName, maxStudents, user });
  const navigate = useNavigate();
  const [enrolled, SetEnrolled] = useState(false);

  const handleClick = async () => {
    if (courseCode === 'Create Course') {
      navigate('/eval/createcourse');
    } else if (user === 'prof'){
      navigate(`/eval/grades/${courseId}`);
    } else if (user === 'stu'){
      navigate(`/stu/grades/${courseId}`)
    } else if (user === 'joinCourse'){
      const confirmed = window.confirm(`Are you sure you want to enroll in the course: ${courseName} (${courseCode})?`);
      if (confirmed) {
        try {
          const response = await axios.post('http://localhost:5173/stu-api/enroll-course', { courseId }, { withCredentials: true });
          if (response.status === 200) {
            alert('Successfully enrolled in the course!');
            SetEnrolled(true);
          }
        } catch (error) {
          console.error('Error enrolling in course:', error);
          alert('Error enrolling in course');
        }
      }
    }
  };
  
  return (
    <div className={courseCode === 'Create Course' ? "add-course-card course-card" : "course-card"}  onClick={handleClick}>
        {(courseCode === 'Create Course' || user === 'joinCourse') ? (
          <img src="../../public/create-course2.svg" alt="Default Course Image" />
        ) : (
          user === 'stu' ? (
            <img src="../../public/student-course-image.svg" alt="Student Course Image" />
          ) : (
            <img src="../../public/prof-course-image.svg" alt="Professor Course Image" />
          )
        )}
        {enrolled && (
          <div className="check-overlay">
            <CircumIcon name="circle_check" className="check-icon" />
          </div>
        )}
        {/* <h2>COSC 499</h2> */}
        <h2>{courseCode}</h2>
        {/* <p>Software Engineering Capstone</p> */}
        <p>{courseName}</p>
        <div>
          {(courseCode === 'Create Course' || user === 'joinCourse') && <CircumIcon name="circle_plus" />}
        </div>
    </div>
  );
};

export default Card;