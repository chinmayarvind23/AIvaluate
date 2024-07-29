import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import '../CreateCourse.css';
import '../GeneralStyling.css';
import '../ToastStyles.css';
import '../ToastStyles.css';

const CreateCourse = () => {
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [instructorId, setInstructorId] = useState('');
  const [maxStudents, setMaxStudents] = useState('');
  const [taId, setTaId] = useState('');
  const [instructors, setInstructors] = useState([]);
  const [tas, setTAs] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const setCourseIdInSession = useCallback(async (courseId) => {
    try {
      await axios.post('http://localhost:5173/eval-api/set-course-only', { courseId }, { withCredentials: true });
      sessionStorage.setItem('courseId', courseId);
    } catch (error) {
      console.error('Failed to set course ID in session:', error);
    }
  }, []);
  
  const ensureCourseIdInSession = useCallback(async () => {
    let courseId = sessionStorage.getItem('courseId');
  
    if (!courseId) {
      console.error('Course ID is missing from session storage.');
      return;
    }
  
    await setCourseIdInSession(courseId);
  }, [setCourseIdInSession]);
  
  useEffect(() => {
    ensureCourseIdInSession();
  }, [ensureCourseIdInSession]);  

  useEffect(() => {
    const fetchInstructorsAndTAs = async () => {
      try {
        const instructorResponse = await axios.get('http://localhost:5173/eval-api/instructors');
        setInstructors(instructorResponse.data);
  
        const taResponse = await axios.get('http://localhost:5173/eval-api/tas');
        setTAs(taResponse.data);
      } catch (error) {
        console.error('Error fetching instructors and TAs:', error);
      }
    };
  
    fetchInstructorsAndTAs();
  }, []);  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseName || !courseCode) {
    if (!courseName || !courseCode) {
      setErrorMessage('All fields are required.');
      toast.error('All fields are required.');
      toast.error('All fields are required.');
      return;
    }

    if (!instructorId) {
      setErrorMessage('Instructor selection is required.');
      toast.error('Instructor selection is required.');
      toast.error('Instructor selection is required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5173/eval-api/courses', {
        courseName,
        courseCode
        courseCode
      });

      const courseId = response.data.courseId;
      await setCourseIdInSession(courseId); 

      if (instructorId) {
        console.log('Assigning instructor:', { courseId, instructorId });
        await axios.post('http://localhost:5173/eval-api/teaches', {
          courseId,
          instructorId
        });
      }

      if (taId) {
        console.log('Assigning TA:', { courseId, taId });
        await axios.post('http://localhost:5173/eval-api/teaches', {
          courseId,
          instructorId: taId
        });
      }

      console.log('Course created successfully:', response.data);
      toast.success('Course created successfully.');
      navigate('/eval/dashboard');
      toast.success('Course created successfully.');
      navigate('/eval/dashboard');
    } catch (error) {
      console.error('There was an error creating the course:', error);
      toast.error('There was an error creating the course.');
      toast.error('There was an error creating the course.');
    }
  };

  return (
    <>
      <AIvaluateNavBarEval navBarText='Create a Course' />
      <div className='form-container'>
      <ToastContainer />
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
                  maxLength="50" // Limit the course name to 50 characters
                  className="drop-down-menu"
                />
              </div>
              <div className="form-group">
                <h3>Course Number</h3>
                <input 
                  type="text" 
                  name="courseCode"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  maxLength="10" // Limit the course code to 10 characters
                  className="drop-down-menu"
                />
              </div>

              <div className="form-group">
                <h3>Instructor</h3>
                <select className="drop-down-menu" value={instructorId} onChange={(e) => setInstructorId(e.target.value)} required>
                  <option value="">Select Instructor</option>
                  {instructors.map(instructor => (
                    <option key={instructor.instructorId} value={instructor.instructorId}>
                      {`${instructor.firstName} ${instructor.lastName}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <h3>Teaching Assistant</h3>
                <select className="drop-down-menu"value={taId} onChange={(e) => setTaId(e.target.value)}>
                  <option value="">None</option>
                  {tas.map(ta => (
                    <option key={ta.instructorId} value={ta.instructorId}>
                      {`${ta.firstName} ${ta.lastName}`}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="create-course-button">Create Course</button>
              {errorMessage && <div className="error-message">{errorMessage}</div>}
            </form>
          </div>
        </section>
      </div>
      <ToastContainer />
    </>
  );
};

export default CreateCourse;
