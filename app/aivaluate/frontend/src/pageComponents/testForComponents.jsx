import CircumIcon from "@klarr-agency/circum-icons-react";
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../GeneralStyling.css';
import '../SelectStudentAdmin.css';
import AIvaluateNavBarAdmin from "../components/AIvaluateNavBarAdmin";
import SideMenuBarAdmin from "../components/SideMenuBarAdmin";

const SelectStudentAdmin = () => {
    const navigate = useNavigate();
    const { studentId } = useParams();
    const [student, setStudent] = useState({});
    const [courses, setCourses] = useState([]);


    return (
        <div>
            <AIvaluateNavBarAdmin navBarText="Admin Home Portal"/>
            <div className="filler-div">
                <SideMenuBarAdmin tab="studentManager" />
                <div className="main-margin">
                    <div className="top-bar">
                        <div className="back-btn-div">
                            <button className="main-back-button" onClick={() => navigate(-1)}><CircumIcon name="circle_chev_left"/></button>
                        </div>
                        <h1>Student Info</h1>
                    </div>
                    <div className="center-it">
                        <div>
                            <div className="user-info2">
                                <div className="user-name">
                                    <span>Colton Palfrey</span>
                                    <span>38885190</span>
                                </div>
                                <div className="major">Major: COSC</div>
                                <div className="email">
                                    <span>Email:</span>
                                    <span>colton@emial.com</span>
                                </div>
                                <div className="password">
                                    <span>Password:</span>
                                    <span>********************</span>
                                </div>
                                <div className="courses">
                                    <span>Courses:</span>
                                    <ul>
                                            <li>
                                                COSC 499 
                                                <button className="drop-button">Drop</button>
                                            </li>
                                    </ul>
                                </div>
                                <button className="delete-button">Delete user</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default SelectStudentAdmin;
