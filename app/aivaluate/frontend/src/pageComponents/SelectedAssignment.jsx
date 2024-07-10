import CircumIcon from "@klarr-agency/circum-icons-react";
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../FileDirectory.css';
import '../GeneralStyling.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import SideMenuBarEval from '../components/SideMenuBarEval';
import axios from 'axios';

const SelectedAssignment = () => {
    const courseCode = sessionStorage.getItem('courseCode');
    const courseName = sessionStorage.getItem('courseName');
    const courseId = sessionStorage.getItem('courseId');
    const navBarText = `${courseCode} - ${courseName}`;
    const navigate = useNavigate();
    const { assignmentId } = useParams(); // Assuming assignmentId is passed as a URL parameter
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [error, setError] = useState(null);
    const [gradesVisible, setGradesVisible] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await axios.get(`http://localhost:5173/eval-api/assignments/${assignmentId}/submissions`, {
                    withCredentials: true
                });

                if (response.status === 200) {
                    setSubmissions(response.data);
                    setFilteredFiles(response.data);
                } else {
                    console.error('Expected an array but got:', response.data);
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setError('No submissions found for this assignment.');
                    setSubmissions([]);
                    setFilteredFiles([]);
                } else {
                    console.error('Error fetching submissions:', error);
                }
            }
        };

        fetchSubmissions();
    }, [assignmentId]);

    useEffect(() => {
        if (searchTerm) {
            const results = submissions.filter(file =>
                file.submissionFile.toLowerCase().includes(searchTerm.toLowerCase()) ||
                file.studentId.includes(searchTerm)
            );
            setFilteredFiles(results);
        } else {
            setFilteredFiles(submissions);
        }
    }, [searchTerm, submissions]);

    // Calculates the current items to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentFiles = filteredFiles.slice(indexOfFirstItem, indexOfLastItem);

    // This calculates the total number of pages based on the max number of items per page
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

    const toggleGradesVisibility = () => {
        setGradesVisible(!gradesVisible);
    };

    return (
        <div>
            <AIvaluateNavBarEval navBarText={navBarText} />
            <SideMenuBarEval tab="assignments" />
            <div className="accented-outside rborder">
                <div className="main-margin">
                    <div className="portal-container">
                        <div className="top-bar">
                            <div className="back-btn-div">
                                <button className="main-back-button" onClick={() => navigate(-1)}><CircumIcon name="circle_chev_left"/></button>
                            </div>
                            <div className="title-text"><h1>Assignment - Submissions</h1></div>
                            <div className="empty"> </div>
                            <button className="grades-button" disabled={gradesVisible} onClick={toggleGradesVisibility}>
                                Hide Grades
                            </button>
                            <button className="grades-button" disabled={!gradesVisible} onClick={toggleGradesVisibility}>
                                Publish Grades
                            </button>
                        </div>
                        <div className="filetab">
                            {currentFiles.map((file, index) => (
                                <div className="file-item" key={index}>
                                    <div className="folder-icon"><CircumIcon name="folder_on"/></div>
                                    <div className="file-name">Student ID: {file.studentId} - {file.submissionFile}</div>
                                    {file.isGraded && <div className="file-status">*Marked as graded</div>}
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

export default SelectedAssignment;
