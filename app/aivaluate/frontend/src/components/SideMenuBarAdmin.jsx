import React from 'react';
import '../GeneralStyling.css';
import '../styles.css';

const SideMenuBar3 = ({tab}) => {
  
return (
        <div className="fourth-colorbg side-menu rborder">
            <a href="Evaluator Manager" className={`${tab === "hoEvaluator Managerme" ? 'primary-color-text' : 'third-color-text'}`}>Evaluator Manager</a>
            <a className={`${tab === "Student Manager" ? 'primary-color-text' : 'third-color-text'}`}>Student Manager</a>
         
        </div>
)
}
export default SideMenuBar3;