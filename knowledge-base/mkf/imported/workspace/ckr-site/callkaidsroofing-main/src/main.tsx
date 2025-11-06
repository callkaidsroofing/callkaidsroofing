import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App.tsx";
import { SecurityHeaders } from "./components/SecurityHeaders";
import { GlobalErrorBoundary } from "./components/GlobalErrorBoundary";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <HelmetProvider>
        <SecurityHeaders />
        <App />
      </HelmetProvider>
    </GlobalErrorBoundary>
  </StrictMode>
);