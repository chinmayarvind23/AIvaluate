import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../AllRubrics.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import SideMenuBar2 from '../components/SideMenuBar2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';

const AllRubrics = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [visibleSubmissions, setVisibleSubmissions] = useState(6);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    console.log(`menu open - ${!menuOpen}`);
  };

  const submissions = [
    { id:1, label: 'Build a Personal Portfolio Page' },
    { id:2, label: 'Design an Account Page' },
    { id:3, label: 'Design a Login Page' },
    { id:4, label: 'Create a Blog Page' },
    { id:5, label: 'Develop a Contact Us Page' },
    { id:6, label: 'Design a User Dashboard' },
    { id:7, label: 'Build a Product Listing Page' },
    { id:8, label: 'Create an About Us Page' },
    { id:9, label: 'Develop a Services Page' },
    { id:10, label: 'Design a FAQ Page' },
    { id:11, label: 'Design a Profile Settings Page' },
  ];

  const handleLoadMore = () => {
    setVisibleSubmissions(submissions.length);
    setIsExpanded(true);
  };

  const handleLoadLess = () => {
    setVisibleSubmissions(6);
    setIsExpanded(false);
  };

  const handleClick = (route) => {
    navigate(route); 
  };

  return (
    <div>
      <AIvaluateNavBar navBarText='COSC 499 - Software Engineering Capstone' tab="Rubrics" />
      <div className="submissions-container">
        <SideMenuBar2 />
        <div className="content">
          <h2>Rubrics</h2>
          <div className="submission-list">
            {submissions.slice(0, visibleSubmissions).map((submission, index) => (
              // Add onClick handler to navigate to the specified route
              <div 
                key={submission.id} 
                className={`submission-item ${index % 2 === 0 ? 'white' : 'gray'}`} 
                onClick={() => handleClick(submission.route)}
                style={{ cursor: 'pointer' }} // Add pointer cursor to indicate clickability
              >
                <FontAwesomeIcon icon={faFolder} className="folder-icon" />
                <div className="submission-text">{submission.label}</div>
              </div>
            ))}
          </div>
          {!isExpanded ? (
            <button className="load-more-button" onClick={handleLoadMore}>
              Load More
            </button>
          ) : (
            <button className="load-less-button" onClick={handleLoadLess}>
              Load Less
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default AllRubrics;
