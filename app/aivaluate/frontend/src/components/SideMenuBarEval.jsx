import React from 'react';
import '../GeneralStyling.css';
import '../SideMenu.css';

 const SideMenuBarEval = ({tab}) => {

 return (
         <div className="fourth-colorbg side-menu rborder">
             <a href="DashboardEval" className={`${tab === "home" ? 'primary-color-text' : 'third-color-text'}`}>Home</a>
             <a className={`${tab === "grades" ? 'primary-color-text' : 'third-color-text'}`}>Student Grades</a>
             <a href="AssignmentOverview" className={`${tab === "assignments" ? 'primary-color-text' : 'third-color-text'}`}>Assignments</a>
             <a href="People" className={`${tab === "students" ? 'primary-color-text' : 'third-color-text'}`}>Students</a>
             <a className={`${tab === "submissions" ? 'primary-color-text' : 'third-color-text'}`}>All Submissions</a>
             <a className={`${tab === "rubrics" ? 'primary-color-text' : 'third-color-text'}`}>Rubrics</a>
         </div>
 )
 }
 export default SideMenuBarEval;