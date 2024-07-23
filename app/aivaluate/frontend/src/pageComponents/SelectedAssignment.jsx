import CircumIcon from "@klarr-agency/circum-icons-react";
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../FileDirectory.css';
import '../GeneralStyling.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import SideMenuBarEval from '../components/SideMenuBarEval';

const SelectedAssignment = () => {
    const courseCode = sessionStorage.getItem('courseCode');
    const courseName = sessionStorage.getItem('courseName');
    const navBarText = `${courseCode} - ${courseName}`;
    const navigate = useNavigate();
    const { assignmentId } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [error, setError] = useState(null);
    const [gradesVisible, setGradesVisible] = useState(true);

    const setSessionData = useCallback(async (courseId, instructorId) => {
        try {
            console.log('Setting session data:', { instructorId, courseId });
            await axios.post('http://localhost:5173/eval-api/set-session', {
                instructorId,
                courseId
            }, {
                withCredentials: true
            });
            sessionStorage.setItem('courseId', courseId);
            sessionStorage.setItem('instructorId', instructorId);
        } catch (error) {
            console.error('Failed to set session data:', error);
            setError('Failed to set session data.');
        }
    }, []);

    const ensureSessionData = useCallback(async () => {
        let instructorId = sessionStorage.getItem('instructorId');
        let courseId = sessionStorage.getItem('courseId');

        if (!instructorId) {
            try {
                const response = await axios.get('http://localhost:5173/eval-api/me', {
                    withCredentials: true
                });
                instructorId = response.data.instructorId;
                sessionStorage.setItem('instructorId', instructorId);
            } catch (error) {
                console.error('Failed to fetch instructor details:', error);
                setError('Failed to fetch instructor details.');
                return;
            }
        }

        if (!courseId) {
            console.error('Course ID is missing from session storage.');
            setError('Course ID must be set in session storage.');
            return;
        }

        await setSessionData(courseId, instructorId);
    }, [setSessionData]);

    useEffect(() => {
        ensureSessionData();
    }, [ensureSessionData]);

    const fetchSubmissions = useCallback(async () => {
        const courseId = sessionStorage.getItem('courseId');

        try {
            const response = await axios.get(`http://localhost:5173/eval-api/assignments/${assignmentId}/submissions`, {
                withCredentials: true
            });

            if (response.status === 200) {
                setSubmissions(response.data);
                setFilteredFiles(response.data);
            } else {
                console.error('Expected an array but got:', response.data);
                setError('Unexpected response format.');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError(`No submissions found for this assignment in course ${courseId}.`);
                setSubmissions([]);
                setFilteredFiles([]);
            } else {
                console.error(`Error fetching submissions for course ${courseId}:`, error);
                setError(`Error fetching submissions for course ${courseId}.`);
            }
        }
    }, [assignmentId]);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions, assignmentId]);

    useEffect(() => {
        const courseId = sessionStorage.getItem('courseId');
        const instructorId = sessionStorage.getItem('instructorId');
        console.log('Course ID from session storage:', courseId);
        console.log('Instructor ID from session storage:', instructorId);
    }, []);

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

    const toggleGradesVisibility = () => {
        setGradesVisible(!gradesVisible);
    };

    const handleMarkAssignment = (studentId, assignmentId) => {
        navigate(`/eval/${studentId}/${assignmentId}/grading`);
    };

    const handleGradeWithAI = async () => {
        const courseId = sessionStorage.getItem('courseId');
        const instructorId = sessionStorage.getItem('instructorId');
    
        if (!instructorId || !courseId) {
            console.error('Instructor ID or Course ID is missing.');
            setError('Instructor ID or Course ID is missing.');
            return;
        }
    
        try {
            console.log('Sending request to grade with AI:', { instructorId, courseId });
    
            const response = await axios.post(`http://localhost:5173/eval-api/ai/assignments/${assignmentId}/process-submissions`, {
                instructorId,
                courseId
            }, {
                withCredentials: true
            });
    
            if (response.status === 200) {
                alert('Submissions graded successfully.');
                fetchSubmissions();
            } else {
                console.error('Failed to grade submissions:', response.data);
                setError(`Failed to grade submissions for course ${courseId}.`);
            }
        } catch (error) {
            console.error(`Error grading submissions for course ${courseId}:`, error);
            alert('Failed to grade submissions. Please try again.');
            setError(`Error grading submissions for course ${courseId}.`);
        }
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
                            <button className="grades-button" onClick={handleGradeWithAI}>
                                Grade With AI
                            </button>
                            <button className="grades-button" disabled={gradesVisible} onClick={toggleGradesVisibility}>
                                Hide Grades
                            </button>
                            <button className="grades-button" disabled={!gradesVisible} onClick={toggleGradesVisibility}>
                                Publish Grades
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by student ID or file name"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                        <div className="filetab">
                            {currentFiles.map((file, index) => (
                                <div className="file-item" key={index} onClick={() => handleMarkAssignment(file.studentId, file.assignmentId)}>
                                    <div className="folder-icon"><CircumIcon name="folder_on"/></div>
                                    <div className="file-name">Student ID: {file.studentId} - {file.submissionFile}</div>
                                    {file.isGraded && <div className="file-status">*Marked as graded</div>}
                                </div>
                            ))}
                        </div>
                        {error && <div className="error-message">{error}</div>}
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