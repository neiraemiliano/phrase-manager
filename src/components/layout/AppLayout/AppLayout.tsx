import React from "react";
import { Header } from "../Header/Header";
import { ToastContainer } from "@/components/common/Toast/Toast";
import { Outlet } from "react-router-dom";

export const AppLayout: React.FC = () => {
  return (
    <div className="z-10 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
};
