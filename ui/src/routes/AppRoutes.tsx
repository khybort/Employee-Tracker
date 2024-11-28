import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Attendance from '../pages/Attendance';
import NotFound from '../pages/NotFound';
import PrivateRoute from './PrivateRoute';
import Layout from '../components/Layout';
import { AuthProvider } from '../hooks/useAuth';
import ReportsPage from '../pages/Reports';
import CreateEmployee from '../pages/CreateEmployee';
import PersonelPage from '../pages/PersonelPage';
import LeaveRequestPage from '../pages/LeaveRequestPage';

const AppRoutes: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute roles={['manager']}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <PrivateRoute roles={['manager', 'employee']}>
                  <Attendance />
                </PrivateRoute>
              }
            />
            <Route
              path="/leave-management"
              element={
                <PrivateRoute roles={['manager', 'employee']}>
                  <LeaveRequestPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute roles={['manager']}>
                  <ReportsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/create"
              element={
                <PrivateRoute roles={['manager']}>
                  <CreateEmployee />
                </PrivateRoute>
              }
            />
            <Route
              path="/employee"
              element={
                <PrivateRoute roles={['employee']}>
                  <PersonelPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
