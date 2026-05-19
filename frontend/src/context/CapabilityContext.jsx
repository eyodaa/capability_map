import React, { createContext, useContext, useState, useEffect } from "react";
import { getParents } from "../services/capabilityService";

const CapabilityContext = createContext();

export const useCapabilities = () => useContext(CapabilityContext);

export const CapabilityProvider = ({ children }) => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadParents = async () => {
    setLoading(true);
    try {
      const res = await getParents();
      setParents(res.data || []);
    } catch (err) {
      console.error("❌ Failed to load parents:", err);
      setParents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParents();
  }, []);

  return (
    <CapabilityContext.Provider
      value={{
        parents,
        setParents,
        loadParents,
        loading
      }}
    >
      {children}
    </CapabilityContext.Provider>
  );
};