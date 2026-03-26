import React, { useState, useEffect } from 'react';
import { getParents, getCapabilities } from '../services/capabilityService';
import './CapabilityExplorer.css';

const CapabilityExplorer = () => {
  const [parents, setParents] = useState([]);
  const [allChildren, setAllChildren] = useState({});
  const [allGrandChildren, setAllGrandChildren] = useState({});
  const [expandedChild, setExpandedChild] = useState(null); // Track which Level 2 is open
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        const parentRes = await getParents();
        const parentsData = parentRes.data;
        setParents(parentsData);

        const childMap = {};
        const grandChildMap = {};

        for (const parent of parentsData) {
          const childRes = await getCapabilities(parent.id);
          childMap[parent.id] = childRes.data;

          for (const child of childRes.data) {
            const grandRes = await getCapabilities(child.id);
            grandChildMap[child.id] = grandRes.data;
          }
        }

        setAllChildren(childMap);
        setAllGrandChildren(grandChildMap);
      } catch (err) {
        console.error("Data Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  const toggleChild = (e, childId) => {
    e.stopPropagation();
    setExpandedChild(expandedChild === childId ? null : childId);
  };

 const getStatusClass = (level) => {
  if (level === 3 || level === '3') return 'status-green';
  if (level === 2 || level === '2') return 'status-orange';
  return 'status-red';
};

  if (loading) return <div className="p-10 text-slate-500">Generating Map...</div>;

  return (
    <div className="explorer-page">
      <h1 className="page-title">Business Capability Map</h1>
      
      <div className="map-masonry-grid">
        {parents.map(parent => (
          <div key={parent.id} className="level-1-box">
            <div className="level-1-label">
               <div className={`mini-dot ${getStatusClass(parent.maturity_level)}`}></div>
               {parent.name}
            </div>

            <div className="level-2-container">
              {allChildren[parent.id]?.map(child => (
                <div 
                  key={child.id} 
                  className={`level-2-item ${expandedChild === child.id ? 'active' : ''}`}
                  onClick={(e) => toggleChild(e, child.id)}
                >
                  <div className="box-icon">{expandedChild === child.id ? '▾' : '⊞'}</div>
                  <div className={`box-status-line ${getStatusClass(child.maturity_level)}`}></div>
                  <span className="level-2-name">{child.name}</span>

                  {/* Level 3: Only displayed if this specific child is clicked */}
                  {expandedChild === child.id && (
                    <div className="level-3-list animate-fadeIn">
                      {allGrandChildren[child.id]?.map(grand => (
                        <div key={grand.id} className="level-3-tag">
                          <div className={`nano-dot ${getStatusClass(grand.maturity_level)}`}></div>
                          {grand.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CapabilityExplorer;