import CircumIcon from "@klarr-agency/circum-icons-react";
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import '../EvalManagerInfo.css';
import '../GeneralStyling.css';
import AIvaluateNavBarAdmin from '../components/AIvaluateNavBarAdmin';
import SideMenuBarAdmin from '../components/SideMenuBarAdmin';

const EvalManagerInfo = () => {
    return (
        <div className="admin-container">
            <AIvaluateNavBarAdmin navBarText="Admin Home Portal" />
            <div className="filler-div">
                <SideMenuBarAdmin tab="evalManager" />
                <div className="main-margin">
                    <div className="top-bar">
                        <div className="back-btn-div">
                            <button className="main-back-button" ><CircumIcon name="circle_chev_left"/></button>
                        </div>
                        <h1 className="eval-text">Evaluator Info</h1>
                    
                    </div>
                    <div className="user-info">
                        <div className="user-details">
                            <h2>Scott Faz</h2>
                            <div className="align-check">
                                <label className="checkbox-label2 ">
                                    <input type="checkbox"  readOnly /> Teaching Assistant
                                </label>
                            </div>
                            <div className="action-buttons">
                                <button className="delete-button">Delete user</button>
                            </div>
                        </div>
                        <div className="info-row">
                            <span>Email:</span>
                            <span>testprof@email.com</span>
                        </div>
                        <div className="info-row">
                            <span>Password:</span>
                            <span>**********</span>
                        </div>
                        <div className="info-row">
                            <span>Department:</span>
                            <span>Computer science</span>
                        </div>
                    </div>
                    <div className="course-section">
                        <div className="search-bar">
                            <FaSearch className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Search..." 
                              
                            />
                        </div>
                        
                            <div className="course-item">
                                <span>COSC 499 - Capstone</span>
                                <button className="remove-button">Drop</button>
                            </div>
                        
                    </div>
                    <div className="info-row">
                        <span>Email:</span>
                        <span>prof@email.com</span>
                    </div>
                    <div className="info-row">
                        <span>Password:</span>
                        <span>**************</span>
                    </div>
                </div>
                <div className="course-section">
                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input 
                            type="text"
                            placeholder="Search..." 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EvalManagerInfo;
