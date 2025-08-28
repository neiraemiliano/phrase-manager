import React from "react";
import { utils } from "@/styles/design-system";
import { Header } from "../Header/Header";
import { ToastContainer } from "@/components/common/Toast/Toast";
import { Outlet } from "react-router-dom";

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      <main
        className={
          utils.responsive.containerMobile +
          " py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8"
        }
      >
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
};
