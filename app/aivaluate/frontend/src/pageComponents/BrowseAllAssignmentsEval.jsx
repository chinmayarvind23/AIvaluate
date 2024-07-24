import CircumIcon from "@klarr-agency/circum-icons-react";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../AssignmentProf.css';
import '../FileDirectory.css';
import '../GeneralStyling.css';
import '../SearchBar.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import SideMenuBarEval from '../components/SideMenuBarEval';

const BrowseAllAssignmentsEval = () => {
    const courseCode = sessionStorage.getItem('courseCode');
    const courseName = sessionStorage.getItem('courseName');
    const courseId = sessionStorage.getItem('courseId');
    const navBarText = `${courseCode} - ${courseName}`;
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [searchTerm, setSearchTerm] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [filteredAssignments, setFilteredAssignments] = useState([]);
    const [totalAssignments, setTotalAssignments] = useState(0);
    const [error, setError] = useState(null);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        if (searchTerm) {
            const filtered = assignments.filter(assignment =>
                assignment.assignmentName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredAssignments(filtered);
        } else {
            setFilteredAssignments(assignments);
        }
        setCurrentPage(1); // Reset to first page on new search
    }, [searchTerm, assignments]);

    useEffect(() => {
        if (!courseId) {
            console.error('Course ID is not set in session storage');
            return;
        }

        const fetchTotalAssignments = async () => {
            try {
                const response = await axios.get(`http://localhost:5173/eval-api/assignments/count/${courseId}/all`, {
                    withCredentials: true
                });
                if (response.status === 200) {
                    setTotalAssignments(response.data.totalAssignments);
                } else {
                    console.error('Failed to fetch total assignments:', response);
                }
            } catch (error) {
                console.error('Error fetching total assignments:', error);
            }
        };

        const fetchAssignments = async () => {
            try {
                const response = await axios.get(`http://localhost:5173/eval-api/assignments/course/${courseId}/all`, {
                    withCredentials: true
                });
                if (response.status === 200) {
                    setAssignments(response.data);
                    setFilteredAssignments(response.data);
                    setError(null);
                } else {
                    console.error('Expected an array but got:', response.data);
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setError('No assignments found for this course.');
                    setAssignments([]);
                    setFilteredAssignments([]);
                } else {
                    console.error('Error fetching assignments:', error);
                }
            }
        };

        fetchTotalAssignments();
        fetchAssignments();
    }, [courseId]);

    // Calculates the current items to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentFiles = filteredAssignments.slice(indexOfFirstItem, indexOfLastItem);

    // This calculates the total number of pages based on the max number of items per page
    const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);

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

    const handleAssignmentSelect = (assignmentId) => {
        navigate(`/eval/published/${assignmentId}`);
    };

    return (
        <div>
            <AIvaluateNavBarEval navBarText={navBarText} />
            <div className="filler-div">
                <SideMenuBarEval tab="assignments" />
                    <div className="main-margin">
                        <div className="portal-container">
                            <div className="top-bar">
                                <div className="back-btn-div">
                                    <button className="main-back-button" onClick={() => navigate(-1)}><CircumIcon name="circle_chev_left"/></button>
                                </div>
                                <div className="title-text"><h1>All Assignments</h1></div>
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
                                    <div className="file-item" key={index} onClick={() => handleAssignmentSelect(file.assignmentId)}>
                                        <div className="file-name">{file.assignmentName}</div>
                                        <div className="file-status">{file.isPublished ? 'Published' : 'Unpublished'}</div>
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

export default BrowseAllAssignmentsEval;
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js"></script>