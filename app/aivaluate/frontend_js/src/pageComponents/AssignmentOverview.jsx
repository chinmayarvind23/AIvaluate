import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Assignment.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import '../styles.css';

const aivaluatePurple = {
    color: '#4d24d4'
  }

const AssignmentOverview = () => {
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
      <AIvaluateNavBar navBarText='COSC 499 - Software Engineering Capstone'  />
      <div className="assignments-container">
        
        <aside className="sidebar">
          <nav>
            <ul>
              <li><a href="dashboard">Home</a></li>
              <li>Grades</li>
              <li className="selected">Assignments</li>
              <li>People</li>
              <li>Submissions</li>
            </ul>
          </nav>
        </aside>
        <main className="content">
          <header className="content-header">
            <button className="back-button">&lt;</button>
            <h2>Feedback - Assignment 1</h2>
            <div className="score">
              <span>Score:</span>
              <span>25/34</span>
            </div>
          </header>
          <section className="feedback-section">
            <h3>AI Feedback</h3>
            <div className="feedback-content">
              The overall structure of the HTML document is well-organized, and semantic tags such as <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;section&gt;</code>, and <code>&lt;footer&gt;</code> are used correctly. However, there are a few instances where divs could be replaced with more appropriate HTML5 elements.
            </div>
            <h3>Evaluator Comments</h3>
            <div className="feedback-content"></div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AssignmentOverview;
