-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Mar 26, 2026 at 08:36 AM
-- Server version: 8.0.45
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `capability_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `capabilities`
--

CREATE TABLE `capabilities` (
  `id` varchar(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `parent_id` varchar(20) DEFAULT NULL,
  `maturity_level` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `capabilities`
--

INSERT INTO `capabilities` (`id`, `name`, `description`, `parent_id`, `maturity_level`) VALUES
('CB-01', 'CUSTOMER MANAGEMENT', 'insert description ', NULL, 1),
('CB-01-01', 'Customer Acquisition', 'insert description ', 'CB-01', 2),
('CB-01-01-01', 'Lead Management', 'insert description ', 'CB-01-01', 3),
('CB-01-01-02', 'Digital Customer Acquisition', 'insert description ', 'CB-01-01', 3),
('CB-01-01-03', 'Referral & Partner Acquisition', 'insert description ', 'CB-01-01', 3),
('CB-01-01-04', 'Customer Segmentation', 'insert description ', 'CB-01-01', 3),
('CB-01-01-05', 'On-boarding Pre-Screening', 'insert description ', 'CB-01-01', 3),
('CB-01-02', 'Customer Onboarding & KYC', 'insert description ', 'CB-01', 2),
('CB-01-02-01', 'KYC & AML Verification', 'insert description ', 'CB-01-02', 3),
('CB-01-02-02', 'Risk Profiling', 'insert description ', 'CB-01-02', 3),
('CB-01-02-03', 'Document Management', 'insert description ', 'CB-01-02', 3),
('CB-01-02-04', 'e-KYC Processing', 'insert description ', 'CB-01-02', 3),
('CB-01-02-05', 'Customer Data Validation', 'insert description ', 'CB-01-02', 3),
('CB-01-03', 'Customer Relationship Management', 'insert description ', 'CB-01', 2),
('CB-01-03-01', 'Relationship Management (Corporate)', 'insert description ', 'CB-01-03', 3),
('CB-01-03-02', 'Portfolio Management', 'insert description ', 'CB-01-03', 3),
('CB-01-03-03', 'Cross-Sell & Upsell Management', 'insert description ', 'CB-01-03', 3),
('CB-01-03-04', 'Customer Interaction History', 'insert description ', 'CB-01-03', 3),
('CB-01-03-05', 'Service Request Management', 'insert description ', 'CB-01-03', 3),
('CB-01-04', 'Customer Experience Management', 'insert description ', 'CB-01', 2),
('CB-01-04-01', 'Complaint Management', 'insert description ', 'CB-01-04', 3),
('CB-01-04-02', 'NPS Tracking', 'insert description ', 'CB-01-04', 3),
('CB-01-04-03', 'Turnaround Time Monitoring', 'insert description ', 'CB-01-04', 3),
('CB-01-04-04', 'Service Quality Monitoring', 'insert description ', 'CB-01-04', 3),
('CB-01-04-05', 'Omnichannel Journey Orchestration', 'insert description ', 'CB-01-04', 3),
('CB-02', 'PRODUCT MANAGEMENT', 'insert description ', NULL, 1),
('CB-02-01', 'Product Development', 'insert description ', 'CB-02', 2),
('CB-02-01-01', 'Product Design', 'insert description ', 'CB-02-01', 3),
('CB-02-01-02', 'Pricing Management', 'insert description ', 'CB-02-01', 3),
('CB-02-01-03', 'Profitability Analysis', 'insert description ', 'CB-02-01', 3),
('CB-02-01-04', 'Product Approval Governance', 'insert description ', 'CB-02-01', 3),
('CB-02-01-05', 'Regulatory Review', 'insert description ', 'CB-02-01', 3),
('CB-02-02', 'Product Lifecycle Management', 'insert description ', 'CB-02', 2),
('CB-02-02-01', 'Product Configuration', 'insert description ', 'CB-02-02', 3),
('CB-02-02-02', 'Product Launch Management', 'insert description ', 'CB-02-02', 3),
('CB-02-02-03', 'Product Performance Monitoring', 'insert description ', 'CB-02-02', 3),
('CB-02-02-04', 'Product Rationalization', 'insert description ', 'CB-02-02', 3),
('CB-03', 'LENDING MANAGEMENT', 'insert description ', NULL, 1),
('CB-03-01', 'Retail Lending', 'insert description ', 'CB-03', 2),
('CB-03-01-01', 'Personal Loan Origination', 'insert description ', 'CB-03-01', 3),
('CB-03-01-02', 'Mortgage Loan Management', 'insert description ', 'CB-03-01', 3),
('CB-03-01-03', 'Auto Loan Management', 'insert description ', 'CB-03-01', 3),
('CB-03-01-04', 'Credit Card Issuance', 'insert description ', 'CB-03-01', 3),
('CB-03-01-05', 'Retail Credit Scoring', 'insert description ', 'CB-03-01', 3),
('CB-03-01-06', 'Retail Collections', 'insert description ', 'CB-03-01', 3),
('CB-03-02', 'MSME Lending', 'insert description ', 'CB-03', 2),
('CB-03-02-01', 'SME Loan Origination', 'insert description ', 'CB-03-02', 3),
('CB-03-02-02', 'Working Capital Financing', 'insert description ', 'CB-03-02', 3),
('CB-03-02-03', 'Trade Credit Processing', 'insert description ', 'CB-03-02', 3),
('CB-03-02-04', 'MSME Risk Assessment', 'insert description ', 'CB-03-02', 3),
('CB-03-02-05', 'MSME Portfolio Monitoring', 'insert description ', 'CB-03-02', 3),
('CB-03-03', 'Corporate Lending', 'insert description ', 'CB-03', 2),
('CB-03-03-01', 'Corporate Credit Assessment', 'insert description ', 'CB-03-03', 3),
('CB-03-03-02', 'Financial Statement Analysis', 'insert description ', 'CB-03-03', 3),
('CB-03-03-03', 'Syndicated Loan Management', 'insert description ', 'CB-03-03', 3),
('CB-03-03-04', 'Covenant Tracking', 'insert description ', 'CB-03-03', 3),
('CB-03-03-05', 'Corporate Loan Structuring', 'insert description ', 'CB-03-03', 3),
('CB-03-03-06', 'Corporate Portfolio Monitoring', 'insert description ', 'CB-03-03', 3),
('CB-03-04', 'Credit Risk Management', 'insert description ', 'CB-03', 2),
('CB-03-04-01', 'Credit Policy Management', 'insert description ', 'CB-03-04', 3),
('CB-03-04-02', 'Credit Scoring Models', 'insert description ', 'CB-03-04', 3),
('CB-03-04-03', 'Risk Rating Assignment', 'insert description ', 'CB-03-04', 3),
('CB-03-04-04', 'Exposure Monitoring', 'insert description ', 'CB-03-04', 3),
('CB-03-04-05', 'Early Warning System', 'insert description ', 'CB-03-04', 3),
('CB-03-04-06', 'Loan Restructuring', 'insert description ', 'CB-03-04', 3),
('CB-04', 'DEPOSIT MANAGEMENT', 'insert description ', NULL, 1),
('CB-04-01', 'Retail Deposits', 'insert description ', 'CB-04', 2),
('CB-04-01-01', 'Account Opening', 'insert description ', 'CB-04-01', 3),
('CB-04-01-02', 'Savings & Current Account Management', 'insert description ', 'CB-04-01', 3),
('CB-04-01-03', 'Fixed Deposit Management', 'insert description ', 'CB-04-01', 3),
('CB-04-01-04', 'Dormancy Management', 'insert description ', 'CB-04-01', 3),
('CB-04-02', 'Corporate & MSME Deposits', 'insert description ', 'CB-04', 2),
('CB-04-02-01', 'Cash Management Accounts', 'insert description ', 'CB-04-02', 3),
('CB-04-02-02', 'Escrow Account Management', 'insert description ', 'CB-04-02', 3),
('CB-04-02-03', 'Liquidity Sweep Management', 'insert description ', 'CB-04-02', 3),
('CB-05', 'PAYMENTS & TRANSACTIONS', 'insert description ', NULL, 1),
('CB-05-01', 'Domestic Payments', 'insert description ', 'CB-05', 2),
('CB-05-01-01', 'Fund Transfers', 'insert description ', 'CB-05-01', 3),
('CB-05-01-02', 'Mobile Payments', 'insert description ', 'CB-05-01', 3),
('CB-05-01-03', 'Agency Banking Transactions', 'insert description ', 'CB-05-01', 3),
('CB-05-01-04', 'ATM Transactions', 'insert description ', 'CB-05-01', 3),
('CB-05-01-05', 'POS Transactions', 'insert description ', 'CB-05-01', 3),
('CB-05-02', 'International Payments', 'insert description ', 'CB-05', 2),
('CB-05-02-01', 'SWIFT Processing', 'insert description ', 'CB-05-02', 3),
('CB-05-02-02', 'Foreign Remittance', 'insert description ', 'CB-05-02', 3),
('CB-05-02-03', 'Trade Finance Settlement', 'insert description ', 'CB-05-02', 3),
('CB-05-02-04', 'FX Payments', 'insert description ', 'CB-05-02', 3),
('CB-06', 'CHANNEL MANAGEMENT', 'insert description ', NULL, 1),
('CB-06-01', 'Branch Channel', 'insert description ', 'CB-06', 2),
('CB-01-01-01', 'Branch Operations', 'insert description ', 'CB-06-01', 3),
('CB-01-01-02', 'Mini-Branch Management', 'insert description ', 'CB-06-01', 3),
('CB-01-01-03', 'Mobile Branch Operations', 'insert description ', 'CB-06-01', 3),
('CB-06-02', 'Digital Channels', 'insert description ', 'CB-06', 2),
('CB-06-02-01', 'Internet Banking', 'insert description ', 'CB-06-02', 3),
('CB-06-02-02', 'Mobile Banking', 'insert description ', 'CB-06-02', 3),
('CB-06-02-03', 'USSD Banking', 'insert description ', 'CB-06-02', 3),
('CB-06-02-04', 'Chatbot & AI Assistant', 'insert description ', 'CB-06-02', 3),
('CB-06-02-05', 'API Banking', 'insert description ', 'CB-06-02', 3),
('CB-06-03', 'Alternative Channels', 'insert description ', 'CB-06', 2),
('CB-06-03-01', 'Agency Banking Management', 'insert description ', 'CB-06-03', 3),
('CB-06-03-02', 'Kiosk Banking', 'insert description ', 'CB-06-03', 3),
('CB-06-03-03', 'Partner Banking Integration', 'insert description ', 'CB-06-03', 3),
('CB-07', 'TREASURY & INVESTMENT MANAGEMENT', 'insert description ', NULL, 3),
('CB-07-01', 'Liquidity Management', 'insert description ', 'CB-07', 3),
('CB-07-01-01', 'Cash Flow Forecasting', 'insert description ', 'CB-07-01', 3),
('CB-07-01-02', 'Interbank Placement', 'insert description ', 'CB-07-01', 3),
('CB-07-01-03', 'Asset-Liability Management', 'insert description ', 'CB-07-01', 3),
('CB-07-02', 'Investment Management', 'insert description ', 'CB-07', 3),
('CB-07-02-01', 'Government Securities Management', 'insert description ', 'CB-07-02', 3),
('CB-07-02-02', 'FX Trading', 'insert description ', 'CB-07-02', 3),
('CB-07-02-03', 'Money Market Operations', 'insert description ', 'CB-07-02', 3),
('CB-08', 'OPERATIONS MANAGEMENT', 'insert description ', NULL, 1),
('CB-08-01', 'Back Office Processing', 'insert description ', 'CB-08', 2),
('CB-08-01-01', 'Account Maintenance', 'insert description ', 'CB-08-01', 3),
('CB-08-01-02', 'Loan Documentation Processing', 'insert description ', 'CB-08-01', 3),
('CB-08-01-03', 'Settlement Processing', 'insert description ', 'CB-08-01', 3),
('CB-08-01-04', 'Clearing & Reconciliation', 'insert description ', 'CB-08-01', 3),
('CB-08-02', 'Process Automation', 'insert description ', 'CB-08', 2),
('CB-08-02-01', 'Workflow Management', 'insert description ', 'CB-08-02', 3),
('CB-08-02-02', 'Straight-Through Processing', 'insert description ', 'CB-08-02', 3),
('CB-08-02-03', 'RPA Management', 'insert description ', 'CB-08-02', 3),
('CB-08-02-04', 'Process Performance Monitoring', 'insert description ', 'CB-08-02', 3),
('CB-09', 'RISK & COMPLIANCE MANAGEMENT', 'insert description ', NULL, 1),
('CB-09-01', 'Enterprise Risk', 'insert description ', 'CB-09', 2),
('CB-09-01-01', 'Operational Risk Management', 'insert description ', 'CB-09-01', 3),
('CB-09-01-02', 'Market Risk Management', 'insert description ', 'CB-09-01', 3),
('CB-09-01-03', 'Liquidity Risk Monitoring', 'insert description ', 'CB-09-01', 3),
('CB-09-02', 'Compliance Management', 'insert description ', 'CB-09', 2),
('CB-09-02-01', 'Regulatory Reporting', 'insert description ', 'CB-09-02', 3),
('CB-09-02-02', 'AML Monitoring', 'insert description ', 'CB-09-02', 3),
('CB-09-02-03', 'Sanction Screening', 'insert description ', 'CB-09-02', 3),
('CB-09-02-04', 'Fraud Monitoring', 'insert description ', 'CB-09-02', 3),
('CB-10', 'FINANCE MANAGEMENT', 'insert description ', NULL, 2),
('CB-10-01', 'Financial Accounting', 'insert description ', 'CB-10', 2),
('CB-10-01-01', 'General Ledger Management', 'insert description ', 'CB-10-01', 3),
('CB-10-01-02', 'Revenue Recognition', 'insert description ', 'CB-10-01', 3),
('CB-10-01-03', 'Cost Allocation', 'insert description ', 'CB-10-01', 3),
('CB-10-02', 'Performance Management', 'insert description ', 'CB-10', 2),
('CB-10-02-01', 'Cost-to-Income Monitoring', 'insert description ', 'CB-10-02', 3),
('CB-10-02-02', 'Branch Profitability Analysis', 'insert description ', 'CB-10-02', 3),
('CB-10-02-03', 'Business Unit Performance Tracking', 'insert description ', 'CB-10-02', 1),
('CB-11', 'ENTERPRISE SUPPORT CAPABILITIES', 'insert description ', NULL, 1),
('CB-11-01', 'IT Management', 'insert description ', 'CB-11', 2),
('CB-11-01-01', 'IT Service Management', 'insert description ', 'CB-11-01', 3),
('CB-11-01-02', 'Infrastructure Management', 'insert description ', 'CB-11-01', 3),
('CB-11-01-03', 'Application Portfolio Management', 'insert description ', 'CB-11-01', 3),
('CB-11-02', 'HR Management', 'insert description ', 'CB-11', 2),
('CB-11-02-01', 'Workforce Planning', 'insert description ', 'CB-11-02', 3),
('CB-11-02-02', 'Training & Development', 'insert description ', 'CB-11-02', 3),
('CB-11-02-03', 'Performance Management', 'insert description ', 'CB-11-02', 3);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
