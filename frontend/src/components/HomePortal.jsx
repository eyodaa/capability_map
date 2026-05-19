import React from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Table, Compass, PlusCircle } from "lucide-react";
import "./portal.css";
import logo from "../Dashen-Bank-Logo-Addis-Ababa-Ethiopia.png"; 

function HomePortal() {
  const navigate = useNavigate();

  const cards = [
    { 
      id: "/dashboard", 
      title: "Capability Map", 
      desc: "Hierarchy & Maturity heat map", 
      icon: <LayoutDashboard size={32} /> 
    },
    { 
      id: "/table", 
      title: "Table View", 
      desc: "Browse full capability catalog", 
      icon: <Table size={32} /> 
    },
    { 
      id: "/explorer", 
      title: "Explorer", 
      desc: "Deep-dive architecture insights", 
      icon: <Compass size={32} /> 
    },
    { 
      id: "/add", 
      title: "Add New", 
      desc: "Register a new architecture node", 
      icon: <PlusCircle size={32} /> 
    }
  ];

  return (
    <div className="portal-wrapper">
      {/* Background logo watermark */}
      <img src={logo} className="portal-bg-logo" alt="Dashen Bank Watermark" />

      <header className="portal-header">
        <h1 className="portal-title">
          Dashen Bank <span className="title-accent">Architecture</span>
        </h1>   
      </header>
      
      {/* Updated Grid Container */}
      <div className="menu-grid">
        {cards.map((card) => (
          <div 
            key={card.id}
            className="glass-menu-card"
            onClick={() => navigate(card.id)}
          >
            <div className="card-icon">{card.icon}</div>
            <div className="card-content">
              <h2>{card.title}</h2>
              <p>{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePortal;