import CircumIcon from "@klarr-agency/circum-icons-react";
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // run npm install react-icons
import { useNavigate } from 'react-router-dom';
import '../Auth.css';
import '../FileDirectory.css';
import '../GeneralStyling.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import SideMenuBarEval from '../components/SideMenuBarEval';

const EvalViewSubmissions = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFiles, setFilteredFiles] = useState([]);

  const files = [
    { stu_number: '35559748', assignment: 'Lab 1', graded: true },
    { stu_number: '26450923', assignment: 'Lab 1', graded: true  },
    { stu_number: '87621931', assignment: 'Lab 1', graded: true  },
    { stu_number: '38289312', assignment: 'Lab 1', graded: false  },
    { stu_number: '89273919', assignment: 'Lab 1', graded: true  },
    { stu_number: '32187638', assignment: 'Lab 1', graded: false  },
    { stu_number: '12339781', assignment: 'Lab 1', graded: false  },
    { stu_number: '87621931', assignment: 'Lab 2', graded: false  },
    ]

    useEffect(() => {
        const filtered = files.filter(file =>
        file.assignment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.stu_number.includes(searchTerm)
        );
        setFilteredFiles(filtered);
        setCurrentPage(1); // Reset to first page on new search
    }, [searchTerm]);

    // Calculates the current items to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentFiles = filteredFiles.slice(indexOfFirstItem, indexOfLastItem);

    // This calculates the total number of pages based of the max number of items per page
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

  return (
  <div>
    <AIvaluateNavBar navBarText='Course number - Course Name' tab='submissions' />
    <SideMenuBarEval tab="submissions" />
    <div className="accented-outside rborder">
        <div className="portal-all">
            <div className="portal-container">
                <div className="topBar">
                    <h1>Student Submissions</h1>
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
                <div className="filetab">
                    {currentFiles.map((file, index) => (
                        <div className="file-item" key={index}>
                            <div className="folder-icon"><CircumIcon name="folder_on"/></div>
                            <div className="file-name">{file.stu_number} - {file.assignment} Submission</div>
                            {file.graded && <div className="file-status">*Marked as graded</div>}
                        </div>
                    ))}
                </div>
            </div>
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

export default EvalViewSubmissions;
