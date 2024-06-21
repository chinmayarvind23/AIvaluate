import CircumIcon from "@klarr-agency/circum-icons-react";
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // run npm install react-icons
import '../EvaluatorManager.css';
import '../GeneralStyling.css';


const FileDirectory = ({contentLabel, ffiles, page}) => {

    const hidden = "";

    if (page === "StudentViewSubmissions"){
        hidden = "";
    }else if (page === "EvaluatorManager"){
        hidden = "hide";
    }

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [searchTerm, setSearchTerm] = useState('');

    const fileStatus = "*Teaching Assistant";
  
    const files = [
      'Scott Fazackerley',
      'Ramon Lawrence',
      'Yong Goa',
      'Mohammed Khajezade',
      'Kevin Wang',
      'Ifeoma Adaji',
      'Jeff Bulmer',
      'Jonh Kingston',
    ];

    const filteredFiles = files.filter(file => 
        file.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    return (
        <div className="accented-outside rborder">
            <div className="portal-all">
                <div className="portal-container">
                    <div className="topBar">
                        <h1>Professors</h1>
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
                        <div className="right"><button className="addEvalButton secondary-button">Add Evaluator</button></div>
                    </div>
                    <div className="filetab">
                        {currentFiles.map((file, index) => (
                            <div className="file-item" key={index}>
                                <div className="file-name">{file}</div>
                                <div className="file-status">{fileStatus}</div>
                                <div className="file-icon hide"><CircumIcon name="edit"/></div>
                        
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
    );
};

export default FileDirectory;
