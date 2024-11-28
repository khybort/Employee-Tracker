import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: JSX.Element;
  roles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user || !user.role || Object.keys(user).length === 0) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    if (user.role === 'manager') {
      return <Navigate to="/dashboard" />;
    }
    return <Navigate to="/employee" />;
  }

  return children;
};

export default PrivateRoute;
