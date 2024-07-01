import CircumIcon from "@klarr-agency/circum-icons-react";
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import '../Auth.css';
import '../FileDirectory.css';
import '../GeneralStyling.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import SideMenuBar from '../components/SideMenuBar';

const StudentViewSubmissions = () => {
    const navigate = useNavigate();
    const { studentId, courseId } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [files, setFiles] = useState([]);
    const [courseDetails, setCourseDetails] = useState({ courseCode: '', courseName: '' });

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await fetch(`/stu-api/courses/${courseId}`);
                if (response.ok) {
                    const data = await response.json();
                    setCourseDetails(data);
                } else {
                    console.error('Error fetching course details:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching course details:', error);
            }
        };
    
        const fetchSubmissions = async () => {
            try {
                const response = await fetch(`/stu-api/stu/submissions/${courseId}/${studentId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setFiles(data);
            } catch (error) {
                console.error('Error fetching submissions:', error);
            }
        };
    
        fetchCourseDetails();
        fetchSubmissions();
    }, [studentId, courseId]);

    useEffect(() => {
        const filtered = files.filter(file =>
            file.assignmentKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.studentId.toString().includes(searchTerm)
        );
        setFilteredFiles(filtered);
        setCurrentPage(1); 
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
        setCurrentPage(1);
    };

    return (
        <div>
            <AIvaluateNavBar 
                navBarText={`${courseDetails.courseCode} - ${courseDetails.courseName}`} 
                tab='submissions' 
            />
            <SideMenuBar tab="submissions" />
            <div className="accented-outside rborder">
                <div className="portal-all">
                    <div className="portal-container">
                        <div className="topBar">
                            <h1>Submissions</h1>
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
                                    <div className="file-name">{file.assignmentKey} Submission</div>
                                    {file.isGraded && <div className="file-status">Marked as graded</div>}
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

export default StudentViewSubmissions;