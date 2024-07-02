import React from 'react';
import '../GeneralStyling.css';
import '../SideMenu.css';
import { Link } from 'react-router-dom'; // to prevent page reload

 const SideMenuBarEval = ({tab}) => {
    const courseId = sessionStorage.getItem('courseId');


 return (
         <div className="fourth-colorbg side-menu rborder">
            <Link to={`/eval/coursehome/${courseId}`} className={`${tab === "home" ? 'primary-color-text' : 'third-color-text'}`}>Management</Link>
             <Link to="/eval/grades" className={`${tab === "grades" ? 'primary-color-text' : 'third-color-text'}`}>Student Grades</Link>
             <Link to="/eval/grading" className={`${tab === "assignments" ? 'primary-color-text' : 'third-color-text'}`}>Assignments</Link>
             <Link to="/eval/students" className={`${tab === "students" ? 'primary-color-text' : 'third-color-text'}`}>Students</Link>
             <Link to="/eval/submissions" className={`${tab === "submissions" ? 'primary-color-text' : 'third-color-text'}`}>All Submissions</Link>
             <Link to="/eval/rubrics" className={`${tab === "rubrics" ? 'primary-color-text' : 'third-color-text'}`}>Rubrics</Link>
         </div>
 )
 }
 export default SideMenuBarEval;