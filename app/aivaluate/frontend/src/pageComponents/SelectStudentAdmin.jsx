import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../SelectStudentAdmin.css';
import AIvaluateNavBarAdmin from "../components/AIvaluateNavBarAdmin";
import SideMenuBarAdmin from "../components/SideMenuBarAdmin";

const SelectStudentAdmin = () => {
    const navigate = useNavigate();
    const { studentId } = useParams();
    const [studentDetails, setStudentDetails] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5173/stu-api/student/${studentId}`, { withCredentials: true });
                setStudentDetails(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching student details:', error);
                setLoading(false);
            }
        };

        fetchStudentDetails();
    }, [studentId]);

    const handleDelete = () => {
        // Handle delete user action here
        alert("User deleted successfully.");
    };

    const handleDropCourse = async (courseCode) => {
        const confirmed = window.confirm(`Are you sure you want to drop the course: ${courseCode}?`);
        if (confirmed) {
            try {
                await axios.post('http://localhost:5173/stu-api/drop-course', { studentId, courseCode }, { withCredentials: true });
                alert(`Dropped course: ${courseCode}`);
                setStudentDetails(prevDetails => ({
                    ...prevDetails,
                    courses: prevDetails.courses.filter(c => c !== courseCode)
                }));
            } catch (error) {
                console.error('Error dropping course:', error);
                alert('Error dropping course');
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <AIvaluateNavBarAdmin navBarText="Admin Home Portal" />
            <SideMenuBarAdmin tab="" />
            <div className="select-student-admin-container">
                   <div className="back-button"onClick={() => navigate(-1)}>Back</div>
                   <div className="user-info">
                    <div className="user-name">
                        <span>{studentDetails.firstName} {studentDetails.lastName}</span>
                        <span>{studentDetails.studentId}</span>
                    </div>
                    <div className="major">Major: {studentDetails.major}</div>
                    <div className="email">
                        <span>Email:</span>
                        <span>{studentDetails.email}</span>
                    </div>
                    <div className="password">
                        <span>Password:</span>
                        <span>{studentDetails.password}</span>
                    </div>
                    <div className="courses">
                        <span>Courses:</span>
                        <ul>
                            {studentDetails.courses && studentDetails.courses.map((course, index) => (
                                <li key={index}>
                                    {course} 
                                    <button className="drop-button" onClick={() => handleDropCourse(course)}>Drop</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button className="delete-button" onClick={handleDelete}>Delete user</button>
                </div>
            </div>
        </div>
    );
};

export default SelectStudentAdmin;
