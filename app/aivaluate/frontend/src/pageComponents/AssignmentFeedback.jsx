import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AIvaluateNavBar from '../components/AIvaluateNavBar';
import SideMenuBar from '../components/SideMenuBar';
import '../styles.css';
import '../Assignment.css'; // Ensure the correct CSS file name is used

const AssignmentFeedback = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    console.log(`menu open - ${!menuOpen}`); // Logging state change
  };

  const clickedMenu = {
    color: 'white',
    background: '#4d24d4',
    float: 'right',
    marginBottom: '10px'
  };

  const boostFromTop = {
    marginTop: '120px',
    color: '#4d24d4',
  };

  return (
    <div>
      <AIvaluateNavBar navBarText='COSC 499 - Software Engineering Capstone' />
      <SideMenuBar tab='assignments' />
      <div className="assignments-container">
        <main className="assignment-content">
          <header className="assignment-content-header">
          <button className="back-button" onClick={() => navigate('/assignmentoverview')}>
              <span className="back-arrow">&lt;</span>
            </button>
            <h2 className="assignment-title">Feedback - Assignment 1</h2>
            <div className="score-container">
              <span>Score: 25/34</span>
            </div>
          </header>
          <section className="feedback-section">
            <h2>AI Feedback</h2>
            <div className="feedback-content">
              The overall structure of the HTML document is well-organized, and semantic tags such as <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;section&gt;</code>, and <code>&lt;footer&gt;</code> are used correctly. However, there are a few instances where divs could be replaced with more appropriate HTML5 elements.
            </div>
            <h2>Evaluator Comments</h2>
            <div className="evaluator-comment"></div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AssignmentFeedback;
