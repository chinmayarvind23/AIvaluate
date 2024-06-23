import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
// import '../styles.css';
import '../CreateCourse.css';
import '../GeneralStyling.css';

const aivaluatePurple = {
    color: '#4d24d4'
}

const CreateCourse = () => {
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [maxStudents, setMaxStudents] = useState('');
  const [instructor] = useState('Dr. Scott Fazackerley');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/courses', {
        courseName,
        courseCode,
        maxStudents,
      });
      console.log('Course created successfully:', response.data);
      navigate('/dashboard'); // Redirect to dashboard or another page after successful creation
    } catch (error) {
      console.error('There was an error creating the course:', error);
    }
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
                  name="courseName"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <h3>Course Number</h3>
                <input 
                  type="text" 
                  name="courseCode"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                />
              </div>
              <div className="form-group">
                <h3>Maximum Number of Students</h3>
                <input 
                  type="text" 
                  name="maxStudents"
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
