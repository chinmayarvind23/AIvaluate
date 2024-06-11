import React from 'react';
import '../Account.css';
import '../GeneralStyling.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import '../styles.css';

const Account = () => {
    const firstName = "Colton";
    const lastName = "Palfrey";
    const email = "colton@email.com";
    const password = "*********";
    const accountId = "12348817";
    const id = "Student ID";
    const prof = false;
    if (prof === true) {
        id = "Evaluator ID";
    }

    const editFirstName = () => {

    }

    const editLastName = () => {
        
    }
    const editEmail = () => {
        
    }
    const editPassword = () => {
        
    }

  return (
    <div class="background-colour">
        <AIvaluateNavBar navBarText='Your Account' tab='account'/>  
            <div className="fourth-colorbg account-details">
                <div className="detail-label">First Name</div>
                <div className="detail-row">
                    <div className="primary-colorbg detail-value">{firstName}</div>
                    <button action={firstName} className="primary-button edit-button">Edit</button>
                </div>
                <div className="detail-label">Last Name</div>
                <div className="detail-row">
                    <div className="primary-colorbg detail-value">{lastName}</div>
                    <button action={lastName} className="primary-button edit-button">Edit</button>
                </div>
                <div className="detail-label">Email</div>
                <div className="detail-row">
                    <div className="primary-colorbg detail-value">{email}</div>
                    <button action={editEmail} className="primary-button edit-button">Edit</button>
                </div>
                <div className="detail-label">Password</div>
                <div className="detail-row">
                    <div className="primary-colorbg detail-value">{password}</div>
                    <button action={editPassword} className="primary-button edit-button">Edit</button>
                </div>
                <div className="detail-label">{id}</div>
                <div className="detail-row">
                    <div className="primary-colorbg detail-value">{accountId}</div>
                </div>
            </div>
    </div>
    
  );
};

export default Account;
