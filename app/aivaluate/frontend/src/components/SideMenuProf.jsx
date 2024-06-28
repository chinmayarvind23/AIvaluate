import React from 'react';
import '../GeneralStyling.css';
import '../SideMenuProf.css';

const DesignRubricSideMenuBar = ({ tab }) => {
    return (
        <div className="fourth-colorbg side-menu rborder">
            <a href="dashboard" className={`${tab === "home" ? 'primary-color-text' : 'third-color-text'}`}>Home</a>
            <a href="StudentGrades" className={`${tab === "grades" ? 'primary-color-text' : 'third-color-text'}`}>Student Grades</a>
            <a href="AssignmentOverview" className={`${tab === "assignments" ? 'primary-color-text' : 'third-color-text'}`}>Assignments</a>
            <a href="People" className={`${tab === "students" ? 'primary-color-text' : 'third-color-text'}`}>Students</a>
            <a href="Submissions" className={`${tab === "submissions" ? 'primary-color-text' : 'third-color-text'}`}>All Submissions</a>
            <a href="Rubrics" className={`${tab === "rubrics" ? 'primary-color-text' : 'third-color-text'}`}>Rubrics</a>
        </div>
    )
}
export default DesignRubricSideMenuBar;
