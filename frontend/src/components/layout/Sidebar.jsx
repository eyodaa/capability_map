import React, { useEffect, useState } from "react";
import { getParents } from "../../services/capabilityService";
import { Link } from "react-router-dom";

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
 <h2>              <Link to="/table">Table View</Link>    </h2>    
<h2><Link to="/explorer">Capability Explorer</Link> </h2>
 
     < h2><Link to="/add">Add Capability</Link> </h2>
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