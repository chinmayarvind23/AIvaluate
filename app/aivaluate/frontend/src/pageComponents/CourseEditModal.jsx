import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../CourseEditModal.css'; 

const EditCourseModal = ({ isOpen, onClose, course, onSave }) => {
    const [editedCourse, setEditedCourse] = useState({ ...course });

    useEffect(() => {
        setEditedCourse(course); // Update state when course prop changes
    }, [course]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedCourse(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        saveCourseEdits(editedCourse);
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Edit Course" className="modal" overlayClassName="overlay">
            <h2 className="modal-title">Edit Course Details</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                onSave(editedCourse);

                // Reload the page to reflect the updated course details
                window.location.reload();
            }} className="edit-course-form">
                <div className="form-group">
                    <label htmlFor="courseName" className="form-label">
                        Course Name:
                    </label>
                    <input
                        type="text"
                        id="courseName"
                        name="courseName"
                        className="course-form-input"
                        value={editedCourse.courseName || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="courseCode" className="form-label">
                        Course Code:
                    </label>
                    <input
                        type="text"
                        id="courseCode"
                        name="courseCode"
                        className="course-form-input"
                        value={editedCourse.courseCode || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="maxStudents" className="form-label">
                        Max Students:
                    </label>
                    <input
                        type="number"
                        id="maxStudents"
                        name="maxStudents"
                        className="course-form-input"
                        value={editedCourse.maxStudents || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-actions">
                    <button type="submit" className="course-save-button">Save Changes</button>
                    <button type="button" className="course-cancel-button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </Modal>
    );
};

export default EditCourseModal;