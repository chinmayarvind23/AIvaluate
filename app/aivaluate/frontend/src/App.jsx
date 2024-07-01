import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import PrivateRouteAdmin from './SessionCheck/PrivateRouteAdmin';
import PrivateRouteEval from './SessionCheck/PrivateRouteEval';
import PrivateRouteStu from './SessionCheck/PrivateRouteStudent';
import Account from './pageComponents/Account';
import AdminLogin from './pageComponents/AdminLogin';
import AssignmentOverview from './pageComponents/AssignmentOverview';
import AssignmentProf from './pageComponents/AssignmentProf';
import BrowseAllAssignmentsEval from './pageComponents/BrowseAllAssignmentsEval';
import CourseHome from './pageComponents/CourseHome';
import CreateAssignment from './pageComponents/CreateAssignment';
import CreateCourse from './pageComponents/CreateCourse';
import Dashboard from './pageComponents/Dashboard';
import DashboardEval from './pageComponents/DashboardEval';
import EditRubric from './pageComponents/EditRubric';
import EvalLogin from './pageComponents/EvalLogin';
import EvalViewSubmissions from './pageComponents/EvalViewSubmissions';
import EvaluatorGrades from './pageComponents/EvaluatorGrades';
import EvaluatorManager from './pageComponents/EvaluatorManager';
import ForgotPassword from './pageComponents/ForgotPassword';
import GradingAssignments from './pageComponents/GradingAssignments';
import HelpPage from './pageComponents/HelpPage';
import JoinCourse from './pageComponents/JoinCourse';
import Login from './pageComponents/Login';
import People from './pageComponents/People';
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
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/eval/login" element={<EvalLogin />} />
          <Route path="/admin/signup" element={<SignupAdmin />} />


          <Route path="/eval/rubric/rubricId" element={<EditRubric />} />
          <Route path="/stu/submit/assignementId" element={<SubmitAssignment />} />

          
          {/* Session validation routes for student */}
          <Route path="/stu/dashboard" element={<PrivateRouteStu element={Dashboard} />} />
          <Route path="/stu/assignment/:courseId" element={<PrivateRouteStu element={AssignmentOverview} />} />
          <Route path="/stu/account" element={<PrivateRouteStu element={Account} />} />
          <Route path="/stu/help" element={<PrivateRouteStu element={HelpPage} />} />
          <Route path="/stu/join-course" element={<PrivateRouteStu element={JoinCourse} />} />

          <Route path="/stu/people/:courseId" element={<PrivateRouteStu element={People} />} />    {/*   Omar    */}

          <Route path="/stu/grades" element={<PrivateRouteStu element={StudentGrades} />} />
          <Route path="/stu/submissions" element={<PrivateRouteStu element={StudentViewSubmissions} />} />
          <Route path="/stu/people/:courseId" element={<PrivateRouteStu element={People} />} />
          <Route path="/stu/grades/:courseId" element={<PrivateRouteStu element={StudentGrades} />} />
          <Route path="/stu/submissions/:courseId" element={<PrivateRouteStu element={StudentViewSubmissions} />} />
          <Route path="/stu/submit/assignementId" element={<PrivateRouteStu element={SubmitAssignment} />} /> 
          {/* Session validation routes for admin */}
          <Route path="/admin/evaluatormanager" element={<PrivateRouteAdmin element={EvaluatorManager} />} />
          <Route path="/admin/studentmanager" element={<PrivateRouteAdmin element={StudentManager} />} />
          <Route path="/admin/student/:studentId" element={<PrivateRouteAdmin element={SelectStudentAdmin} />} />
          {/* <Route path="/admin/student/studentId" element={<SelectStudentAdmin />} /> */}
          {/* Session validation routes for evaluators */}
          <Route path="/eval/grading" element={<PrivateRouteEval element={GradingAssignments} />} />
          <Route path="/eval/dashboard" element={<PrivateRouteEval element={DashboardEval} />} />
          <Route path="/eval/submissions/:courseId" element={<PrivateRouteEval element={EvalViewSubmissions} />} />
          <Route path="/eval/createcourse" element={<PrivateRouteEval element={CreateCourse} />} />
          <Route path="/eval/coursehome/:courseId" element={<PrivateRouteEval element={CourseHome} />} />
          <Route path="/eval/create-assignment" element={<PrivateRouteEval element={CreateAssignment} />} />
          <Route path="/eval/rubrics" element={<PrivateRouteEval element={Rubrics} />} />
          <Route path="/eval/students/:courseId" element={<PrivateRouteEval element={Students} />} />
          <Route path="/eval/grades/:courseId" element={<PrivateRouteEval element={EvaluatorGrades} />} />
          <Route path="/eval/selected/assignment" element={<PrivateRouteEval element={SelectedAssignment} />} />
          <Route path="/eval/assignments/:courseId" element={<PrivateRouteEval element={AssignmentProf} />} />
          <Route path="/eval/browse/assignment" element={<PrivateRouteEval element={BrowseAllAssignmentsEval} />} />
          <Route path="/eval/rubrics/:courseId" element={<PrivateRouteEval element={EditRubric} />} />
          
        </Routes>
      </div>
    </Router>
  );
};

export default App;