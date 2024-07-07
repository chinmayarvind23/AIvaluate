import React from 'react';
import '../CourseCards.css';
import '../Dashboard.css';
import '../GeneralStyling.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';

const TestForComponents = () => {

  return (
    <div>
      <div className="secondary-colorbg message-container">
        <div className="notification-container">
        <p className="notificationBubble">{'\u2B24'} </p><p className="notification-text">notify text</p>
        </div>
        <h1>Your courses...</h1>
      </div>
      <AIvaluateNavBar navBarText="Hello Colton" tab="home" />
    </div>
  );
};

export default TestForComponents;
