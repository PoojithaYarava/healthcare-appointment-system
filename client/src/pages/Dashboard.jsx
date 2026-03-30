import React from 'react';

const Dashboard = () => {
  const stats = [
    { label: "Total Bookings", value: "12", color: "bg-blue-100 text-blue-600" },
    { label: "Upcoming Visits", value: "2", color: "bg-green-100 text-green-600" },
    { label: "Pending Payments", value: "$120", color: "bg-red-100 text-red-600" }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Patient Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl ${stat.color}`}>
            <p className="text-sm font-medium opacity-80">{stat.label}</p>
            <h2 className="text-3xl font-bold mt-1">{stat.value}</h2>
          </div>
        ))}
      </div>
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-4">Quick Actions</h3>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Download Reports</button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Edit Profile</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;