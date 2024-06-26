import React from 'react';
import '../ProfSpecificAssignmentpage.css'; // Adjust the path if needed
import '../styles.css'; // Adjust the path if needed
import SideMenuBar from '../components/SideMenuBar';
import AIvaluateNavBar from '../components/AIvaluateNavBar';

const AssignmentsPage = () => {
  return (
    <div>
      <AIvaluateNavBar navBarText='COSC 499 - Software Engineering Capstone' />
      <SideMenuBar tab='assignments' />
    <div className="assignments-container">
      
      <main className="contentt">
      <header>
      <button className="back-button">&larr;</button>
      <h2 className="p-text">Lab 1 - Submissions</h2>
      <div className="buttons">
            <button className="bb1">Hide Grades</button>
            <button className="bb2">Publish Grades</button>
          </div>
          </header>
        <div className="course-card">
          <h3>39996201 - Lab 1 Submission</h3>
          <p>Marked as graded</p>
        </div>
        <div className="course-card">
          <h3>58886201 - Lab 1 Submission</h3>
          <p>Marked as graded</p>
        </div>
        <div className="course-card">
          <h3>57996231 - Lab 1 Submission</h3>
          <p></p>
        </div>
        <div className="course-card">
          <h3>89496301 - Lab 1 Submission</h3>
          <p></p>
        </div>
        <div className="course-card">
          <h3>12966231 - Lab 1 Submission</h3>
          <p>Marked as graded</p>
        </div>
      </main>
    </div>
    </div>
  );
};

export default AssignmentsPage;
