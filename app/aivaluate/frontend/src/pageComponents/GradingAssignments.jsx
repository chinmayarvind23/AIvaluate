import CircumIcon from "@klarr-agency/circum-icons-react";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useParams } from 'react-router-dom';
import '../DatePicker.css';
import '../GeneralStyling.css';
import '../GradingAssignments.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import SideMenuBarEval from '../components/SideMenuBarEval';

const GradingAssignments = () => {
  const { studentId, assignmentId } = useParams();
  const courseCode = sessionStorage.getItem('courseCode');
  const courseName = sessionStorage.getItem('courseName');
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [finalScore, setFinalScore] = useState('');
  const [assignmentDetails, setAssignmentDetails] = useState({});
  const [feedback, setFeedback] = useState('');
  const [instructorFeedback, setInstructorFeedback] = useState('');
  const [isEditingFeedback, setIsEditingFeedback] = useState(false);
  const studentNumber = studentId;

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5173/eval-api/assignment/${studentId}/${assignmentId}`, {
          withCredentials: true
        });
        const data = response.data;
        setAssignmentDetails(data);
        setDueDate(data.dueDate ? new Date(data.dueDate) : new Date());
        setFeedback(data.AIFeedbackText || '');
        setInstructorFeedback(data.InstructorFeedbackText || '');
        setFinalScore(data.InstructorAssignedFinalGrade ? data.InstructorAssignedFinalGrade.toString() : '');
      } catch (error) {
        console.error('Error fetching assignment details:', error);
      }
    };

    fetchAssignmentDetails();
  }, [studentId, assignmentId]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleDueDateChange = (date) => {
    setDueDate(date);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const saveDueDate = () => {
    setIsEditing(false);
  };

  const handleScoreChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const numericValue = parseInt(value, 10);
      if (numericValue <= assignmentDetails.maxObtainableGrade || isNaN(numericValue)) {
        setFinalScore(value);
      }
    }
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleInstructorFeedbackChange = (e) => {
    setInstructorFeedback(e.target.value);
  };

  const toggleEditFeedback = () => {
    setIsEditingFeedback(!isEditingFeedback);
  };

  const handleMarkComplete = async () => {
    try {
      const response = await axios.put(`http://localhost:5173/eval-api/assignment/complete/${studentId}/${assignmentId}`, {
        dueDate,
        InstructorAssignedFinalGrade: finalScore,
        AIFeedbackText: feedback,
        InstructorFeedbackText: instructorFeedback
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        alert('Assignment marked as complete');
      } else {
        alert('Failed to mark assignment as complete');
      }
    } catch (error) {
      console.error('Error marking assignment as complete:', error);
      alert('Failed to mark assignment as complete');
    }
  };

  const navBarText = `${courseCode} - ${courseName}`;

  return (
    <div>
      <AIvaluateNavBarEval navBarText={navBarText} />
      <div className="filler-div">
        <SideMenuBarEval tab="assignments" />
        <div className="main-margin">
              <div className="top-bar">
                  <div className="back-btn-div">
                      <button className="main-back-button" onClick={() => navigate(-1)}><CircumIcon name="circle_chev_left"/></button>
                  </div>
                  <div className="assignment-text"><h1>{assignmentDetails.assignmentName}</h1></div>
              </div>
              <div className="align-flex">
                  <h2 className="student-num">Student - {studentNumber}</h2>
                  <div className="empty"></div>
                  <div className="due-date-container">
                    {isEditing ? (
                      <>
                        <DatePicker
                          selected={dueDate}
                          onChange={handleDueDateChange}
                          showTimeSelect
                          className="due-date-picker"
                          dateFormat="MMMM d, yyyy h:mm aa"
                        />
                        <button className="save-button" onClick={saveDueDate}>Save</button>
                      </>
                    ) : (
                      <>
                        <p className="due-date" cursor="pointer" onClick={toggleEdit} >Due: {dueDate.toLocaleString()}</p>
                        <div cursor="pointer" onClick={toggleEdit}>
                          <CircumIcon className="edit-due-date" name="edit" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="score-div">
                  <h2 className="aiscore">AIScore: {assignmentDetails.AIassignedGrade}/{assignmentDetails.maxObtainableGrade}</h2>
                  <div className="empty"></div>
                  <div className="final-score">
                    <label htmlFor="final-score-input">Confirm Final Score:</label>
                    <input
                      id="final-score-input"
                      type="text"
                      value={finalScore}
                      onChange={handleScoreChange}
                      placeholder="--"
                    />
                    <h2 className="full-score">/ {assignmentDetails.maxObtainableGrade}</h2>
                  </div>
                </div>
              
              <div className="score-div">
                <h2 className="aiscore">AIScore: {assignmentDetails.AIassignedGrade}/{assignmentDetails.maxObtainableGrade}</h2>
                <div className="empty"></div>
                <div className="final-score">
                  <label htmlFor="final-score-input">Confirm Final Score:</label>
                  <input
                    id="final-score-input"
                    type="text"
                    value={finalScore}
                    onChange={handleScoreChange}
                    placeholder="--"
                  />
                  <h2 className="full-score">/ {assignmentDetails.maxObtainableGrade}</h2>
                </div>
              </div>
              </div>
        </div>
      </div>
    </div>
  );
};

export default GradingAssignments;