import CircumIcon from "@klarr-agency/circum-icons-react";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';
import '../GeneralStyling.css';
import '../StudentViewSubmissions.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import SideMenuBar from '../components/SideMenuBar';
import '../styles.css';

const StudentViewSubmissions = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const files = [
    'index.html',
    'index.css',
    'login.html',
    'login.css',
    'dashboard.html',
    'dashboard.css',
    'report.html',
    'report.css',
    'about.html',
    'about.css',
    'contact.html',
    'contact.css',
  ];

  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFiles = files.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(files.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div>
      <AIvaluateNavBar navBarText='COSC 499 - Software Engineering Capstone' tab='studentviewsubmissions' />
      <div className="container">
        <SideMenuBar tab="submissions" />
        <div className="filetab">
          {currentFiles.map((file, index) => (
            <div className="file-item" key={index}>
              <div className="folder-icon"><CircumIcon name="folder_on"/></div>
              {file}
            </div>
          ))}
          <div className="pagination-controls">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="pagination-buttons">
              <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
              <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentViewSubmissions;
