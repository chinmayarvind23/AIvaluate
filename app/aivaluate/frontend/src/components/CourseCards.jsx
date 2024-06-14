import Card from './card';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';

const CourseCards = ({ navBarText }) => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:4000/courses');
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="dashboard">
            {courses.map(course => (
                <Card 
                    key={course.courseId} 
                    courseCode={course.courseCode} 
                    courseName={course.courseName} 
                />
            ))}
        </div>
    );

    // return(
    //     <div className="dashboard">
    //         <Card courseCode="COSC 499" courseName="Software Engineering Capstone" />
    //         <Card courseCode="COSC 360" courseName="Intro to Web Development" />
    //         <Card courseCode="COSC 304" courseName="Web Development II" />
    //         <Card courseCode="COSC 395" courseName="Intro to Frontend Development" />
    //     </div>
    // );
};

export default CourseCards;