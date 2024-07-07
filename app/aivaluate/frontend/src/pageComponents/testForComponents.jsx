import React from 'react';
import { FaSearch } from 'react-icons/fa'; // run npm install react-icons
import '../FileDirectory.css';
import '../GeneralStyling.css';
import '../SearchBar.css';
import AIvaluateNavBarEval from "../components/AIvaluateNavBarEval";
import SideMenuBarEval from '../components/SideMenuBarEval';

const Students = () => {
    const courseCode = sessionStorage.getItem('courseCode');
    const courseName = sessionStorage.getItem('courseName');

   

    return (
        <div>
            <AIvaluateNavBarEval navBarText="test text" />
            <SideMenuBarEval tab="students" />
            <div className="accented-outside rborder">
                <div className="main-margin">
                    <div className="portal-container">
                        <div className="top-bar">
                            <h1>Students</h1>
                            <div className="search-container">
                                <div className="search-box">
                                    <FaSearch className="search-icon" />
                                    <input 
                                        type="text" 
                                        placeholder="Search..." 
                                       
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="filetab">
                                <div className="file-item">
                                    <div className="file-name">Colton Palfrey</div>
                                    <div className="file-icon"></div>
                                </div>

                        </div>
                    </div>
                    <div className="pagination-controls">
                        <span>Page 1 of 2</span>
                        <div className="pagination-buttons">
                            <button onClick="">Previous</button>
                            <button onClick="">Next</button>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
    );
};

export default Students;
