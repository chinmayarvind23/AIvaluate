import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // run npm install react-icons
import '../CourseCards.css';
import '../SearchBar.css';
import Card from './card';

const CourseCards = ({ navBarText, page }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    

    if (page === "JoinCourse") {
        
        const [searchTerm, setSearchTerm] = useState('');
        useEffect(() => {
            const fetchCourses = async () => {
                try {
                    const response = await axios.get('http://localhost:5173/stu-api/not-enrolled-courses', { withCredentials: true });
                    console.log('Fetched Courses:', response.data); // Log fetched courses to verify
                    setCourses(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching enrolled courses:', error);
                    setLoading(false);
                }
            };
    
            fetchCourses();
        }, []);
    
        if (loading) {
            return <div>Loading...</div>;
        }
        // Filter courses based on search term
        const filteredCourses = courses.filter(course =>
            course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.courseId.toString().includes(searchTerm)
        );

        const handleSearchChange = (e) => {
            setSearchTerm(e.target.value);
        };

        return (
            <div>
                <div className="center-search">
                    <div className="search-container">
                        <div className="search-box">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search a course"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="dashboard">
                    {filteredCourses.map(course => (
                        <Card 
                            // key={course.courseId} 
                            courseCode={course.courseCode} 
                            courseName={course.courseName} 
                            courseId={course.courseId}
                            user="joinCourse"
                        />
                    ))}
                </div>
            </div>
        );
    } else if (page === "stu/dashboard") {
        useEffect(() => {
            const fetchCourses = async () => {
                try {
                    const response = await axios.get('http://localhost:5173/stu-api/enrolled-courses', { withCredentials: true });
                    console.log('Fetched Courses:', response.data); // Log fetched courses to verify
                    setCourses(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching enrolled courses:', error);
                    setLoading(false);
                }
            };
    
            fetchCourses();
        }, []);
    
        if (loading) {
            return <div>Loading...</div>;
        }
        return (
            <div className="dashboard">
                {courses.map(course => (
                    <Card 
                        // key={course.courseId} 
                        courseCode={course.courseCode} 
                        courseName={course.courseName} 
                        courseId={course.courseId}
                        user = "stu"
                    />
                ))}
            </div>
        );
    } else if (page === "prof/dashboard") {
        useEffect(() => {
            const fetchCourses = async () => {
                try {
                    const response = await axios.get('http://localhost:5173/eval-api/courses', { withCredentials: true });
                    console.log('Fetched Courses:', response.data); // Log fetched courses to verify
                    setCourses(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching enrolled courses:', error);
                    setLoading(false);
                }
            };
    
            fetchCourses();
        }, []);
    
        if (loading) {
            return <div>Loading...</div>;
        }
        return (
            <div className="dashboard">
                {courses.map(course => (
                    <Card 
                        // key={course.courseId} 
                        courseCode={course.courseCode} 
                        courseName={course.courseName}
                        courseId={course.courseId}
                        user="prof" 
                    />
                ))}
                <Card courseCode ="Create Course" CourseName="Click to create a new course" />
            </div>
        );
    }
};

export default CourseCards;
