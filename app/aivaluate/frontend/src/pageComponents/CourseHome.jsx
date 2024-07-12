import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../CourseHome.css';
import '../GeneralStyling.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import SideMenuBarEval from '../components/SideMenuBarEval';
import AssignTaModal from './AssignTaModal';
import CourseEditModal from './CourseEditModal';

const CourseHome = () => {
    const courseCode = sessionStorage.getItem('courseCode');
    const courseName = sessionStorage.getItem('courseName');
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState({});
    const [menuOpen, setMenuOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isTaModalOpen, setIsTaModalOpen] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:5173/eval-api/courses/${courseId}`)
            .then(response => {
                setCourse(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch course details', error);
                navigate('/eval/dashboard'); // redirect if the course is not found or error occurs
            });
    }, [courseId, navigate]);

    const handleEditCourse = () => {
        setIsEditModalOpen(true);
    };
    
    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleTaModal = () => {
        setIsTaModalOpen(true);
    };

    const closeTaModal = () => {
        setIsTaModalOpen(false);
    };

    const saveCourseEdits = (editedCourse) => {
        axios.put(`http://localhost:5173/eval-api/courses/${courseId}`, editedCourse)
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
        axios.delete(`http://localhost:5173/eval-api/courses/${courseId}`)
            .then(response => {
                console.log(response.data);
                window.confirm('Course deleted successfully');
                navigate('/eval/dashboard');
            })
            .catch(error => {
                console.error('Failed to delete course', error);
                // Handle failure properly
            });
    }
    const navBarText = `${courseCode} - ${courseName}`;

    return (
        <div>
            <AIvaluateNavBarEval navBarText={navBarText} />
            <SideMenuBarEval tab='management' />
            <div className="main-margin">
                <div className="top-bar">
                    <h1>Course Management</h1>
                </div>
                <div>
                    <button className="course-button" onClick={handleDeleteCourse}>Delete Course</button>
                    <br />
                    <button className="course-button" onClick={handleEditCourse}>Edit Course</button>
                    <CourseEditModal isOpen={isEditModalOpen} onClose={closeEditModal} course={course} onSave={saveCourseEdits} />
                    <br />
                    <button className="course-button" onClick={handleTaModal}>Assign TA</button>
                    <AssignTaModal isOpen={isTaModalOpen} onClose={closeTaModal} courseId={courseId} />
                    <br />
                </div>
            </div>
        </div>
    );
};

export default CourseHome;