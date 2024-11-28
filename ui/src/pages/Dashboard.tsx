import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex flex-col flex-grow">
        <Header title="Employee Tracker Dashboard" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 flex-grow">
          <Card
            title="Attendance"
            description="Track your attendance"
            link="/attendance"
          />
          <Card
            title="Leave Request"
            description="Request for leave"
            link="/leave-management"
          />
          <Card
            title="Reports"
            description="View your reports"
            link="/reports"
          />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
