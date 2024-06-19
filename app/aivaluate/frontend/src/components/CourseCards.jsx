import axios from 'axios';
import { useEffect, useState } from 'react';
import '../styles.css';
import Card from './card';

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
/* 
- Card has 3 different variables that can be passed in: courseCode, courseName, and user
- courseCode and courseName are required, while user is optional
- user is set to "stu" by default, but can be changed to "prof" which changing the course image.
- Adding a car component with the courseCode="Create Course" and courseName="Click to create a new course" 
  will create a card that will allow the user to create a new course.
 */
    return (
        <div className="dashboard">
            {courses.map(course => (
                <Card 
                    key={course.courseId} 
                    courseCode={course.courseCode} 
                    courseName={course.courseName} 
                />
            ))}
            {/* <Card courseCode="Create Course" courseName="Click to create a new course"/> */}
        </div>
    );

    // return(
    //     <div className="dashboard">
    //             <Card courseCode="COSC 499" courseName="Software Engineering Capstone" user="prof"/>
    //             <Card courseCode="COSC 360" courseName="Intro to Web Development" user="prof"/>
    //             <Card courseCode="COSC 395" courseName="Intro to Frontend Development" user="prof"/>
    //             <Card courseCode="Create Course" courseName="Click to create a new course"/>
    //     </div>
    // );
};

export default CourseCards;