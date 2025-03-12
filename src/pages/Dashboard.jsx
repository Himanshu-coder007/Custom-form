import React from "react";
import Navbar from "../components/Navbar";
import Forms from "../components/Forms";

const Dashboard = ({ backgroundColor }) => {
  return (
    <div className={`min-h-screen ${backgroundColor || "bg-gray-100"}`}>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="pt-20 p-6">
        {/* Forms Component */}
        <Forms />
      </div>
    </div>
  );
};

export default Dashboard;
