import React from "react";
import Navbar from "../components/Navbar";

const Dashboard = ({ backgroundColor }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Add padding to prevent overlap */}
      <div className="pt-20">
        <h1 className="text-center text-2xl font-semibold">
          Welcome to the Dashboard
        </h1>
      </div>
    </div>
  );
};

export default Dashboard;
