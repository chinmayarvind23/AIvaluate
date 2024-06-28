import React from 'react';
import '../GeneralStyling.css';
import '../SideMenu.css';
import '../styles.css';

const SideMenuBar = ({tab}) => {
  
    return (
        <div className="fourth-colorbg side-menu rborder">
            <a href="/admin/evaluatormanager" className={`${tab === "evalManager" ? 'primary-color-text' : 'third-color-text'}`}>Evaluator Manager</a>
            <a href="/admin/studentmanager" className={`${tab === "studentManager" ? 'primary-color-text' : 'third-color-text'}`}>Student Manager</a>
        </div>
    )
}
export default SideMenuBar;