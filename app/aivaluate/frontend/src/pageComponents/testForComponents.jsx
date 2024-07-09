import React from 'react';
import '../Account.css';
import '../GeneralStyling.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';
import '../styles.css';

const EvalAccount = () => {
    

    return (
        <div className="background-colour">
            <AIvaluateNavBarEval navBarText='Your Account' tab='account' />
            <div className="fourth-colorbg account-details">
                <div className="detail-label">First Name</div>
                <div className="detail-row">
                    <div className="primary-colorbg detail-value">first name</div>
                </div>
                <div className="detail-label">Last Name</div>
                <div className="detail-row">
                    <div className="primary-colorbg detail-value">last name</div>
                </div>
                <div className="detail-label">Email</div>
                <div className="detail-row">
                    <div className="primary-colorbg detail-value">email</div>
                </div>
                <div className="detail-label">Password</div>
                <div>
                            <div>
                                <input
                                    type="password"
                                    className="primary-colorbg password-input"
                                    placeholder="Current Password"
                             
                                />
                            </div>
                            <div className="password-edit-container-hidden">
                                <input
                                    type="password"
                                    className="primary-colorbg password-input"
                                    placeholder="New Password"
                               
                                />
                            </div>
                            <div className="password-edit-container-hidden">
                                <input
                                    type="password"
                                    className="primary-colorbg password-input"
                                    placeholder="Confirm New Password"
  
                                />
                                <button className="primary-button save-button" >Save</button>
                                <div className="empty"></div>
                            </div>

                        <div className="password-edit-container">
                        
                            <button className="primary-button edit-button" >Edit</button>
                        </div>

                </div>
                <div className="detail-label"></div>
                <div className="detail-row">
                    <div className="primary-colorbg detail-value"></div>
                </div>
            </div>
        </div>
    );
};

export default EvalAccount;
