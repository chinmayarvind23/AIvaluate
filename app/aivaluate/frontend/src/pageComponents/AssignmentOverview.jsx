import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../AssignmentOverview.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import SideMenuBar from '../components/SideMenuBar';
import '../GeneralStyling.css';
import { FaFile } from 'react-icons/fa'; // Import FontAwesome file icon

const assignments = [
  { name: 'Project Planning - Requirement video', date: 'May 30 at 11:59pm', grade: '-/1 pts' },
  { name: 'Individual Exercise: Resolving Merge conflicts', date: 'May 24 at 11:59pm', grade: '8/8 pts' }
];

const AssignmentOverview = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    console.log(`menu open - ${!menuOpen}`); // Logging state change
  };

  return (
    <div>
      <AIvaluateNavBar navBarText='COSC 499 - Software Engineering Capstone' />
      <SideMenuBar tab='assignments' />
      
      <div className="table-container">
        <main className="assignment-table-content">
          <section className="table-section">
            <table className="assignment-table">
              <thead>
                <tr>
                  <th></th> {/* Empty header for the icon column */}
                  <th>Name</th>
                  <th>Date</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment, index) => (
                  <tr key={index}>
                    <td><FaFile className="file-icon" /></td> {/* File icon */}
                    <td>{assignment.name}</td>
                    <td>{assignment.date}</td>
                    <td>{assignment.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AssignmentOverview;
