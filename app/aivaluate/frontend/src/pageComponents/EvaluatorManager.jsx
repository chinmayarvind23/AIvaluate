import React, { useState } from 'react';
import '../Account.css';
import '../EvaluatorManager.css';
import '../GeneralStyling.css';
import AIvaluateNavBar from '../components/AIvaluateNavBar';
import FileDirectory from '../components/FileDirectory';
import SideMenuBarAdmin from '../components/SideMenuBarAdmin';
import '../styles.css';


const EvaluatorManager = () => {
  
    const files = [
      'Scott Fazackerley',
      'Ramon Lawrence',
      'Yong Goa',
      'Mohammed Khajezade',
      'Kevin Wang',
      'Ifeoma Adaji',
      'Jeff Bulmer',
      'Jonh Kingston',
    ];

    return (
        <div>
            <AIvaluateNavBar navBarText="Admin Home Portal"/>
            <SideMenuBarAdmin tab="evalManager" />
            <FileDirectory contentLabel="Professors"/>                  
        </div>
    );
};

export default EvaluatorManager;
