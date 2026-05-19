import React from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  ChevronDown,
} from "lucide-react";

import logo from "../Dashen-Bank-Logo-Addis-Ababa-Ethiopia.png";

const Header = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>
        {`
          .main-header {
            height: 82px;
            width: 100%;
            background: linear-gradient(90deg, #001B4D 0%, #002D73 100%);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 32px;
            box-sizing: border-box;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          }

          .header-left {
            display: flex;
            align-items: center;
            gap: 18px;
            cursor: pointer;
          }

          .logo-wrapper {
            width: 58px;
            height: 58px;
            border-radius: 14px;
            background: rgba(255, 255, 255, 0.08);
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(4px);
          }

          .header-logo {
            width: 42px;
            height: 42px;
            object-fit: contain;
          }

          .header-text {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .header-title {
            color: #ffffff;
            font-size: 1.9rem;
            font-weight: 700;
            letter-spacing: 0.4px;
            line-height: 1;
            margin-bottom: 4px;
          }

          .header-subtitle {
            color: rgba(255, 255, 255, 0.75);
            font-size: 0.92rem;
            font-weight: 400;
            letter-spacing: 0.3px;
          }

          .header-right {
            display: flex;
            align-items: center;
            gap: 18px;
          }

          .user-profile {
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.12);
            padding: 10px 16px;
            border-radius: 50px;
            transition: all 0.2s ease;
            cursor: pointer;
          }

          .user-profile:hover {
            background: rgba(255, 255, 255, 0.14);
          }

          .user-icon-wrapper {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.16);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .welcome-text {
            display: flex;
            flex-direction: column;
            line-height: 1.1;
          }

          .welcome-label {
            color: rgba(255, 255, 255, 0.65);
            font-size: 0.72rem;
          }

          .user-name {
            color: #ffffff;
            font-size: 0.96rem;
            font-weight: 600;
          }

          @media (max-width: 768px) {
            .main-header {
              padding: 0 16px;
              height: 74px;
            }

            .header-title {
              font-size: 1.3rem;
            }

            .header-subtitle {
              display: none;
            }

            .welcome-text {
              display: none;
            }

            .user-profile {
              padding: 8px;
            }
          }
        `}
      </style>

      <header className="main-header">
        {/* LEFT SIDE */}
        <div
          className="header-left"
          onClick={() => navigate("/")}
        >
          <div className="logo-wrapper">
            <img
              src={logo}
              alt="Dashen Bank"
              className="header-logo"
            />
          </div>

          <div className="header-text">
            <span className="header-title">
           DASHEN BANK
            </span>

            <span className="header-subtitle">
              Structured Business Architecture
            </span>
          </div>
        </div>


          
          
        
      </header>
    </>
  );
};

export default Header;