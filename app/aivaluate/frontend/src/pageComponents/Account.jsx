import React, { useEffect, useState } from 'react';
import '../Account.css';
import '../GeneralStyling.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import '../styles.css';

const Account = () => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        studentId: ''
    });

    const [editableFields, setEditableFields] = useState({
        firstName: false,
        lastName: false,
        email: false,
        password: false
    });

    useEffect(() => {
        fetch('/users/me')
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to fetch user data');
            })
            .then(data => setUser(data))
            .catch(error => console.error(error));
    }, []);

    const handleEdit = (field, newValue) => {
        setUser(prevUser => ({
            ...prevUser,
            [field]: newValue
        }));
    }

    const handleEditClick = (field) => {
        setEditableFields(prevEditableFields => ({
            ...prevEditableFields,
            [field]: true
        }));
    }

    const handleSave = (field) => {
        setEditableFields(prevEditableFields => ({
            ...prevEditableFields,
            [field]: false
        }));

        fetch('/users/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                // Handle error display
            } else {
                setUser(data);
            }
        });
    }

    return (
        <div className="background-colour">
            <AIvaluateNavBar navBarText='Your Account' tab='account'/>  
            <div className="fourth-colorbg account-details">
                <div className="detail-label">First Name</div>
                <div className="detail-row">
                    {editableFields.firstName ? (
                        <input 
                            className="primary-colorbg detail-value"
                            type="text"
                            value={user.firstName}
                            onChange={(e) => handleEdit('firstName', e.target.value)}
                            onBlur={() => handleSave('firstName')}
                        />
                    ) : (
                        <div 
                            className="primary-colorbg detail-value"
                            onClick={() => handleEditClick('firstName')}
                        >
                            {user.firstName}
                        </div>
                    )}
                    {editableFields.firstName && <button onClick={() => handleSave('firstName')}>Save</button>}
                </div>
                <div className="detail-label">Last Name</div>
                <div className="detail-row">
                    {editableFields.lastName ? (
                        <input 
                            className="primary-colorbg detail-value"
                            type="text"
                            value={user.lastName}
                            onChange={(e) => handleEdit('lastName', e.target.value)}
                            onBlur={() => handleSave('lastName')}
                        />
                    ) : (
                        <div 
                            className="primary-colorbg detail-value"
                            onClick={() => handleEditClick('lastName')}
                        >
                            {user.lastName}
                        </div>
                    )}
                    {editableFields.lastName && <button onClick={() => handleSave('lastName')}>Save</button>}
                </div>
                <div className="detail-label">Email</div>
                <div className="detail-row">
                    {editableFields.email ? (
                        <input 
                            className="primary-colorbg detail-value"
                            type="email"
                            value={user.email}
                            onChange={(e) => handleEdit('email', e.target.value)}
                            onBlur={() => handleSave('email')}
                        />
                    ) : (
                        <div 
                            className="primary-colorbg detail-value"
                            onClick={() => handleEditClick('email')}
                        >
                            {user.email}
                        </div>
                    )}
                    {editableFields.email && <button onClick={() => handleSave('email')}>Save</button>}
                </div>
                <div className="detail-label">Password</div>
                <div className="detail-row">
                    {editableFields.password ? (
                        <input 
                            className="primary-colorbg detail-value"
                            type="password"
                            value={user.password}
                            onChange={(e) => handleEdit('password', e.target.value)}
                            onBlur={() => handleSave('password')}
                        />
                    ) : (
                        <div 
                            className="primary-colorbg detail-value"
                            onClick={() => handleEditClick('password')}
                        >
                            {user.password}
                        </div>
                    )}
                    {editableFields.password && <button onClick={() => handleSave('password')}>Save</button>}
                </div>
                <div className="detail-label">Student ID</div>
                <div className="detail-row">
                    <div className="primary-colorbg detail-value">{user.studentId}</div>
                </div>
            </div>
        </div>
    );
};

export default Account;