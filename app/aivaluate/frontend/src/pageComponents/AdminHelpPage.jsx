import React, { useState } from 'react';
import '../AdminHelpPage.css';
import AIvaluateNavBarAdmin from '../components/AIvaluateNavBarAdmin';
import '../GeneralStyling.css';


const aivaluatePurple = {
    color: '#4d24d4'
  }

const AdminHelpPage = () => {

  return (
    <>
    <AIvaluateNavBarAdmin navBarText='Help Page'  />
      <div className='secondary-colorbg help-section'>
          <section>
            <div className="help-content">
              <h3>Evaluator Manager</h3>
                <p>In the Evaluator Manager section of the Admin Home Portal, an administrator can perform a variety of essential tasks with the help of a user-friendly interface to manage evaluators within the system. This includes adding new evaluators, updating existing evaluator profiles, and assigning evaluators to specific courses . Administrators can also monitor and modify the roles and permissions of evaluators, ensuring they have the appropriate access and responsibilities. Additionally, the Evaluator Manager allows for the removal of evaluators from the system.</p>
              <h3>Student Manager</h3>
                <p>In the Student Manager section of the Admin Home Portal, an administrator can perform a variety of essential tasks with the help of a user-friendly interface to manage students within the system. This includes viewing and updating student profiles, which display key information such as the student's name, ID number, email address, major, and password (hidden for security). Administrators can also manage the courses that the student is enrolled in, with options to drop the student from specific courses using the Drop buttons next to each course listed. Additionally, there is a "Delete user" button for removing the student from the system entirely.</p>
              
              </div>
         </section>
    </div>
    </>
  );
};

export default AdminHelpPage;
