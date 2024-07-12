import CircumIcon from "@klarr-agency/circum-icons-react";
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import '../FileDirectory.css';
import '../GeneralStyling.css';
import '../SearchBar.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import SideMenuBarEval from '../components/SideMenuBarEval';

const EvalViewSubmissions = () => {
    const courseCode = sessionStorage.getItem('courseCode');
    const courseName = sessionStorage.getItem('courseName');
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [files, setFiles] = useState([]);
    const [courseDetails, setCourseDetails] = useState({ courseCode: '', courseName: '' });

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await fetch(`/eval-api/courses/${courseId}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log("Course Details:", data);  // Debugging
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
                const response = await fetch(`/eval-api/courses/${courseId}/submissions`);
                if (response.ok) {
                    const data = await response.json();
                    console.log("Submissions:", data);  // Debugging
                    setFiles(data);
                } else {
                    console.error('Error fetching submissions:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching submissions:', error);
            }
        };

        fetchCourseDetails();
        fetchSubmissions();
    }, [courseId]);

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
    const navBarText = `${courseCode} - ${courseName}`;

    return (
        <div>
            <AIvaluateNavBarEval navBarText={navBarText} />
            <SideMenuBarEval tab="submissions" />
            <div className="accented-outside rborder">
                <div className="main-margin">
                    <div className="portal-container">
                        <div className="top-bar">
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
                                    <div className="file-name">{file.studentId} - {file.assignmentKey} Submission</div>
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

export default EvalViewSubmissions;
