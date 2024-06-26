import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Account from './pageComponents/Account';
import AssignmentFeedback from './pageComponents/AssignmentFeedback';
import AdminProfLogin from './pageComponents/AdminProfLogin';
import AssignmentOverview from './pageComponents/AssignmentOverview';
import CreateCourse from './pageComponents/CreateCourse';
import Dashboard from './pageComponents/Dashboard';
import DashboardEval from './pageComponents/DashboardEval';
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
import ResetPassword from './pageComponents/ResetPassword';
import Signup from './pageComponents/Signup';
import StudentGrades from './pageComponents/StudentGrades';
import StudentManager from './pageComponents/StudentManager';
import StudentViewSubmissions from './pageComponents/StudentViewSubmissions';
import AdminHome from './pageComponents/AdminHome';
import CreateAssignment from './pageComponents/CreateAssignment';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} /> {/* Default route */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assignmentoverview" element={<AssignmentOverview />} />
          <Route path="/account" element={<Account />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path ="/dashboard" element={<Dashboard />} />
          <Route path ="/assignmentfeedback" element={<AssignmentFeedback />} />
          <Route path ="/admin/evaluatormanager" element={<EvaluatorManager />} />
          <Route path ="/admin/studentmanager" element={<StudentManager />} />
          <Route path ="/assignmentoverview" element={<AssignmentOverview />} />
          <Route path ="/account" element={<Account />} />
          <Route path ="/help" element={<HelpPage />} />
          <Route path="/joincourse" element={<JoinCourse />} />
          <Route path ="/forgotpassword" element={<ForgotPassword />} />
          <Route path ="/people" element={<People />} />
          <Route path = "/createcourse" element={<CreateCourse />} />
          <Route path = "/studentviewsubmissions" element={<StudentViewSubmissions />} />
          <Route path="/global/login" element={<AdminProfLogin />} />
          <Route path="/eval/gradingassignments" element={<GradingAssignments />} />
          <Route path="eval/dashboard" element={<DashboardEval />} />
          <Route path="/eval/submissions" element={<EvalViewSubmissions />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/people" element={<People />} />
          <Route path="/createcourse" element={<CreateCourse />} />
          <Route path="/studentviewsubmissions" element={<StudentViewSubmissions />} />
          <Route path="/admin-proflogin" element={<AdminProfLogin />} />
          <Route path="/coursehome" element={<CourseHome />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} />
          <Route path="/CourseHome" element={<CourseHome />} />
          <Route path="eval/dashboard" element={<DashboardEval />} />
          <Route path="/adminhome" element={<AdminHome />} />
          <Route path="/admin/create-assignment" element={<CreateAssignment />} />
          <Route path="eval/rubrics" element={<Rubrics />} />
          <Route path="/stu/grades" element={<StudentGrades />} />
          <Route path="/eval/grades" element={<EvaluatorGrades />} />
          <Route path="/eval/gradingassignments" element={<GradingAssignments />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;