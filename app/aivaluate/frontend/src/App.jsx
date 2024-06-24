import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Account from './pageComponents/Account';
import AdminProfLogin from './pageComponents/AdminProfLogin';
import AssignmentOverview from './pageComponents/AssignmentOverview';
import AssignmentSubpage from './pageComponents/AssignmentSubpage';
import CourseHome from './pageComponents/CourseHome';
import CreateAccPT from './pageComponents/CreateAccPT';
import CreateCourse from './pageComponents/CreateCourse';
import Dashboard from './pageComponents/Dashboard';
import DashboardEval from './pageComponents/DashboardEval';
import EvaluatorManager from './pageComponents/EvaluatorManager';
import ForgotPassword from './pageComponents/ForgotPassword';
import GradingAssignments from './pageComponents/GradingAssignments';
import HelpPage from './pageComponents/HelpPage';
import JoinCourse from './pageComponents/JoinCourse';
import Login from './pageComponents/Login';
import People from './pageComponents/People';
import Signup from './pageComponents/Signup';
import StudentManager from './pageComponents/StudentManager';
import StudentViewSubmissions from './pageComponents/StudentViewSubmissions';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} /> {/* Default route */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path ="/dashboard" element={<Dashboard />} />
          <Route path ="/admin/evaluatormanager" element={<EvaluatorManager />} />
          <Route path ="/admin/studentmanager" element={<StudentManager />} />
          <Route path ="/assignmentoverview" element={<AssignmentOverview />} />
          <Route path ="/account" element={<Account />} />
          <Route path ="/help" element={<HelpPage />} />
          <Route path="/joincourse" element={<JoinCourse />} />
          <Route path ="/forgotpassword" element={<ForgotPassword />} />
          <Route path ="/People" element={<People />} />
          <Route path = "/createcourse" element={<CreateCourse />} />
          <Route path = "/studentviewsubmissions" element={<StudentViewSubmissions />} />
          <Route path="/admin-proflogin" element={<AdminProfLogin />} />
          <Route path="/CourseHome" element={<CourseHome />} />
          <Route path="/admin/createval" element={<CreateAccPT/>} />
          <Route path="eval/dashboard" element={<DashboardEval />} />
          <Route path="/assignmentSubpage" element={<AssignmentSubpage />} />
          <Route path="/eval/gradingassignments" element={<GradingAssignments />} />
          <Route path="eval/dashboard" element={<DashboardEval />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
