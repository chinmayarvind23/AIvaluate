import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import PrivateRouteAdmin from './SessionCheck/PrivateRouteAdmin';
import PrivateRouteEval from './SessionCheck/PrivateRouteEval';
import PrivateRouteStu from './SessionCheck/PrivateRouteStudent';
import AISettings from './pageComponents/AISettings';
import AdminAccount from './pageComponents/AdminAccount';
import AdminHelpPage from './pageComponents/AdminHelpPage';
import AdminLogin from './pageComponents/AdminLogin';
import AssignmentOverview from './pageComponents/AssignmentOverview';
import AssignmentProf from './pageComponents/AssignmentProf';
import BrowseAllAssignmentsEval from './pageComponents/BrowseAllAssignmentsEval';
import CourseHome from './pageComponents/CourseHome';
import CreateAccPT from './pageComponents/CreateAccPT';
import CreateAssignment from './pageComponents/CreateAssignment';
import CreateCourse from './pageComponents/CreateCourse';
import Dashboard from './pageComponents/Dashboard';
import DashboardEval from './pageComponents/DashboardEval';
import EditRubric from './pageComponents/EditRubric';
import EvalAccount from './pageComponents/EvalAccount';
import EvalhelpPage from './pageComponents/EvalHelpPage';
import EvalLogin from './pageComponents/EvalLogin';
import EvalViewSubmissions from './pageComponents/EvalViewSubmissions';
import EvaluatorGrades from './pageComponents/EvaluatorGrades';
import EvaluatorManager from './pageComponents/EvaluatorManager';
import ForgotPassword from './pageComponents/ForgotPassword';
import ForgotPasswordAdmin from './pageComponents/ForgotPasswordAdmin';
import ForgotPasswordEval from './pageComponents/ForgotPasswordEval';
import GradingAssignments from './pageComponents/GradingAssignments';
import HelpPage from './pageComponents/HelpPage';
import JoinCourse from './pageComponents/JoinCourse';
import Login from './pageComponents/Login';
import People from './pageComponents/People';
import PublishAssignment from './pageComponents/PublishAssignment';
import ResetPassword from './pageComponents/ResetPassword';
import ResetPasswordAdmin from './pageComponents/ResetPasswordAdmin';
import ResetPasswordEval from './pageComponents/ResetPasswordEval';
import Rubrics from './pageComponents/Rubrics';
import SelectStudentAdmin from './pageComponents/SelectStudentAdmin';
import SelectedAssignment from './pageComponents/SelectedAssignment';
import Signup from './pageComponents/Signup';
import SignupAdmin from './pageComponents/SignupAdmin';
import StudentAccount from './pageComponents/StudentAccount';
import StudentGrades from './pageComponents/StudentGrades';
import StudentManager from './pageComponents/StudentManager';
import StudentViewSubmissions from './pageComponents/StudentViewSubmissions';
import Students from './pageComponents/Students';
import SubmitAssignment from './pageComponents/SubmitAssignment';

