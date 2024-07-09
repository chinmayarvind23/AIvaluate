import CircumIcon from "@klarr-agency/circum-icons-react";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CreateAssignment.css';
import '../GeneralStyling.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import SideMenuBarEval from '../components/SideMenuBarEval';

const CreateAssignment = () => {
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState({
        assignmentName: '',
        dueDate: '',
        assignmentRubric: '',
        maxPoints: '',
        assignmentDescription: ''
    });

    const [rubrics, setRubrics] = useState([]);
    const [assignmentKey, setassignmentKey] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5173/eval-api/rubrics')
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
        setassignmentKey(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5173/eval-api/assignments', assignment)
            .then(response => {
                console.log('Assignment created:', response.data);
                if (assignmentKey) {
                    const formData = new FormData();
                    formData.append('assignmentKey', assignmentKey);
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

    return (
        <div>
            <AIvaluateNavBarEval navBarText="Course number - Course name"/>
            <SideMenuBarEval tab="assignments" />
            <div className="main-margin">
                <div className="top-bar">
                    <div className="back-btn-div">
                        <button className="main-back-button" onClick={() => navigate(-1)}><CircumIcon name="circle_chev_left"/></button>
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
                            <label htmlFor="maxPoints">Max Points:</label>
                            <input
                                type="number"
                                id="maxPoints"
                                name="maxPoints"
                                value={assignment.maxPoints}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="assignmentKey">Add a solution <span className="optional">*Not required</span></label>
                            <label className="file-upload">
                                <input type="file" id="assignmentKey" name="assignmentKey" onChange={handleFileChange} />
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
        </div>
    );
};

export default CreateAssignment;