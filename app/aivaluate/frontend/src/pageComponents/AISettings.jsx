// import CircumIcon from "@klarr-agency/circum-icons-react";
// import React, { useEffect, useState } from 'react';
// import { FaSearch } from 'react-icons/fa';
// import { useNavigate, useParams } from 'react-router-dom';
import '../AISettings.css';
import '../GeneralStyling.css';
import AIvaluateNavBarEval from '../components/AIvaluateNavBarEval';

const AISettings = () => {


    return (
        <div>
            <AIvaluateNavBarEval tab="ai" navBarText={navBarText} />
            <div className='secondary-colorbg ai-section'>
                <div className="help-content">
                </div>
        </div>
        </div>
    );
};

export default AISettings;

