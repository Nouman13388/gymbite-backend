import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="bg-dark-card rounded-lg p-6">
          <p className="text-gray-300">
            Welcome to the Gymbite Admin Dashboard. This will be the main dashboard page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
