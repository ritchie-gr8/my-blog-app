import Footer from "@/components/global/Footer";
import Navbar from "@/components/global/Navbar";
import React from "react";
import { Outlet } from "react-router-dom";

const StandardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default StandardLayout;
