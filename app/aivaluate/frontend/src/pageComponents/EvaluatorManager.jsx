import CircumIcon from "@klarr-agency/circum-icons-react";
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../FileDirectory.css';
import '../GeneralStyling.css';
import '../SearchBar.css';
import AIvaluateNavBarAdmin from '../components/AIvaluateNavBarAdmin';
import SideMenuBarAdmin from '../components/SideMenuBarAdmin';

const EvaluatorManager = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchEvaluators = async () => {
            try {
                const response = await fetch('http://localhost:5173/admin-api/evaluators', {
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setFiles(data);
                setFilteredFiles(data);
            } catch (error) {
                console.error('Error fetching evaluators:', error);
            }
        };

        fetchEvaluators();
    }, []);

    useEffect(() => {
        const filtered = files.filter(file =>
            file.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredFiles(filtered);
        setCurrentPage(1); // Reset to first page on new search
    }, [searchTerm, files]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentFiles = filteredFiles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);

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

    const handleEvaluatorClick = (instructorId) => {
        navigate(`/admin/evalManagerInfo/${instructorId}`);
    };

    return (
        <div>
            <AIvaluateNavBarAdmin navBarText="Admin Home Portal" />
            <div className="filler-div">
                <SideMenuBarAdmin tab="evalManager" />
                <div className="accented-outside rborder">
                    <div className="main-margin">
                        <div className="portal-container">
                            <div className="top-bar">
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
                                <div className="empty"> </div>
                                <button className="addEvalButton" onClick={() => navigate('/admin/CreateAccPT')}>Add Evaluator</button>
                            </div>
                            <div className="filetab">
                                {currentFiles.map((file, index) => (
                                    <div 
                                        className="file-item" 
                                        key={index} 
                                        onClick={() => handleEvaluatorClick(file.instructorId)}
                                    >
                                        <div className="file-name">{file.name}</div>
                                        {file.TA && <div className="file-status">*Teaching Assistant</div>}
                                        <div className="file-icon"><CircumIcon name="edit" /></div>
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
        </div>
    );
};

export default EvaluatorManager;
