import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App.tsx";
import { SecurityHeaders } from "./components/SecurityHeaders";
import { GlobalErrorBoundary } from "./components/GlobalErrorBoundary";
import { initializeSentry } from "./lib/sentry";
import "./index.css";

// Initialize Sentry error tracking (per MKF_07 Security)
initializeSentry();

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