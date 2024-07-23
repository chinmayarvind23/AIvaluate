import CircumIcon from "@klarr-agency/circum-icons-react";
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import '../EvalManagerInfo.css';
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import '../EvalManagerInfo.css';
import '../GeneralStyling.css';
import AIvaluateNavBarAdmin from '../components/AIvaluateNavBarAdmin';
import SideMenuBarAdmin from '../components/SideMenuBarAdmin';
import AIvaluateNavBarAdmin from '../components/AIvaluateNavBarAdmin';
import SideMenuBarAdmin from '../components/SideMenuBarAdmin';

const EvalManagerInfo = () => {
    const isTeachingAssistant = true;

    return (
        <div className="admin-container">
            <AIvaluateNavBarAdmin navBarText="Admin Home Portal" />
            <SideMenuBarAdmin tab="evalManager" />
            <div className="main-margin">
                <div className="top-bar">
                    <div className="back-btn-div">
                        <button className="main-back-button"><CircumIcon name="circle_chev_left"/></button>
                    </div>
                    <h1 className="eval-text">Evaluator Info</h1>
                    <div className="empty"> </div>
                </div>
                <div className="user-info">
                    <div className="user-details">
                        <h2>Scott Faz</h2>
                        <div className="align-check">
                            <label className="checkbox-label2">
                                {isTeachingAssistant && (
                                    <h3 className="ta-text">
                                        <CircumIcon name="user" />Teaching Assistant
                                    </h3>
                                )}
                            </label>
                        </div>

                        <div className="action-buttons">
                            <button className="delete-button">Delete user</button>
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
export default EvalManagerInfo;
