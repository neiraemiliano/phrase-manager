import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@components/layout/AppLayout/AppLayout";
import { TextProvider } from "@contexts/TextContext";
import { StoreProvider } from "./store";
import { HomePage } from "./pages/HomePage/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage";
import { Locale } from "./types";
import { LOCALE } from "./utils";

const App: React.FC = () => {
  const savedLocale = localStorage.getItem("app_locale") as Locale | null;

  return (
    <TextProvider defaultLocale={(savedLocale || LOCALE.ES) as Locale}>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<HomePage />} />
            </Route>
            <Route path="404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </TextProvider>
  );
};

export default App;
