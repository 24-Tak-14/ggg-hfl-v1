
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Find the root element in the HTML. This is where our React app will be mounted.
const rootElement = document.getElementById('root');
if (!rootElement) {
  // This error is thrown if the 'root' div is missing from index.html, which is a critical failure.
  throw new Error("Could not find root element to mount to");
}

// Create a new root for the React application using the modern createRoot API, enabling concurrent features.
const root = ReactDOM.createRoot(rootElement);

// Render the main App component within React's StrictMode.
// StrictMode is a developer tool that highlights potential problems in an application.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
