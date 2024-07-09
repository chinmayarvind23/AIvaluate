import CircumIcon from "@klarr-agency/circum-icons-react";
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../CreateAssignment.css';
import '../GeneralStyling.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import SideMenuBarEval from '../components/SideMenuBarEval';

const CreateAssignment = () => {
    const courseCode = sessionStorage.getItem('courseCode');
    const courseName = sessionStorage.getItem('courseName');
    const { courseId } = useParams();
    const navBarText = `${courseCode} - ${courseName}`;

    const navigate = useNavigate();
    const availableRubricsRef = useRef(null);
    const [assignment, setAssignment] = useState({
        assignmentName: '',
        dueDate: '',
        criteria: '',
        maxObtainableGrade: '',
        courseId: courseId
    });

    const [rubrics, setRubrics] = useState([]);
    const [solutionFile, setSolutionFile] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5173/eval-api/rubrics/${courseId}`)
            .then(response => {
                setRubrics(response.data);
            })
            .catch(error => {
                console.error('Error fetching rubrics:', error);
            });
    }, [courseId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAssignment(prevAssignment => ({
            ...prevAssignment,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setSolutionFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check for empty fields
        if (!assignment.assignmentName || !assignment.criteria || !assignment.dueDate || !assignment.maxObtainableGrade) {
            alert('Please fill in all fields.');
            return;
        }

        // Check if the due date is in the past
        const dueDate = new Date(assignment.dueDate);
        const today = new Date();

        if (dueDate < today) {
            alert('Due date cannot be in the past.');
            return;
        }

        axios.post('http://localhost:5173/eval-api/assignments', assignment)
            .then(response => {
                console.log('Assignment created:', response.data);
                if (solutionFile) {
                    const formData = new FormData();
                    formData.append('solutionFile', solutionFile);
                    axios.post(`http://localhost:5173/eval-api/assignments/${response.data.assignmentId}/solutions`, formData)
                        .then(res => {
                            console.log('Solution added:', res.data);
                        })
                        .catch(err => {
                            console.error('Error adding solution:', err);
                        });
                }
            })
            .catch(error => {
                console.error('Error creating assignment:', error);
            });
    };

    const handleUsePastRubricClick = (e) => {
        e.preventDefault();
        if (availableRubricsRef.current) {
            availableRubricsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleRubricClick = (criteria) => {
        setAssignment(prevAssignment => ({
            ...prevAssignment,
            criteria: criteria
        }));
        // Optional: Scroll back to the text area after selecting a rubric
        document.getElementById('criteria').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div>
            <AIvaluateNavBarEval navBarText={navBarText} />
            <SideMenuBarEval tab="assignments" />
            <div className="main-margin">
                <div className="top-bar">
                    <div className="back-btn-div">
                        <button className="main-back-button" onClick={() => navigate(-1)}><CircumIcon name="circle_chev_left" /></button>
                    </div>
                    <div className="title-text"><h1>Create Assignment</h1></div>
                </div>
                <div className="scrollable-div">
                    <div className="create-assignment-content">
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="assignmentName">Assignment Name:</label>
                            <input
                                type="text"
                                id="assignmentName"
                                name="assignmentName"
                                value={assignment.assignmentName}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="criteria">Assignment Rubric</label>
                            <textarea
                                id="criteria"
                                name="criteria"
                                placeholder="Enter project expectation, marking criteria, and what the student is expected to submit. Please be as detailed as possible. Markdown format is recommended."
                                value={assignment.criteria}
                                onChange={handleInputChange}
                            />
                            <div className="rubric-options">
                                <span>or</span>
                                <button type="button" className="use-past-rubric" onClick={handleUsePastRubricClick}>Use a past Rubric</button>
                            </div>
                            <label htmlFor="dueDate">Due Date:</label>
                            <div className="date-picker">
                                <input
                                    type="date"
                                    id="dueDate"
                                    name="dueDate"
                                    value={assignment.dueDate}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <label htmlFor="maxObtainableGrade">Max Points:</label>
                            <input
                                type="number"
                                id="maxObtainableGrade"
                                name="maxObtainableGrade"
                                value={assignment.maxObtainableGrade}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="solutionFile">Add a solution <span className="optional">*Not required</span></label>
                            <label className="file-upload">
                                <input type="file" id="solutionFile" name="solutionFile" onChange={handleFileChange} />
                                <span>Drag files here or Click to browse files</span>
                            </label>
                            <div className="form-footer">
                                <button type="submit" className="post-button">Post</button>
                            </div>
                        </form>
                        <div className="available-rubrics" ref={availableRubricsRef}>
                            <h3>Available Rubrics</h3>
                            <ul>
                                {rubrics.map(rubric => (
                                    <li key={rubric.assignmentRubricId} onClick={() => handleRubricClick(rubric.criteria)}>
                                        {rubric.rubricName}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAssignment;
