import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import '../CourseHome.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import SideMenuBar from '../components/SideMenuBar';
import '../styles.css';
import '../CourseHome.css';
import axios from 'axios';
import Modal from 'react-modal';

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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Modal for editing course details
  const EditCourseModal = ({ isOpen, onClose, course, onSave }) => {
    const [editedCourse, setEditedCourse] = useState({ ...course });
  
    useEffect(() => {
      setEditedCourse(course); // Update state when course prop changes
    }, [course]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditedCourse(prev => ({ ...prev, [name]: value }));
    };
  
    return (
      <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Edit Course" className="modal" overlayClassName="overlay">
        <h2 className="modal-title">Edit Course Details</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSave(editedCourse);

          // Reload the page to reflect the updated course details
          window.location.reload();
        }} className="edit-course-form">
          <div className="form-group">
            <label htmlFor="courseName" className="form-label">
              Course Name:
            </label>
            <input
              type="text"
              id="courseName"
              name="courseName"
              className="course-form-input"
              value={editedCourse.courseName || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="courseCode" className="form-label">
              Course Code:
            </label>
            <input
              type="text"
              id="courseCode"
              name="courseCode"
              className="course-form-input"
              value={editedCourse.courseCode || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="maxStudents" className="form-label">
              Max Students:
            </label>
            <input
              type="number"
              id="maxStudents"
              name="maxStudents"
              className="course-form-input"
              value={editedCourse.maxStudents || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="course-save-button">Save Changes</button>
            <button type="button" className="course-cancel-button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </Modal>
    );
  };
  
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
    
    if (!confirmDelete) {
      return;
    }
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

  const handleEditCourse = () => {
    setIsEditModalOpen(true);
  };
  
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const saveCourseEdits = (editedCourse) => {
    axios.put(`http://localhost:4000/courses/${courseId}`, editedCourse)
      .then(response => {
        console.log('Course updated:', response.data);
        setCourse(response.data); // Update the course details displayed      
        closeEditModal();
      })
      .catch(error => {
        console.error('Failed to update course', error);
        // Optionally show an error message here
      });
  };


  return (
    <div>
      <AIvaluateNavBar navBarText={course?.courseName} />
      <SideMenuBar tab='home' />
      <div style={{marginTop: '120px'}}>
        <button className="course-delete-button" onClick={handleDeleteCourse}>Delete Course</button>
        <br />
        <button className="course-edit-button" onClick={handleEditCourse}>Edit Course</button>
        <EditCourseModal isOpen={isEditModalOpen} onClose={closeEditModal} course={course} onSave={saveCourseEdits} />
      </div>
    </div>
  );
};

export default CourseHome;

