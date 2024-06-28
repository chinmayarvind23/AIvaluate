import React from 'react';
import '../GeneralStyling.css';
import '../SideMenu.css';

 const SideMenuBarEval = ({tab}) => {

 return (
         <div className="fourth-colorbg side-menu rborder">
             <a href="/eval/coursehome/:courseId" className={`${tab === "home" ? 'primary-color-text' : 'third-color-text'}`}>Management</a>
             <a href="/eval/grades" className={`${tab === "grades" ? 'primary-color-text' : 'third-color-text'}`}>Student Grades</a>
             <a href="/eval/grading" className={`${tab === "assignments" ? 'primary-color-text' : 'third-color-text'}`}>Assignments</a>
             <a href="/eval/students" className={`${tab === "students" ? 'primary-color-text' : 'third-color-text'}`}>Students</a>
             <a href="/eval/submissions" className={`${tab === "submissions" ? 'primary-color-text' : 'third-color-text'}`}>All Submissions</a>
             <a href="/eval/rubrics" className={`${tab === "rubrics" ? 'primary-color-text' : 'third-color-text'}`}>Rubrics</a>
         </div>
 )
 }
 export default SideMenuBarEval;