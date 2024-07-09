import CircumIcon from "@klarr-agency/circum-icons-react";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../AssignmentProf.css';
import '../FileDirectory.css';
import '../GeneralStyling.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import SideMenuBarEval from '../components/SideMenuBarEval';
import axios from 'axios';


 const AssignmentProf = () => {
    const courseCode = sessionStorage.getItem('courseCode');
    const courseName = sessionStorage.getItem('courseName');
    const courseId = sessionStorage.getItem('courseId');
    const navBarText = `${courseCode} - ${courseName}`;
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAssignments, setFilteredAssignments] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [totalAssignments, setTotalAssignments] = useState(0);
    const [error, setError] = useState(null);

    //  const files = [
    //      { name: 'Lab 1', graded: true },
    //      { name: 'Lab 2', graded: true },
    //      { name: 'Lab 3', graded: false },
    //      { name: 'Assignment 1', graded: false },
    //      { name: 'Assignment 2', graded: false },
    //      { name: 'Assigment 3', graded: false },
    //      { name: 'Lab 4', graded: false },
    //      { name: 'Lab 5', graded: false },
    //  ];

    //  useEffect(() => {
    //      const filtered = files.filter(file =>
    //          file.name.toLowerCase().includes(searchTerm.toLowerCase())
    //      );
    //      setFilteredFiles(filtered);
    //      setCurrentPage(1); // Reset to first page on new search
    //  }, [searchTerm]);

    useEffect(() => {
        const fetchAssignments = async () => {
          if (!courseId) {
            console.error('Course ID is not set in session storage');
            return;
          }
    
          try {
            const response = await axios.get(`http://localhost:5173/eval-api/assignments/course/${courseId}`, {
              withCredentials: true
            });
    
            if (response.status === 200) {
              if (Array.isArray(response.data)) {
                setAssignments(response.data);
                setFilteredAssignments(response.data);
                setTotalAssignments(response.data.totalAssignments);
                console.log (response.data.totalAssignments);
                setError(null);
              } else {
                console.error('Expected an array but got:', response.data);
              }
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
    
        fetchAssignments();
      }, [courseId]);

      useEffect(() => {
        const fetchTotalAssignments = async () => {
            if (!courseId) {
                console.error('Course ID is not set in session storage');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5173/eval-api/assignments/count/${courseId}`, {
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
            if (!courseId) {
                console.error('Course ID is not set in session storage');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5173/eval-api/assignments/course/${courseId}`, {
                    withCredentials: true
                });

                if (response.status === 200) {
                    if (Array.isArray(response.data)) {
                        setAssignments(response.data);
                        setFilteredAssignments(response.data);
                        setError(null);
                    } else {
                        console.error('Expected an array but got:', response.data);
                    }
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

      
      useEffect(() => {
        try {
          if (searchTerm) {
            const results = assignments.filter(assignment =>
              assignment.assignmentName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredAssignments(results);
          } else {
            setFilteredAssignments(assignments);
          }
        } catch (error) {
          // Handle the error or do nothing
          console.error('An error occurred while filtering assignments:', error);
        }
      }, [searchTerm, assignments]);

           // Calculates the current items to display
     const indexOfLastItem = currentPage * itemsPerPage;
     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
     const currentFiles = filteredAssignments.slice(indexOfFirstItem, indexOfLastItem);

     // This calculates the total number of pages based of the max number of items per page
     const totalPages = Math.ceil(totalAssignments / itemsPerPage);

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

     const handleAssignmentSelect = () => {
        navigate(`/eval/published/assignment`);
    };

    const handleAssignmentCreation = () => {
        navigate(`/eval/create/assignment`);
    };

    const handleAssignmentBrowse = () => {
        navigate(`/eval/browse/assignments`);
    };

     return (
         <div>
             <AIvaluateNavBarEval navBarText={navBarText} />
             <SideMenuBarEval tab="assignments" />
             <div className="accented-outside rborder">
                 <div className="main-margin">
                     <div className="portal-container">
                         <div className="top-bar">
                            <h1>Assignments</h1>
                            <div className="empty"> </div>
                             <div className="left-button">
                                 <button className="assignButton" onClick={() => handleAssignmentCreation()}>
                                 <CircumIcon name="circle_plus"/> 
                                 Create New Assignment
                                 </button>
                             </div>
                             
                             <div className="right-button">
                                 <button className="assignButton" onClick={() => handleAssignmentBrowse()}>
                                     <div className="file-icon"><CircumIcon name="folder_on" /></div>
                                     Browse My Assignments
                                 </button>
                             </div>
                         </div>
                         <div className="filetab">
                             {filteredAssignments.map((assignment, index) => (
                                 <div className="file-item" key={index} onClick={() => handleAssignmentSelect()}>
                                     <div className="file-name">{assignment.assignmentName}</div>
                                     <div className="file-status">{assignment.isGraded ? '*Grading Posted' : ''}</div>
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