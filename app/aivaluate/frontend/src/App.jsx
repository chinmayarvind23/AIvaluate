import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import PrivateRouteAdmin from './SessionCheck/PrivateRouteAdmin';
import PrivateRouteEval from './SessionCheck/PrivateRouteEval';
import PrivateRouteStu from './SessionCheck/PrivateRouteStudent';
import StudentAccount from './pageComponents/StudentAccount';
import EvalAccount from './pageComponents/EvalAccount';
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
import ResetPassword from './pageComponents/ResetPassword';
import ResetPasswordAdmin from './pageComponents/ResetPasswordAdmin';
import ResetPasswordEval from './pageComponents/ResetPasswordEval';
import Rubrics from './pageComponents/Rubrics';
import SelectStudentAdmin from './pageComponents/SelectStudentAdmin';
import SelectedAssignment from './pageComponents/SelectedAssignment';
import Signup from './pageComponents/Signup';
import SignupAdmin from './pageComponents/SignupAdmin';
import StudentGrades from './pageComponents/StudentGrades';
import StudentManager from './pageComponents/StudentManager';
import StudentViewSubmissions from './pageComponents/StudentViewSubmissions';
import Students from './pageComponents/Students';
import SubmitAssignment from './pageComponents/SubmitAssignment';
const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* No session validation routes required */}
          <Route path="/" element={<Login />} /> {/* Default route */}
          <Route path="/login" element={<Login />} />
          <Route path="/stu/login" element={<Login />} />
          <Route path="/stu/signup" element={<Signup />} />
          <Route path ="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} />
          <Route path="/admin/forgotpassword" element={<ForgotPasswordAdmin />} />
          <Route path="/admin/resetpassword/:token" element={<ResetPasswordAdmin />} />
          <Route path="/eval/forgotpassword" element={<ForgotPasswordEval />} />
          <Route path="/eval/resetpassword/:token" element={<ResetPasswordEval />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/eval/login" element={<EvalLogin />} />
          <Route path="/admin/signup" element={<SignupAdmin />} />
          


          <Route path="/eval/rubric/rubricId" element={<EditRubric />} />
          <Route path="/stu/submit/assignementId" element={<SubmitAssignment />} />

          
          {/* Session validation routes for student */}
          <Route path="/stu/dashboard" element={<PrivateRouteStu element={Dashboard} />} />
          <Route path="/stu/assignment/:courseId " element={<PrivateRouteStu element={AssignmentOverview} />} /> {/* this was called AssignmentOverview but I changed the name cause that made no sense */}
          <Route path="/stu/account" element={<PrivateRouteStu element={StudentAccount} />} />
          <Route path="/stu/help" element={<PrivateRouteStu element={HelpPage} />} />
          <Route path="/stu/join-course" element={<PrivateRouteStu element={JoinCourse} />} />
          <Route path="/stu/people/:courseId" element={<PrivateRouteStu element={People} />} />    {/*   Omar    */}
          <Route path="/stu/grades" element={<PrivateRouteStu element={StudentGrades} />} />
          <Route path="/stu/people/:courseId" element={<PrivateRouteStu element={People} />} />
          <Route path="/stu/grades/:courseId" element={<PrivateRouteStu element={StudentGrades} />} />
          <Route path="/stu/submissions/:courseId" element={<PrivateRouteStu element={StudentViewSubmissions} />} />
          <Route path="/stu/submit/assignementId" element={<PrivateRouteStu element={SubmitAssignment} />} /> 
          {/* Session validation routes for admin */}
          <Route path="/admin/evaluatormanager" element={<PrivateRouteAdmin element={EvaluatorManager} />} />
          <Route path="/admin/CreateAccPT" element={<PrivateRouteAdmin element={CreateAccPT} />} />
          <Route path="/admin/studentmanager" element={<PrivateRouteAdmin element={StudentManager} />} />
          <Route path="/admin/student/:studentId" element={<PrivateRouteAdmin element={SelectStudentAdmin} />} />
          <Route path="/admin/help" element={<PrivateRouteAdmin element={AdminHelpPage} />} />
          {/* <Route path="/admin/student/studentId" element={<SelectStudentAdmin />} /> */}
          {/* Session validation routes for evaluators */}
          <Route path="/eval/grading" element={<PrivateRouteEval element={GradingAssignments} />} />
          <Route path="/eval/dashboard" element={<PrivateRouteEval element={DashboardEval} />} />
          <Route path="/eval/submissions/:courseId" element={<PrivateRouteEval element={EvalViewSubmissions} />} />
          <Route path="/eval/createcourse" element={<PrivateRouteEval element={CreateCourse} />} />
          <Route path="/eval/coursehome/:courseId" element={<PrivateRouteEval element={CourseHome} />} />
          <Route path="/eval/create-assignment" element={<PrivateRouteEval element={CreateAssignment} />} />
          <Route path="/eval/rubrics/:courseId" element={<PrivateRouteEval element={Rubrics} />} />
          <Route path="/eval/students/:courseId" element={<PrivateRouteEval element={Students} />} />
          <Route path="/eval/grades/:courseId" element={<PrivateRouteEval element={EvaluatorGrades} />} />
          <Route path="/eval/account" element={<PrivateRouteEval element={EvalAccount} />} />
          <Route path="/eval/selected/assignment" element={<PrivateRouteEval element={SelectedAssignment} />} />
          <Route path="/eval/assignments/:courseId" element={<PrivateRouteEval element={AssignmentProf} />} />
          <Route path="/eval/browse/assignment" element={<PrivateRouteEval element={BrowseAllAssignmentsEval} />} />
          <Route path="/eval/help" element={<PrivateRouteEval element={EvalhelpPage} />} />
          <Route path="/eval/rubrics/:courseId" element={<PrivateRouteEval element={EditRubric} />} />

          
        </Routes>
      </div>
    </Router>
  );
};

export default App;