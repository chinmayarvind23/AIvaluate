import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CreateAssignment.css';

const CreateAssignment = () => {
    const [assignment, setAssignment] = useState({
        assignmentName: '',  // Added assignmentName field
        dueDate: '',
        assignmentRubric: '', // Renamed to match the textarea name
        maxPoints: '',
        assignmentDescription: ''
    });

    const [rubrics, setRubrics] = useState([]);
    const [solutionFile, setSolutionFile] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:4000/rubrics')
            .then(response => {
                setRubrics(response.data);
            })
            .catch(error => {
                console.error('Error fetching rubrics:', error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAssignment({
            ...assignment,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setSolutionFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:4000/assignments', assignment)
            .then(response => {
                console.log('Assignment created:', response.data);
                if (solutionFile) {
                    const formData = new FormData();
                    formData.append('solutionFile', solutionFile);
                    axios.post(`http://localhost:4000/assignments/${response.data.assignmentId}/solutions`, formData)
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

    return (
        <div className="create-assignment-page">
            <div className="side-menu primary-colorbg">
                <a href="#" className="nav-item">Home</a>
                <a href="#" className="nav-item">Student Grades</a>
                <a href="#" className="nav-item active">Assignments</a>
                <a href="#" className="nav-item">Students</a>
                <a href="#" className="nav-item">All Submissions</a>
                <a href="#" className="nav-item">Rubrics</a>
            </div>
            <div className="header primary-colorbg">
                <div className="circle"></div>
                <h1>COSC 499 - Software Engineering Capstone</h1>
                <div className="menu">
                    <button className="secondary-button">☰</button>
                    <div className="dropdown">
                        <a href="#">Option 1</a>
                        <a href="#">Option 2</a>
                        <a href="#">Option 3</a>
                    </div>
                </div>
            </div>
            <div className="create-assignment-container fourth-colorbg">
                <div className="assignment-header"> {/* Hidden via CSS */}</div>
                <div className="create-assignment-content">
                    <h2>Create Assignment</h2>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="assignmentName">Assignment Name:</label>
                        <input
                            type="text"
                            id="assignmentName"
                            name="assignmentName"
                            value={assignment.assignmentName}
                            onChange={handleInputChange}
                        />
                        <label htmlFor="assignmentRubric">Assignment Rubric</label>
                        <textarea
                            id="assignmentRubric"
                            name="assignmentRubric"
                            placeholder="Enter project expectation, marking criteria, and what the student is expected to submit. Please be as detailed as possible."
                            value={assignment.assignmentRubric}
                            onChange={handleInputChange}
                        />
                        <div className="rubric-options">
                            <span>or</span>
                            <a href="#" className="use-past-rubric">Use a past Rubric</a>
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
                        <label htmlFor="maxPoints">Max Points:</label> {/* Add this label and input field */}
                        <input
                            type="number"
                            id="maxPoints"
                            name="maxPoints"
                            value={assignment.maxPoints}
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
                    <div className="available-rubrics">
                        <h3>Available Rubrics</h3>
                        <ul>
                            {rubrics.map(rubric => (
                                <li key={rubric.assignmentRubricId}>
                                    {rubric.criteria}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAssignment;