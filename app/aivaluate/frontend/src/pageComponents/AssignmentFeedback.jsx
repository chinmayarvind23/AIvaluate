import React, { useEffect, useState } from 'react';
import { FaFile, FaSearch } from 'react-icons/fa'; // Import FontAwesome file icon
import { useNavigate } from 'react-router-dom';
import '../AssignmentOverview.css';
import '../CourseHome.css';
import '../GeneralStyling.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import SideMenuBar from '../components/SideMenuBar';

const assignments = [
  { name: 'Project Planning - Requirement video', date: 'May 30 at 11:59pm', grade: '-/1 pts' },
  { name: 'Individual Exercise: Resolving Merge conflicts', date: 'May 24 at 11:59pm', grade: '8/8 pts' }
];

const AssignmentOverview = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAssignments, setFilteredAssignments] = useState(assignments);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    console.log(`menu open - ${!menuOpen}`); // Logging state change
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };  

  useEffect(() => {
    const filtered = assignments.filter(assignment =>
      assignment.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAssignments(filtered);
  }, [searchTerm]);

  const handleNavigate = () => {
    navigate('/assignmentfeedback');
  };

  return (
    <div>
      <AIvaluateNavBar navBarText='COSC 499 - Software Engineering Capstone' />
      <SideMenuBar tab='assignments' />
      <div className="assignment-search-container">
      <div className="search-container">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
      </div>
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
                {filteredAssignments.map((assignment, index) => (
                  <tr key={index}>
                    <td>
                      <button className="icon-button" onClick={handleNavigate}>
                        <FaFile className="file-icon" />
                      </button>
                    </td> {/* File icon */}
                    <td>
                      <button className="link-button" onClick={handleNavigate}>
                        {assignment.name}
                      </button>
                    </td>
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
