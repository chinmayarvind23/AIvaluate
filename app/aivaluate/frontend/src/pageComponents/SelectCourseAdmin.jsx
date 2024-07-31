import CircumIcon from "@klarr-agency/circum-icons-react";
import React, { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AIvaluateNavBarAdmin from "../components/AIvaluateNavBarAdmin";
import SideMenuBarAdmin from "../components/SideMenuBarAdmin";
import '../GeneralStyling.css';
import '../SelectStudentAdmin.css';
import '../ToastStyles.css';

const SelectCourseAdmin = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [course, setCourse] = useState({});
    const [students, setStudents] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [newInstructorId, setNewInstructorId] = useState('');

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5173/admin-api/courses/${courseId}`, {
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCourse(data);
                setStudents(data.students || []);
                setInstructors(data.instructors || []);
            } catch (error) {
                console.error('Error fetching course details:', error);
                toast.error('Failed to fetch course details');
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    const handleDelete = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                const handleConfirmDelete = async () => {
                    try {
                        const response = await fetch(`http://localhost:5173/admin-api/courses/${courseId}`, {
                            method: 'DELETE',
                            credentials: 'include'
                        });
                        if (response.ok) {
                            toast.success("Course deleted successfully.");
                            navigate('/admin/courseManager');
                        } else {
                            toast.error('Failed to delete the course');
                        }
                    } catch (error) {
                        console.error('Error deleting course:', error);
                        toast.error('Failed to delete the course');
                    }
                    onClose();
                };

                return (
                    <div className="custom-ui">
                        <h1>Confirm Deletion</h1>
                        <p>Are you sure you want to delete this course?</p>
                        <div className="button-group">
                            <button onClick={onClose} className="cancel-button">Cancel</button>
                            <button onClick={handleConfirmDelete} className="confirm-button">Confirm</button>
                        </div>
                    </div>
                );
            },
            overlayClassName: "custom-overlay"
        });
    };

    const handleAssignInstructor = async () => {
        try {
            const response = await fetch(`http://localhost:5173/admin-api/courses/${courseId}/instructors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ instructorId: newInstructorId })
            });
            if (response.ok) {
                const newInstructor = await response.json();
                setInstructors([...instructors, newInstructor]);
                toast.success(`Instructor ${newInstructorId} assigned successfully`);
                setNewInstructorId('');
            } else {
                toast.error('Failed to assign the instructor');
            }
        } catch (error) {
            console.error('Error assigning instructor:', error);
            toast.error('Failed to assign the instructor');
        }
    };

    return (
        <div>
            <ToastContainer />
            <AIvaluateNavBarAdmin navBarText="Admin Home Portal" />
            <div className="filler-div">
                <SideMenuBarAdmin tab="courseManager" />
                <div className="main-margin">
                    <div className="top-bar">
                        <div className="back-btn-div">
                            <button className="main-back-button" onClick={() => navigate(-1)}><CircumIcon name="circle_chev_left" /></button>
                        </div>
                        <h1>Course Info</h1>
                    </div>
                    <div className="center-it">
                        <div>
                            <div className="user-info2">
                                <div className="user-name">
                                    <span>{course.courseName} ({course.courseCode})</span>
                                    <span>Course ID: {course.courseId}</span>
                                </div>
                                <div className="description">
                                    <span>Description: </span>
                                    <span>{course.courseDescription}</span>
                                </div>
                                <div className="max-students">
                                    <span>Max Students: </span>
                                    <span>{course.maxStudents}</span>
                                </div>
                                <div className="students">
                                    <span>Enrolled Students:</span>
                                    <ul>
                                        {students.map((student, index) => (
                                            <li key={index}>
                                                {student.firstName} {student.lastName} ({student.studentId})
                                                <button className="drop-button" onClick={() => handleDropStudent(student.studentId)}>Drop</button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="instructors">
                                    <span>Assigned Instructors/TAs:</span>
                                    <ul>
                                        {instructors.map((instructor, index) => (
                                            <li key={index}>
                                                {instructor.firstName} {instructor.lastName} ({instructor.instructorId})
                                                <button className="drop-button" onClick={() => handleDropInstructor(instructor.instructorId)}>Remove</button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="assign-instructor">
                                    <input 
                                        type="text" 
                                        placeholder="Instructor ID" 
                                        value={newInstructorId} 
                                        onChange={(e) => setNewInstructorId(e.target.value)} 
                                    />
                                    <button onClick={handleAssignInstructor}>Assign Instructor</button>
                                </div>
                                <button className="delete-button" onClick={handleDelete}>Delete course</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectCourseAdmin;
