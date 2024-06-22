import CircumIcon from "@klarr-agency/circum-icons-react";
import React, { useEffect, useState } from 'react';
import '../AssignmentProf.css';
import '../FileDirectory.css';
import '../GeneralStyling.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import SideMenuBarEval from '../components/SideMenuBarEval';


const AssignmentProf = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFiles, setFilteredFiles] = useState([]);

    const files = [
        { name: 'Lab 1', published: true },
        { name: 'Lab 2', published: true },
        { name: 'Lab 3', published: false },
        { name: 'Assignment 1', published: false },
        { name: 'Assignment 2', published: false },
        { name: 'Assigment 3', published: false },
        { name: 'Lab 4', published: false },
        { name: 'Lab 5', published: false },
    ];

    useEffect(() => {
        const filtered = files.filter(file =>
            file.name.toLowerCase().includes(searchTerm.toLowerCase())
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

    return (
        <div>
            <AIvaluateNavBar navBarText="Admin Home Portal"/>
            <SideMenuBarEval tab="assignments" />
            <div className="accented-outside rborder">
                <div className="portal-all">
                    <div className="portal-container">
                        <div className="topBarButton">
                            <div className="left-button">
                                <button className="assignButton secondary-button">
                                <CircumIcon name="circle_plus"/> 
                                Create New Assignment...
                                </button>
                            </div>
                            <div className="blank-space"> </div>
                            <div className="right-button">
                                <button className="assignButton secondary-button">
                                    <div className="file-icon"><CircumIcon name="folder_on" /></div>
                                    Browse My Assignments...
                                </button>
                            </div>
                        </div>
                        <div className="filetab">
                            {currentFiles.map((file, index) => (
                                <div className="file-item" key={index}>
                                    <div className="file-name">{file.name}</div>
                                    <div className="file-status">{file.published ? 'Published' : 'Unpublished'}</div>
                                    <div className="file-icon"><CircumIcon name="circle_more"/></div>
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

export default AssignmentProf;
