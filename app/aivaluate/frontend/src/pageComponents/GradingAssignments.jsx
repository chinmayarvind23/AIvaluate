import CircumIcon from "@klarr-agency/circum-icons-react";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../GradingAssignments.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import SideMenuBarEval from '../components/SideMenuBarEval';

const GradingAssignments = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dueDate, setDueDate] = useState('May 30 11:59 p.m.');
  const [finalScore, setFinalScore] = useState('');

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    console.log(`menu open - ${!menuOpen}`);
  };

  const handleDueDateChange = (e) => {
    setDueDate(e.target.value);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const saveDueDate = () => {
    setIsEditing(false);
  };
  const handleScoreChange = (e) => {
    setFinalScore(e.target.value);
  };

  return (
    <div>
      <AIvaluateNavBar navBarText='Assignment 1' tab="assignments" />
      <div className="grading-container">
        <SideMenuBarEval tab="assignments" />
        <div className="content ">
          <div className="assignment-header ">
            <button className="back-button" onClick={() => navigate(-1)}><CircumIcon name="circle_chev_left"/></button>
            <h2>Assignment 1</h2>
            <p className="aiscore">AIScore: 25/34</p>
            <div className="final-score">
                <label htmlFor="final-score-input">Confirm Final Score:</label>
                <input
                  id="final-score-input"
                  type="text"
                  value={finalScore}
                  onChange={handleScoreChange}
                  placeholder="--"
                />
              </div>
            </div>
          <div className="student-info">
            <h3>Student - 49996201</h3>
            <div className="due-date-container">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={dueDate}
                    onChange={handleDueDateChange}
                  />
                  <button className="save-button" onClick={saveDueDate}>Save</button>
                </>
              ) : (
                <>
                  <p className="due-date">Due: {dueDate}</p>
                  <button className="edit-button" onClick={toggleEdit}>Edit</button>
                </>
              )}
            </div>
            <div className="feedback">
              <h4>AI Feedback</h4>
              <p>The overall structure of the HTML document is well-organized, and semantic tags such as &lt;header&gt;, &lt;nav&gt;, &lt;section&gt;, and &lt;footer&gt; are used correctly. However, there are a few instances where divs could be replaced with more appropriate HTML5 elements.</p>
            </div>
            <div className="evaluator-comments">
              <h4>Evaluator Comments</h4>
              <textarea placeholder="Please fill-in instructor Feedback..."></textarea>
            </div>
            <div className="student-submission">
              <h4>Student Submission</h4>
              <a href="#">index.html</a>
            </div>
            <button className="mark-complete">Mark evaluation as complete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradingAssignments;
