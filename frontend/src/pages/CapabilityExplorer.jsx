import React, { useState, useEffect } from 'react';
import {
  getParents,
  getCapabilities
} from '../services/capabilityService';

import './CapabilityExplorer.css';

import Header from './header'; // ✅ IMPORT HEADER

const CapabilityExplorer = () => {

  const [parents, setParents] = useState([]);
  const [allChildren, setAllChildren] = useState({});
  const [allGrandChildren, setAllGrandChildren] = useState({});
  const [expandedChild, setExpandedChild] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ TOOLTIP STATE
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: null
  });

  // =====================================
  // LOAD DATA
  // =====================================

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

  // =====================================
  // EXPAND / COLLAPSE
  // =====================================

  const toggleChild = (e, childId) => {

    e.stopPropagation();

    setExpandedChild(
      expandedChild === childId
        ? null
        : childId
    );
  };

  // =====================================
  // STATUS COLORS
  // =====================================

  const getStatusClass = (level) => {

    const l = String(level);

    if (l === '3') return 'status-green';

    if (l === '2') return 'status-orange';

    return 'status-red';
  };

  // =====================================
  // TOOLTIP HANDLERS
  // =====================================

  const handleMouseEnter = (e, item) => {

    setTooltip({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      content: item
    });

  };

  const handleMouseMove = (e) => {

    setTooltip(prev => ({
      ...prev,
      x: e.clientX,
      y: e.clientY
    }));

  };

  const handleMouseLeave = () => {

    setTooltip({
      visible: false,
      x: 0,
      y: 0,
      content: null
    });

  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <>
        <Header />

        <div className="explorer-loading">
          Generating Capability Map...
        </div>
      </>
    );
  }

  // =====================================
  // UI
  // =====================================

  return (

    <div className="explorer-layout">

      {/* ✅ HEADER */}
      <Header />

      {/* PAGE CONTENT */}
      <main className="explorer-page">

        {/* PAGE HEADER */}
        <section className="explorer-header">

          <h1 className="page-title">
            Business Capability Map
          </h1>

        </section>

        {/* MAP GRID */}
        <div className="map-masonry-grid">

          {parents.map(parent => (

            <div
              key={parent.id}
              className="level-1-box"
            >

              {/* LEVEL 1 */}
              <div
                className="level-1-label"
                onMouseEnter={(e) =>
                  handleMouseEnter(e, parent)
                }
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >

                <div
                  className={`mini-dot ${getStatusClass(parent.maturity_level)}`}
                ></div>

                {parent.name}

              </div>

              {/* LEVEL 2 */}
              <div className="level-2-container">

                {allChildren[parent.id]?.map(child => (

                  <div
                    key={child.id}
                    className={`level-2-item ${
                      expandedChild === child.id
                        ? 'active'
                        : ''
                    }`}
                    onClick={(e) =>
                      toggleChild(e, child.id)
                    }
                    onMouseEnter={(e) =>
                      handleMouseEnter(e, child)
                    }
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >

                    <div className="box-icon">
                      {expandedChild === child.id
                        ? '▾'
                        : '⊞'}
                    </div>

                    <div
                      className={`box-status-line ${getStatusClass(child.maturity_level)}`}
                    ></div>

                    <span className="level-2-name">
                      {child.name}
                    </span>

                    {/* LEVEL 3 */}
                    {expandedChild === child.id && (

                      <div className="level-3-list animate-fadeIn">

                        {allGrandChildren[child.id]?.map(grand => (

                          <div
                            key={grand.id}
                            className="level-3-tag"
                            onMouseEnter={(e) => {

                              e.stopPropagation();

                              handleMouseEnter(e, grand);

                            }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={(e) => {

                              e.stopPropagation();

                              handleMouseLeave();

                            }}
                          >

                            <div
                              className={`nano-dot ${getStatusClass(grand.maturity_level)}`}
                            ></div>

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

      </main>

      {/* ✅ TOOLTIP */}
      {tooltip.visible && tooltip.content && (

        <div
          className="custom-tooltip"
          style={{
            top: tooltip.y + 15,
            left: tooltip.x + 15
          }}
        >

          <div className="tooltip-title">
            {tooltip.content.name}
          </div>

          <div className="tooltip-maturity">
            Maturity Level:
            {" "}
            {tooltip.content.maturity_level || 'N/A'}
          </div>

          <div className="tooltip-desc">

            {tooltip.content.description ||
              "No detailed description provided."}

          </div>

        </div>

      )}

    </div>
  );
};

export default CapabilityExplorer;