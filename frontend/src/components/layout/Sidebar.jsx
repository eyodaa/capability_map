import React, { useEffect, useState } from "react";
import { getParents } from "../../services/capabilityService";
import { Link } from "react-router-dom";
import logo from "../../Dashen-Bank-Logo-Addis-Ababa-Ethiopia.png";
function Sidebar({ onParentSelect }) {

  const [parents, setParents] = useState([]);

  useEffect(() => {
    loadParents();
  }, []);

  const loadParents = async () => {
    const res = await getParents();
    setParents(res.data);
  };

  return (



    <div className="sidebar">
      <img src={logo} alt="Logo" style={{ width: "80px", height: "auto" }} />
    

      <h3>Capabilities </h3>


      {parents.map((p) => (

        <div
          key={p.id}
          className="sidebar-item"
          onClick={() => onParentSelect(p)}
        >
          {p.name}
        </div>

      ))}

    </div>

  );
}

export default Sidebar;          