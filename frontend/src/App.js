/*import React from "react";
import Dashboard from "./pages/Dashboard";
import CapabilityExplorer from "./pages/CapabilityExplorer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {

  return <Dashboard />;
  <Route path="/explorer" element={
  <CapabilityExplorer capabilities={capabilities} />
} />

}

export default App;*/

import React, { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import CapabilityExplorer from "./pages/CapabilityExplorer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getCapabilities} from "./services/capabilityService";

function App() {

  const [capabilities, setCapabilities] = useState([]);

  // Load data once
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getCapabilities();
    setCapabilities(data);
  };

  return (
    <Router>
      <Routes>

        {/* Dashboard */}
        <Route
          path="/"
          element={<Dashboard capabilities={capabilities} />}
        />

        {/* Explorer Page */}
        <Route
          path="/explorer"
          element={
            <CapabilityExplorer capabilities={capabilities} />
          }
        />
      

      </Routes>
    </Router>
  );
}

export default App;
