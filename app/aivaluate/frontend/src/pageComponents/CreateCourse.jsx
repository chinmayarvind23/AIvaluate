import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import '../styles.css';
import '../GeneralStyling.css';
import '../CreateCourse.css';

const aivaluatePurple = {
    color: '#4d24d4'
}

const CreateCourse = () => {
  const [courseName, setCourseName] = useState('');
  const [courseNumber, setCourseNumber] = useState('');
  const [maxStudents, setMaxStudents] = useState('');
  const [instructor] = useState('Dr. Scott Fazackerley');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log({
      courseName,
      courseNumber,
      maxStudents,
      instructor
    });
  };

  return (
    <>
      <AIvaluateNavBar navBarText='Create a Course' />
      <div className='secondary-colorbg form-container'>
        <section>
          <div className="form-content">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <h3>Course Name</h3>
                <input 
                  type="text" 
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <h3>Course Number</h3>
                <input 
                  type="text" 
                  value={courseNumber}
                  onChange={(e) => setCourseNumber(e.target.value)}
                />
              </div>
              <div className="form-group">
                <h3>Maximum Number of Students</h3>
                <input 
                  type="text" 
                  value={maxStudents}
                  onChange={(e) => setMaxStudents(e.target.value)}
                />
              </div>
              <div className="form-group">
                <h3>Instructor</h3>
                <input
                  type="text"
                  className="instructor-input" /* Add class for styling */
                  value={instructor}
                  disabled
                />
              </div>
              <button type="submit" className="create-course-button">Create Course</button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
};

export default CreateCourse;
