import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Account from './pageComponents/Account';
import AdminProfLogin from './pageComponents/AdminProfLogin';
import AssignmentOverview from './pageComponents/AssignmentOverview';
import CourseHome from './pageComponents/CourseHome';
import CreateCourse from './pageComponents/CreateCourse';
import Dashboard from './pageComponents/Dashboard';
import ForgotPassword from './pageComponents/ForgotPassword';
import HelpPage from './pageComponents/HelpPage';
import JoinCourse from './pageComponents/JoinCourse';
import Login from './pageComponents/Login';
import People from './pageComponents/People';
import Signup from './pageComponents/Signup';
import StudentViewSubmissions from './pageComponents/StudentViewSubmissions';
import PrivateRoute from './sessionCheck/PrivateRoute';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} /> {/* Default route */}
          <Route path="/stu/login" element={<Login />} />
          <Route path="/stu/signup" element={<Signup />} />
          <Route path="/stu/dashboard" element={<PrivateRoute element={Dashboard} />} />
          <Route path="/stu/dashboard" element={<PrivateRoute element={AssignmentOverview} />} />
          <Route path="/stu/dashboard" element={<PrivateRoute element={Account} />} />
          <Route path="/stu/dashboard" element={<PrivateRoute element={HelpPage} />} />
          <Route path="/stu/dashboard" element={<PrivateRoute element={JoinCourse} />} />
          <Route path="/stu/dashboard" element={<PrivateRoute element={People} />} />
          <Route path="/stu/dashboard" element={<PrivateRoute element={CreateCourse} />} />
          <Route path="/stu/dashboard" element={<PrivateRoute element={People} />} />
          <Route path="/stu/dashboard" element={<PrivateRoute element={StudentViewSubmissions} />} />
          <Route path="/stu/dashboard" element={<PrivateRoute element={CourseHome} />} />
          <Route path ="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/admin-proflogin" element={<AdminProfLogin />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
