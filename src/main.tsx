import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App.tsx";
import { SecurityHeaders } from "./components/SecurityHeaders";
import { SecurityMonitor } from "./components/SecurityMonitor";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <SecurityHeaders />
      <SecurityMonitor />
      <App />
    </HelmetProvider>
  </StrictMode>
);
