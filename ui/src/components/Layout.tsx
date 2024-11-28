import React from 'react';
import Sidebar from './Sidebar';
import Notifications from './LiveNotifications';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const excludedRoutes = ['/login'];

  if (excludedRoutes.includes(location.pathname)) {
    return <div>{children}</div>;
  }
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-grow flex flex-col">
        <Notifications />
        <main className="flex-grow p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