import EvalManagerInfo from './pageComponents/EvalManagerInfo';
import TestForComponents from './pageComponents/testForComponents';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* No session validation routes required */}
          <Route path="/" element={<Login />} /> {/* Default route */}
          <Route path="/login" element={<Login />} /> {/* Done*/}
          <Route path="/stu/login" element={<Login />} /> {/* Done*/}
          <Route path="/stu/signup" element={<Signup />} /> {/* Done*/}
          <Route path ="/forgotpassword" element={<ForgotPassword />} /> {/* Done*/}
          <Route path="/resetpassword/:token" element={<ResetPassword />} /> {/* Done*/}
          <Route path="/admin/forgotpassword" element={<ForgotPasswordAdmin />} /> {/* Done*/}
          <Route path="/admin/resetpassword/:token" element={<ResetPasswordAdmin />} /> {/* Done*/}
          <Route path="/eval/forgotpassword" element={<ForgotPasswordEval />} /> {/* Done*/}
          <Route path="/eval/resetpassword/:token" element={<ResetPasswordEval />} /> {/* Done*/}
          <Route path="/admin/login" element={<AdminLogin />} /> {/* Done*/}
          <Route path="/eval/login" element={<EvalLogin />} /> {/* Done*/}
          <Route path="/admin/signup" element={<SignupAdmin />} /> {/* Done*/}
          <Route path="/test" element={<TestForComponents />} /> {/* Done*/}


          {/* <Route path="/eval/rubric/rubricId" element={<EditRubric />} /> */}

          {/* <Route path="/stu/submit/assignementId" element={<SubmitAssignment />} /> */}

          
          {/* Session validation routes for student */}
          <Route path="/stu/dashboard" element={<PrivateRouteStu element={Dashboard} />} /> {/* Done*/}
          <Route path="/stu/assignment/:courseId" element={<PrivateRouteStu element={AssignmentOverview} />} /> {/*done*/}
          <Route path="/stu/account" element={<PrivateRouteStu element={StudentAccount} />} /> {/* Done*/}
          <Route path="/stu/help" element={<PrivateRouteStu element={HelpPage} />} /> {/* Done*/}
          <Route path="/stu/join-course" element={<PrivateRouteStu element={JoinCourse} />} /> {/* Done*/}
          <Route path="/stu/people/:courseId" element={<PrivateRouteStu element={People} />} /> {/* Done*/}
          <Route path="/stu/grades/:courseId" element={<PrivateRouteStu element={StudentGrades} />} /> {/*done*/}
          <Route path="/stu/submissions/:courseId" element={<PrivateRouteStu element={StudentViewSubmissions} />} /> {/* Done*/}
          <Route path="/stu/submit/:courseId/:assignmentId" element={<PrivateRouteStu element={SubmitAssignment} />} /> {/*done*/}
          {/* Session validation routes for admin */}
          <Route path="/admin/evaluatormanager" element={<PrivateRouteAdmin element={EvaluatorManager} />} /> {/* Done*/}
          <Route path="/admin/evalManagerInfo" element={<PrivateRouteAdmin element={EvalManagerInfo} />} /> {/* Done*/}
          <Route path="/admin/CreateAccPT" element={<PrivateRouteAdmin element={CreateAccPT} />} /> {/* Done*/}
          <Route path="/admin/studentmanager" element={<PrivateRouteAdmin element={StudentManager} />} /> {/* Done*/}
          <Route path="/admin/student/:studentId" element={<PrivateRouteAdmin element={SelectStudentAdmin} />} /> {/* Done*/}
          <Route path="/admin/help" element={<PrivateRouteAdmin element={AdminHelpPage} />} /> {/* Done*/}
          <Route path="/admin/account" element={<PrivateRouteAdmin element={AdminAccount} />} /> {/* Done*/}
          
          {/* Session validation routes for evaluators */}
          <Route path="/eval/grading" element={<PrivateRouteEval element={GradingAssignments} />} />
          <Route path="/eval/dashboard" element={<PrivateRouteEval element={DashboardEval} />} /> {/* Done*/}
          <Route path="/eval/submissions/:courseId" element={<PrivateRouteEval element={EvalViewSubmissions} />} /> {/* Done*/}
          <Route path="/eval/createcourse" element={<PrivateRouteEval element={CreateCourse} />} /> {/* Done*/}
          <Route path="/eval/coursehome/:courseId" element={<PrivateRouteEval element={CourseHome} />} /> {/* Done*/}
          <Route path="/eval/create/assignment/:courseId" element={<PrivateRouteEval element={CreateAssignment} />} /> {/* Done*/}
          <Route path="/eval/rubrics/:courseId" element={<PrivateRouteEval element={Rubrics} />} /> {/* Done*/}
          <Route path="/eval/students/:courseId" element={<PrivateRouteEval element={Students} />} /> {/* Done*/}
          <Route path="/eval/grades/:courseId" element={<PrivateRouteEval element={EvaluatorGrades} />} /> {/* Done*/}
          <Route path="/eval/account" element={<PrivateRouteEval element={EvalAccount} />} /> {/* Done*/}
          <Route path="/eval/selected/:assignmentId" element={<PrivateRouteEval element={SelectedAssignment} />} /> {/* Done*/}
          <Route path="/eval/assignments/:courseId" element={<PrivateRouteEval element={AssignmentProf} />} /> {/* Done*/}
          <Route path="/eval/browse/assignments" element={<PrivateRouteEval element={BrowseAllAssignmentsEval} />} /> {/* Done*/}
          <Route path="/eval/help" element={<PrivateRouteEval element={EvalhelpPage} />} /> {/* Done*/}
          <Route path="/eval/rubric/:assignmentRubricId" element={<PrivateRouteEval element={EditRubric} />} /> {/* Done*/}
          {/* <Route path="/eval/individualrubric" element={<PrivateRouteEval element={ProfIndividualRubric} />} />  */} {/* This is the same page as EditRubric*/}
          <Route path="/eval/published/:assignmentId" element={<PrivateRouteEval element={PublishAssignment} />} /> {/* Done*/}
          <Route path="/eval/ai/settings" element={<PrivateRouteEval element={AISettings} />} /> {/* Done*/}


        </Routes>
      </div>
    </Router>
  );
};

export default App;