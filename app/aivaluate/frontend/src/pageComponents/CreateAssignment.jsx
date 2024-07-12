import CircumIcon from "@klarr-agency/circum-icons-react";
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CreateAssignment.css';
import '../GeneralStyling.css';
import '../GeneralStyling.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import SideMenuBarEval from '../components/SideMenuBarEval';

axios.defaults.withCredentials = true;

const CreateAssignment = () => {
    const courseCode = sessionStorage.getItem('courseCode');
    const courseName = sessionStorage.getItem('courseName');
    const { courseId } = sessionStorage.getItem('courseId');
    const navBarText = `${courseCode} - ${courseName}`;
    const navigate = useNavigate();
    const availableRubricsRef = useRef(null);
    const criteriaRef = useRef(null);
    const [assignment, setAssignment] = useState({
        assignmentName: '',
        dueDate: '',
        criteria: '',
        maxObtainableGrade: '',
        courseId: courseId,
        assignmentKey: ''
    });

    const [rubrics, setRubrics] = useState([]);
    const [assignmentKey, setAssignmentKey] = useState(null);
    const [dragging, setDragging] = useState(false);

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
        const file = e.target.files[0];
        const allowedExtensions = /(\.css|\.html|\.js|\.jsx)$/i;

        if (file && !allowedExtensions.exec(file.name)) {
            alert('Please upload file having extensions .css, .html, .js, or .jsx only.');
            return false;
        } else {
            setAssignmentKey(file);
            setAssignment(prevAssignment => ({
                ...prevAssignment,
                assignmentKey: file.name
            }));
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        handleFileChange({ target: { files: [file] } });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!assignment.assignmentName || !assignment.criteria || !assignment.dueDate || !assignment.maxObtainableGrade) {
            alert('Please fill in all fields.');
            return;
        }
        const dueDate = new Date(assignment.dueDate);
        const today = new Date();
    
        if (dueDate < today) {
            alert('Due date cannot be in the past.');
            return;
        }
    
        try {
            const instructorId = sessionStorage.getItem('instructorId');
            const courseId = sessionStorage.getItem('courseId');
            const response = await axios.post('http://localhost:5173/eval-api/assignments', {
                ...assignment,
                instructorId,
                courseId,
                rubricName: 'Default Rubric',
            });
            console.log('Assignment created:', response.data);
            if (assignmentKey) {
                const formData = new FormData();
                formData.append('assignmentKey', assignmentKey);
                formData.append('instructorId', instructorId);
                formData.append('courseId', courseId);
    
                await axios.post(`http://localhost:5173/eval-api/assignments/${response.data.assignmentId}/solutions`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log('Solution added');
            }
            navigate(`/eval/assignments/${courseId}`);
        } catch (error) {
            console.error('Error creating assignment:', error);
            if (error.response && error.response.data) {
                console.error('Error response data:', error.response.data);
            }
        }
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
        if (criteriaRef.current) {
            criteriaRef.current.scrollIntoView({ behavior: 'smooth' });
        }
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
                                ref={criteriaRef}
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
                            <label htmlFor="assignmentKey">Add a solution <span className="optional">*Not required</span></label>
                            <div
                                className={`file-upload ${dragging ? 'dragging' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    id="assignmentKey"
                                    name="assignmentKey"
                                    onChange={handleFileChange}
                                />
                                <span>Drag files here or Click to browse files</span>
                            </div>
                            {assignmentKey && (
                                <div className="file-preview">
                                    <p>Uploaded File: {assignmentKey.name}</p>
                                </div>
                            )}
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