import React from "react";
import { CapabilityProvider } from "./context/CapabilityContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your pages
import Dashboard from "./pages/Dashboard";
import CapabilityExplorer from "./pages/CapabilityExplorer";
import AddCapability from "./pages/AddCapability";
import TablePage from "./pages/table";
import HomePortal from "./components/HomePortal"; // The new glass menu
import Header from "./pages/header"; // The new header component
function App() {
  return (
    <CapabilityProvider>
      <Router>
         {/* The new header is now part of the main layout */}  
        <Routes>
          {/* 1. The Initial Glass Portal (The "Home" screen) */}
          <Route path="/" element={<HomePortal />} />

          {/* 2. Your existing views, now accessible from the Portal */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/explorer" element={<CapabilityExplorer />} />
          <Route path="/add" element={<AddCapability />} />
          <Route path="/table" element={<TablePage />} />
        </Routes>
      </Router>
    </CapabilityProvider>
  );
}

export default App;