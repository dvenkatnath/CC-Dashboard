-- Customer Capital Dashboard Database Setup
-- This script creates the database and tables for the project dashboard

-- Create the database
CREATE DATABASE IF NOT EXISTS customer_capital_dashboard;
USE customer_capital_dashboard;

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('development', 'testing', 'implemented', 'uat', 'completed', 'on_hold') DEFAULT 'development',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    assigned_to VARCHAR(100),
    eta VARCHAR(100), -- Keeping as text as per your requirement
    due_date DATE,
    start_date DATE,
    end_date DATE,
    progress_percentage INT DEFAULT 0,
    budget DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create project_details table for additional project information
CREATE TABLE IF NOT EXISTS project_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    purpose TEXT,
    actionable_data TEXT,
    go_live_date VARCHAR(100),
    contact_points TEXT,
    challenges TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Create project_activities table for tracking project activities
CREATE TABLE IF NOT EXISTS project_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    activity_type ENUM('milestone', 'task', 'bug_fix', 'review', 'deployment', 'other') DEFAULT 'task',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in_progress', 'completed', 'blocked') DEFAULT 'pending',
    assigned_to VARCHAR(100),
    due_date DATE,
    completed_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Create users table for team members
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('admin', 'manager', 'developer', 'tester', 'analyst') DEFAULT 'developer',
    department VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data for projects
INSERT INTO projects (project_name, description, status, priority, assigned_to, eta, due_date, progress_percentage) VALUES
('Order Reconciliation', 'Automated order reconciliation system for e-commerce platforms', 'uat', 'high', 'Dr Venkat', 'August 16, 2025', '2025-08-16', 85),
('Price Grab', 'Competitive pricing analysis tool for Amazon, Flipkart, Croma, and Reliance', 'development', 'high', 'Nishant', 'August 16, 2025', '2025-08-16', 60),
('RAG-Service', 'Retrieval Augmented Generation service for document querying', 'development', 'medium', 'Kushal', 'August 11, 2025', '2025-08-11', 70),
('GA Insights', 'Google Analytics insights and reporting dashboard', 'testing', 'medium', 'Sakthi', 'September 1, 2025', '2025-09-01', 45),
('DataTalk', 'Real-time data communication and messaging platform', 'development', 'low', 'Ganesh', 'October 1, 2025', '2025-10-01', 30),
('Fin Automation', 'Financial process automation and reporting system', 'development', 'high', 'Dr Venkat', 'September 15, 2025', '2025-09-15', 55),
('HR Automation', 'Human resources process automation platform', 'development', 'medium', 'Sakthi', 'October 15, 2025', '2025-10-15', 25);

-- Insert project details
INSERT INTO project_details (project_id, purpose, actionable_data, go_live_date, contact_points, challenges, notes) VALUES
(1, 'Automated order reconciliation for e-commerce platforms', 'Real-time order matching and discrepancy reporting', 'August 16, 2025', 'Dr Venkat, Shepardtri', 'Integration with multiple payment gateways', 'Proposal submitted and pending approval'),
(2, 'Competitive pricing analysis tool', 'Real-time price comparisons and competitor pricing trends', 'August 16, 2025', 'Nishant or Ganesh from Customer Capital; Dr Venkat, Owner from Shepardtri', 'Overcoming Amazon bot detection algorithms', 'Proposal submitted and pending approval'),
(3, 'Document querying and information retrieval', 'Accurate, context-aware responses to user queries based on document content', 'August 11, 2025', 'Kushal from Customer Capital; Dr Venkat from Shepardtri', 'Achieving accuracies above 95%', 'Proposal submitted and pending approval');

-- Insert sample users
INSERT INTO users (username, full_name, email, role, department) VALUES
('dvenkat', 'Dr Venkat', 'dr.venkat@shepardtri.com', 'admin', 'Management'),
('sakthi', 'Sakthi', 'sakthi@customer-capital.com', 'manager', 'Development'),
('nishant', 'Nishant', 'nishant@customer-capital.com', 'developer', 'Development'),
('ganesh', 'Ganesh', 'ganesh@customer-capital.com', 'developer', 'Development'),
('kushal', 'Kushal', 'kushal@customer-capital.com', 'developer', 'Development');

-- Create indexes for better performance
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_assigned_to ON projects(assigned_to);
CREATE INDEX idx_projects_due_date ON projects(due_date);
CREATE INDEX idx_activities_project_id ON project_activities(project_id);
CREATE INDEX idx_activities_status ON project_activities(status);

-- Show the created tables
SHOW TABLES;

-- Show sample data
SELECT 'Projects Table:' as info;
SELECT * FROM projects LIMIT 5;

SELECT 'Project Details Table:' as info;
SELECT * FROM project_details LIMIT 3;

SELECT 'Users Table:' as info;
SELECT * FROM users LIMIT 5; 