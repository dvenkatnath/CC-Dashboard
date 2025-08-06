-- Customer Capital Work Details Table Setup for MySQL

-- Create Customer_Capital_Work_Details table
CREATE TABLE IF NOT EXISTS Customer_Capital_Work_Details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  serial_number INT,
  description TEXT NOT NULL,
  project_type VARCHAR(255),
  status VARCHAR(255),
  customer_contact VARCHAR(255),
  eta VARCHAR(255),
  shepardti_owner VARCHAR(255),
  proposal_submitted VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_work_details_status ON Customer_Capital_Work_Details(status);
CREATE INDEX idx_work_details_project_type ON Customer_Capital_Work_Details(project_type);
CREATE INDEX idx_work_details_serial_number ON Customer_Capital_Work_Details(serial_number);

-- Show table structure
DESCRIBE Customer_Capital_Work_Details; 