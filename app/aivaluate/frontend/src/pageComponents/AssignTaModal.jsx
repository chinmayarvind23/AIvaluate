import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../AssignTaModal.css'; // Import the CSS file for styling

const AssignTaModal = ({ isOpen, onClose, courseId }) => {
    const [availableTAs, setAvailableTAs] = useState([]);
    const [selectedTAs, setSelectedTAs] = useState(new Set());
    const [currentTAs, setCurrentTAs] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            setError('');
            // Fetch all TAs
            axios.get(`http://localhost:4000/tas`)
                .then(response => {
                    setAvailableTAs(response.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch TAs:', err);
                    setError('Failed to fetch TAs');
                    setLoading(false);
                });
            // Fetch current TAs for the course
            axios.get(`http://localhost:4000/courses/${courseId}/tas`)
                .then(response => {
                    const currentTAsSet = new Set(response.data.map(ta => ta.instructorId));
                    setCurrentTAs(currentTAsSet);
                    setSelectedTAs(currentTAsSet);
                })
                .catch(err => {
                    console.error('Failed to fetch current TAs:', err);
                    setError('Failed to fetch current TAs');
                });
        }
    }, [isOpen, courseId]);

    const handleToggleSelect = (instructorId) => {
        setSelectedTAs((prevSelectedTAs) => {
            const newSelectedTAs = new Set(prevSelectedTAs);
            if (newSelectedTAs.has(instructorId)) {
                newSelectedTAs.delete(instructorId);
            } else {
                newSelectedTAs.add(instructorId);
            }
            return newSelectedTAs;
        });
    };

    const handleSave = () => {
        // Add new TAs
        selectedTAs.forEach((instructorId) => {
            if (!currentTAs.has(instructorId)) {
                axios.post(`http://localhost:4000/teaches`, { courseId, instructorId })
                    .then(response => {
                        console.log('TA added:', response.data);
                    })
                    .catch(error => {
                        console.error('Failed to add TA:', error);
                    });
            }
        });

        // Remove deselected TAs
        currentTAs.forEach((instructorId) => {
            if (!selectedTAs.has(instructorId)) {
                axios.delete(`http://localhost:4000/teaches/${courseId}/${instructorId}`)
                    .then(response => {
                        console.log('TA removed:', response.data);
                    })
                    .catch(error => {
                        console.error('Failed to remove TA:', error);
                    });
            }
        });

        onClose();
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Assign TA" className="ta-modal" overlayClassName="ta-overlay">
            <h2 className="modal-title">Assign Teaching Assistants</h2>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>{error}</div>
            ) : (
                <ul className="ta-list">
                    {availableTAs.map(ta => (
                        <li key={ta.instructorId} className="ta-item">
                            <span>{ta.firstName} {ta.lastName}</span>
                            <input 
                                type="checkbox"
                                checked={selectedTAs.has(ta.instructorId)}
                                onChange={() => handleToggleSelect(ta.instructorId)}
                                className="ta-checkbox"
                            />
                        </li>
                    ))}
                </ul>
            )}
            <div className="modal-actions">
                <button className="ta-save-button" onClick={handleSave}>Save</button>
                <button className="ta-cancel-button" onClick={onClose}>Close</button>
            </div>
        </Modal>
    );
};

export default AssignTaModal;
