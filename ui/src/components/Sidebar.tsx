import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NotificationsPanel from './NotificationsPanel';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isManager = user?.role === 'manager';

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="text-center py-4 text-xl font-bold border-b border-gray-700">
        Employee Tracker
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2 p-4">
          <li>
            <Link
              to="/dashboard"
              className="block p-2 rounded hover:bg-gray-700"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/attendance"
              className="block p-2 rounded hover:bg-gray-700"
            >
              Attendance
            </Link>
          </li>
          <li>
            <Link
              to="/leave-management"
              className="block p-2 rounded hover:bg-gray-700"
            >
              Leave Management
            </Link>
          </li>
          {isManager && (
            <>
              <li>
                <Link
                  to="/reports"
                  className="block p-2 rounded hover:bg-gray-700"
                >
                  Reports
                </Link>
              </li>
              <li>
                <Link
                  to="/create"
                  className="block p-2 rounded hover:bg-gray-700"
                >
                  Create Employee
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <NotificationsPanel />
      </div>
      <div className="p-4 border-t border-gray-700">
        <button
          type="button"
          className="w-full p-2 bg-red-600 rounded hover:bg-red-700"
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
