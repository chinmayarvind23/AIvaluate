import CircumIcon from "@klarr-agency/circum-icons-react";
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import '../Auth.css';
import '../FileDirectory.css';
import '../GeneralStyling.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import SideMenuBarEval from '../components/SideMenuBarEval';

const Rubrics = () => {
    const courseCode = sessionStorage.getItem('courseCode');
    const courseName = sessionStorage.getItem('courseName');
    const navBarText = `${courseCode} - ${courseName}`;

    const navigate = useNavigate();
    const { courseId } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [rubrics, setRubrics] = useState([]);
    const [courseDetails, setCourseDetails] = useState({ courseCode: '', courseName: '' });

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await fetch(`/eval-api/courses/${courseId}`);
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

        const fetchRubrics = async () => {
            try {
                const response = await fetch(`/eval-api/rubrics/${courseId}`);
                if (response.ok) {
                    const data = await response.json();
                    setRubrics(data);
                    setFilteredFiles(data);
                } else {
                    console.error('Error fetching rubrics:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching rubrics:', error);
            }
        };

        fetchCourseDetails();
        fetchRubrics();
    }, [courseId]);

    useEffect(() => {
        const filtered = rubrics.filter(file =>
            file.criteria.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredFiles(filtered);
        setCurrentPage(1);
    }, [searchTerm, rubrics]);

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

    const handleRubric = (assignmentRubricId) => {
        navigate(`/eval/rubric/${assignmentRubricId}`);
    };

    return (
        <div>
            <AIvaluateNavBarEval navBarText={navBarText} />
            <SideMenuBarEval tab="rubrics" />
            <div className="accented-outside rborder">
                <div className="main-margin">
                    <div className="portal-container">
                        <div className="top-bar">
                            <h1>Your Rubrics</h1>
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
                                <div className="file-item" key={index} onClick={() => handleRubric(file.assignmentRubricId)}>
                                    <div className="folder-icon"><CircumIcon name="file_on"/></div>
                                    <div className="file-name">{file.rubricName}</div>
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

export default Rubrics;