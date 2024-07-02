import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../Account.css';
import '../GeneralStyling.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import '../styles.css';

const EvalAccount = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [accountId, setAccountId] = useState("");
    const [prof, setProf] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchInstructorData = async () => {
            try {
                const { data: { instructorId } } = await axios.get('http://localhost:5173/eval-api/instructor/me', {
                    withCredentials: true
                });
                setAccountId(instructorId);

                const firstNameResponse = await axios.get(`http://localhost:5173/eval-api/instructor/${instructorId}/firstName`);
                setFirstName(firstNameResponse.data.firstName);

                const lastNameResponse = await axios.get(`http://localhost:5173/eval-api/instructor/${instructorId}/lastName`);
                setLastName(lastNameResponse.data.lastName);

                const emailResponse = await axios.get(`http://localhost:5173/eval-api/instructor/${instructorId}/email`);
                setEmail(emailResponse.data.email);

                // Password is not fetched for security reasons
            } catch (error) {
                console.error('There was an error fetching the instructor data:', error);
            }
        };

        fetchInstructorData();
    }, []);

    const handlePasswordEditClick = () => {
        setIsEditing(true);
    };

    const handlePasswordSaveClick = async () => {
        setSuccessMessage(""); // Set default success message
        setErrorMessage(""); // Set default error message

        // Check if all fields are filled in
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setErrorMessage("All fields are required."); // Set error message
            setSuccessMessage(""); // Clear any existing success messages
            return;
        }
        
        try {
            // Verify the current password
            const response = await axios.post(`http://localhost:5173/eval-api/instructor/${accountId}/verifyPassword`, {
                currentPassword
            }, {
                withCredentials: true
            });

            if (!response.data.success) {
                setErrorMessage("Current password is incorrect.");
                setSuccessMessage("");
                return;
            }

            // Check if new password meets criteria, not shorter than 6 characters, not the same as current password, and matches confirm password
            if (newPassword.length < 6) {
                setErrorMessage("New password must be at least 6 characters long.");
                setSuccessMessage(""); 
                return;
            }
            
            // Check if new password contains at least one letter and one number

            if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
                setErrorMessage("New password must contain at least one letter and one number.");
                setSuccessMessage(""); // Clear any existing success messages
                return;
            }
            
            if (newPassword === currentPassword) {
                setErrorMessage("New password must be different from the current password.");
                setSuccessMessage(""); // Clear any existing success messages
                return;
            }

            if (newPassword !== confirmNewPassword) {
                setErrorMessage("New passwords do not match.");
                setSuccessMessage(""); // Clear any existing success messages
                return;
            }
            
            // Update the password
            await axios.put(`http://localhost:5173/eval-api/instructor/${accountId}/password`, {
                password: newPassword
            }, {
                withCredentials: true
            });

            setIsEditing(false); // hide the password edit fields after successful update
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setSuccessMessage("Password updated successfully!");

        } catch (error) {
            console.error('There was an error updating the password:', error);
            setErrorMessage("There was an error updating the password. Please try again.");
            setSuccessMessage("");
        }
    };

    return (
        <div className="background-colour">
            <AIvaluateNavBarEval navBarText='Your Account' tab='account' />
            <div className="fourth-colorbg account-details">
                <div className="detail-label">First Name</div>
                <div className="detail-row">
                    <div className="primary-colorbg detail-value">{firstName}</div>
                </div>
                <div className="detail-label">Last Name</div>
                <div className="detail-row">
                    <div className="primary-colorbg detail-value">{lastName}</div>
                </div>
                <div className="detail-label">Email</div>
                <div className="detail-row">
                    <div className="primary-colorbg detail-value">{email}</div>
                </div>
                <div className="detail-label">Password</div>
                <div>
                    {isEditing ? (
                        <>
                            <div>
                                <input
                                    type="password"
                                    className="primary-colorbg password-input"
                                    placeholder="Current Password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                            <div className="password-edit-container-hidden">
                                <input
                                    type="password"
                                    className="primary-colorbg password-input"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="password-edit-container-hidden">
                                <input
                                    type="password"
                                    className="primary-colorbg password-input"
                                    placeholder="Confirm New Password"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                />
                                <button className="primary-button save-button" onClick={handlePasswordSaveClick}>Save</button>
                            </div>
                            {errorMessage && <div className="error-message">{errorMessage}</div>}
                        </>
                    ) : (
                        <div className="password-edit-container">
                            <div className="primary-colorbg password-input">**********</div>
                            <button className="primary-button edit-button" onClick={handlePasswordEditClick}>Edit</button>
                        </div>
                    )}
                    {successMessage && <div className="success-message">{successMessage}</div>}
                </div>
                <div className="detail-label">Evaluator ID</div>
                <div className="detail-row">
                    <div className="primary-colorbg detail-value">{accountId}</div>
                </div>
            </div>
        </div>
    );
};

export default EvalAccount;
