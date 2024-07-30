import CircumIcon from "@klarr-agency/circum-icons-react";
import React from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom'; // to prevent page reload
import '../GeneralStyling.css';
import '../SideMenu.css';

 const SideMenuBarEval = ({tab}) => {
    const { courseId } = useParams();
    const courseIdNavBar = sessionStorage.getItem('courseId') || courseId;


    return (
        <div className="fourth-colorbg side-menu">
            <div className="class-selection">
                <div className="icon-div">
                    <CircumIcon name="home" />
                </div>
                <div className="link-div">
                    <Link to={`/eval/coursehome/${courseIdNavBar}`} className={`${tab === "home" ? 'primary-color-text' : 'third-color-text'}`}>Management</Link>
                </div>
            </div>

            <div className="class-selection">
                <div className="icon-div">
                    <CircumIcon name="medical_cross" />
                </div>
                <div className="link-div">
                    <Link to={`/eval/grades/${courseIdNavBar}`} className={`${tab === "grades" ? 'primary-color-text' : 'third-color-text'}`}>Student Grades</Link>
                </div>
            </div>

            <div className="class-selection">
                <div className="icon-div">
                    <CircumIcon name="file_on" />
                </div>
                <div className="link-div">
                    <Link to={`/eval/assignments/${courseIdNavBar}`} className={`${tab === "assignments" ? 'primary-color-text' : 'third-color-text'}`}>Assignments</Link>
                </div>
            </div>

            <div className="class-selection">
                <div className="icon-div">
                    <CircumIcon name="user" />
                </div>
                <div className="link-div">
                    <Link to={`/eval/students/${courseIdNavBar}`} className={`${tab === "students" ? 'primary-color-text' : 'third-color-text'}`}>Students</Link>
                </div>
            </div>

            <div className="class-selection">
                <div className="icon-div">
                    <CircumIcon name="folder_on" />
                </div>
                <div className="link-div">
                    <Link to={`/eval/submissions/${courseIdNavBar}`} className={`${tab === "submissions" ? 'primary-color-text' : 'third-color-text'}`}>All Submissions</Link>
                </div>
            </div>

            <div className="class-selection">
                <div className="icon-div">
                    <CircumIcon name="vault" />
                </div>
                <div className="link-div">
                    <Link to={`/eval/rubrics/${courseIdNavBar}`} className={`${tab === "rubrics" ? 'primary-color-text' : 'third-color-text'}`}>Rubrics</Link>
                </div>
            </div>
        </div>
    );
}

SideMenuBarEval.propTypes = {
    tab: PropTypes.string.isRequired,
};

 export default SideMenuBarEval;