-- Project Synopsis Table Setup
-- This script creates the Project_Synopsis table and imports data from Excel

USE customer_capital_dashboard;

-- Create Project_Synopsis table
CREATE TABLE IF NOT EXISTS Project_Synopsis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('development', 'testing', 'implemented', 'uat', 'completed', 'on_hold') DEFAULT 'development',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    assigned_to VARCHAR(100),
    eta VARCHAR(100),
    due_date DATE,
    start_date DATE,
    end_date DATE,
    progress_percentage INT DEFAULT 0,
    budget DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    purpose TEXT,
    actionable_data TEXT,
    go_live_date VARCHAR(100),
    contact_points TEXT,
    challenges TEXT,
    notes TEXT,
    date_updated VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample Project Synopsis data (you can replace this with actual Excel import)
INSERT INTO Project_Synopsis (
    project_name, 
    description, 
    status, 
    priority, 
    assigned_to, 
    eta, 
    due_date, 
    progress_percentage,
    purpose,
    actionable_data,
    go_live_date,
    contact_points,
    challenges,
    notes,
    date_updated
) VALUES (
    'Competitive Pricing Analysis',
    'The software aggregates and compares prices from Amazon, Flipkart, Croma, Reliance, and TataCliQ to optimize pricing strategies for enhanced marketability.',
    'development',
    'high',
    'Nishant',
    'August 16, 2025',
    '2025-08-16',
    60,
    'The software aggregates and compares prices from Amazon, Flipkart, Croma, Reliance, and TataCliQ to optimize pricing strategies for enhanced marketability.',
    'Provides real-time price comparisons, competitor pricing trends, and demand fluctuations to inform dynamic pricing decisions.',
    'Scheduled for August 16, 2025.',
    'Nishant or Ganesh from Customer Capital; Dr. Venkat, Owner from Shepardtri.',
    'Overcomes Amazon\'s bot detection algorithms using IP rotation and CAPTCHA-solving techniques to discreetly scrape prices.',
    'Proposal submitted and pending approval.',
    '06/08/2025'
);

-- Create indexes for better performance
CREATE INDEX idx_project_synopsis_status ON Project_Synopsis(status);
CREATE INDEX idx_project_synopsis_assigned_to ON Project_Synopsis(assigned_to);
CREATE INDEX idx_project_synopsis_due_date ON Project_Synopsis(due_date);

-- Show the created table
SHOW TABLES LIKE 'Project_Synopsis';

-- Show sample data
SELECT 'Project Synopsis Table:' as info;
SELECT * FROM Project_Synopsis; 