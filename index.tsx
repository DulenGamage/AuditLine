
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("AuditLine: Core initializing...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("AuditLine Critical: Root element #root not found in DOM.");
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("AuditLine: Core systems online.");
  } catch (error) {
    console.error("AuditLine Startup Crash:", error);
  }
}
