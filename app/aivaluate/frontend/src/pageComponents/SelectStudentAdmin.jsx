import CircumIcon from "@klarr-agency/circum-icons-react";
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../GeneralStyling.css';
import '../SelectStudentAdmin.css';
import AIvaluateNavBarAdmin from "../components/AIvaluateNavBarAdmin";
import SideMenuBarAdmin from "../components/SideMenuBarAdmin";

const SelectStudentAdmin = () => {
    const navigate = useNavigate();
    const { studentId } = useParams();
    const [student, setStudent] = useState({});
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5173/admin-api/student/${studentId}`, {
                    credentials: 'include'
                });
                const data = await response.json();
                setStudent(data);
                setCourses(data.courses);
            } catch (error) {
                console.error('Error fetching student details:', error);
            }
        };

        fetchStudentDetails();
    }, [studentId]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:5173/admin-api/student/${studentId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                if (response.ok) {
                    alert("User deleted successfully.");
                    navigate('/admin/studentManager'); // Redirect to student manager page after deletion
                } else {
                    alert('Failed to delete the user');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete the user');
            }
        }
    };

    const handleDropCourse = async (courseCode) => {
        const confirmDrop = window.confirm(`Are you sure you want to drop the course ${courseCode}?`);
        if (confirmDrop) {
            try {
                const response = await fetch(`http://localhost:5173/admin-api/student/${studentId}/drop/${courseCode}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                if (response.ok) {
                    setCourses(courses.filter(course => course.courseCode !== courseCode));
                    alert(`Dropped course: ${courseCode}`);
                } else {
                    alert('Failed to drop the course');
                }
            } catch (error) {
                console.error('Error dropping course:', error);
                alert('Failed to drop the course');
            }
        }
    };
    const maskedPassword = student.password ? '*'.repeat(student.password.length) : '';
    return (
        <div>
            <AIvaluateNavBarAdmin navBarText="Admin Home Portal"/>
            <SideMenuBarAdmin tab="studentManager" />
            <div className="main-margin">
                <div className="top-bar">
                    <div className="back-btn-div">
                        <button className="main-back-button" onClick={() => navigate(-1)}><CircumIcon name="circle_chev_left"/></button>
                    </div>
                    <h1>Student Info</h1>
                </div>
                <div className="center-it">
                    <div>
                        <div className="user-info2">
                            <div className="user-name">
                                <span>{student.firstName} {student.lastName}</span>
                                <span>{student.studentId}</span>
                            </div>
                            <div className="email">
                                <span>Email:</span>
                                <span>{student.email}</span>
                            </div>
                            <div className="password">
                                <span>Password:</span>
                                <span>{maskedPassword}</span>
                            </div>
                            <div className="courses">
                                <span>Courses:</span>
                                <ul>
                                    {courses.map((course, index) => (
                                        <li key={index}>
                                            {course.courseCode} 
                                            <button className="drop-button" onClick={() => handleDropCourse(course.courseCode)}>Drop</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button className="delete-button" onClick={handleDelete}>Delete user</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectStudentAdmin;
