import CircumIcon from "@klarr-agency/circum-icons-react";
import React from 'react';
import { Link, useParams } from 'react-router-dom'; // to prevent page reload
import '../GeneralStyling.css';
import '../SideMenu.css';

 const SideMenuBarEval = ({tab}) => {
    const { courseId } = useParams();
    const courseIdNavBar = sessionStorage.getItem('courseId');


 return (
         <div className="fourth-colorbg side-menu">
            {/* <Link to={`/eval/coursehome/${courseId}`} className={`${tab === "home" ? 'primary-color-text' : 'third-color-text'}`}>Management</Link> */}
            {/* <Link to={`/eval/grades/${courseId}`} className={`${tab === "grades" ? 'primary-color-text' : 'third-color-text'}`}>Student Grades</Link> */}
            {/* <Link to={`/eval/assignments/${courseId}`} className={`${tab === "assignments" ? 'primary-color-text' : 'third-color-text'}`}>Assignments</Link> */}
            {/* <Link to={`/eval/students/${courseId}`} className={`${tab === "students" ? 'primary-color-text' : 'third-color-text'}`}>Students</Link> */}
            {/* <Link to={`/eval/submissions/${courseId}`} className={`${tab === "submissions" ? 'primary-color-text' : 'third-color-text'}`}>All Submissions</Link> */}
            {/* <Link to={`/eval/rubrics/${courseId}`} className={`${tab === "rubrics" ? 'primary-color-text' : 'third-color-text'}`}>Rubrics</Link> */}

            <div className="class-selection">
                <div className="icon-div">
                    <CircumIcon name="home"/>
                </div>
                <div className="link-div">
                    <Link to={`/eval/coursehome/${courseId}`} className={`${tab === "home" ? 'primary-color-text' : 'third-color-text'}`}>Management</Link>
                </div>
            </div>

            <div className="class-selection">
                <div className="icon-div">
                    <CircumIcon name="medical_cross"/>
                </div>
                <div className="link-div">
                  <Link to={`/eval/grades/${courseId}`} className={`${tab === "grades" ? 'primary-color-text' : 'third-color-text'}`}>Student Grades</Link>
                </div>
            </div>

            <div className="class-selection">
                <div className="icon-div">
                    <CircumIcon name="file_on"/>
                </div>
                <div className="link-div">
                  <Link to={`/eval/assignments/${courseId}`} className={`${tab === "assignments" ? 'primary-color-text' : 'third-color-text'}`}>Assignments</Link>
                </div>
            </div>

            <div className="class-selection">
                <div className="icon-div">
                    <CircumIcon name="user"/>
                </div>
                <div className="link-div">
                  <Link to={`/eval/students/${courseId}`} className={`${tab === "students" ? 'primary-color-text' : 'third-color-text'}`}>Students</Link>
                </div>
            </div>

            <div className="class-selection">
                <div className="icon-div">
                    <CircumIcon name="folder_on"/>
                </div>
                <div className="link-div">
                <Link to={`/eval/submissions/${courseId}`} className={`${tab === "submissions" ? 'primary-color-text' : 'third-color-text'}`}>All Submissions</Link>
                </div>
            </div>

            <div className="class-selection">
                <div className="icon-div">
                  <CircumIcon name="vault"/>
                </div>
                <div className="link-div">
                <Link to={`/eval/rubrics/${courseId}`} className={`${tab === "rubrics" ? 'primary-color-text' : 'third-color-text'}`}>Rubrics</Link>
                </div>
            </div>

         </div>

         

 )
 }
 export default SideMenuBarEval;