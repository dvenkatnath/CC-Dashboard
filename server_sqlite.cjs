const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const dbPath = path.join(__dirname, 'customer_capital_dashboard.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening SQLite database:', err.message);
    return;
  }
  console.log('✅ Connected to SQLite database');
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// API Routes

// Get all projects
app.get('/api/project-synopsis', (req, res) => {
  const sql = 'SELECT * FROM Project_Synopsis ORDER BY created_at DESC';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching Project Synopsis data:', err);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching Project Synopsis data', 
        error: err.message 
      });
      return;
    }
    
    res.json({ 
      success: true, 
      data: rows,
      message: 'Data fetched from SQLite database'
    });
  });
});

// Get project by ID
app.get('/api/project-synopsis/:id', (req, res) => {
  const sql = 'SELECT * FROM Project_Synopsis WHERE id = ?';
  
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      console.error('Error fetching Project Synopsis:', err);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching Project Synopsis', 
        error: err.message 
      });
      return;
    }
    
    if (!row) {
      res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
      return;
    }
    
    res.json({ 
      success: true, 
      data: row,
      message: 'Project fetched from SQLite database'
    });
  });
});

// Create new project
app.post('/api/project-synopsis', (req, res) => {
  const {
    project_name, description, status, priority, assigned_to, eta,
    progress_percentage, purpose, actionable_data, go_live_date,
    contact_points, challenges, notes
  } = req.body;

  const sql = `
    INSERT INTO Project_Synopsis (
      project_name, description, status, priority, assigned_to, eta,
      progress_percentage, purpose, actionable_data, go_live_date,
      contact_points, challenges, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    project_name, description, status, priority, assigned_to, eta,
    progress_percentage, purpose, actionable_data, go_live_date,
    contact_points, challenges, notes
  ];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Error creating Project Synopsis:', err);
      res.status(500).json({ 
        success: false, 
        message: 'Error creating Project Synopsis', 
        error: err.message 
      });
      return;
    }
    
    res.json({ 
      success: true, 
      data: { id: this.lastID },
      message: 'Project created in SQLite database'
    });
  });
});

// Update project
app.put('/api/project-synopsis/:id', (req, res) => {
  const {
    project_name, description, status, priority, assigned_to, eta,
    progress_percentage, purpose, actionable_data, go_live_date,
    contact_points, challenges, notes
  } = req.body;

  const sql = `
    UPDATE Project_Synopsis SET
      project_name = ?, description = ?, status = ?, priority = ?,
      assigned_to = ?, eta = ?, progress_percentage = ?, purpose = ?,
      actionable_data = ?, go_live_date = ?, contact_points = ?,
      challenges = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  const params = [
    project_name, description, status, priority, assigned_to, eta,
    progress_percentage, purpose, actionable_data, go_live_date,
    contact_points, challenges, notes, req.params.id
  ];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Error updating Project Synopsis:', err);
      res.status(500).json({ 
        success: false, 
        message: 'Error updating Project Synopsis', 
        error: err.message 
      });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
      return;
    }
    
    res.json({ 
      success: true, 
      data: { id: req.params.id },
      message: 'Project updated in SQLite database'
    });
  });
});

// Delete project
app.delete('/api/project-synopsis/:id', (req, res) => {
  const sql = 'DELETE FROM Project_Synopsis WHERE id = ?';
  
  db.run(sql, [req.params.id], function(err) {
    if (err) {
      console.error('Error deleting Project Synopsis:', err);
      res.status(500).json({ 
        success: false, 
        message: 'Error deleting Project Synopsis', 
        error: err.message 
      });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
      return;
    }
    
    res.json({ 
      success: true, 
      data: { id: req.params.id },
      message: 'Project deleted from SQLite database'
    });
  });
});

// Get Customer Capital Work Details
app.get('/api/customer-capital-work-details', (req, res) => {
  const sql = 'SELECT * FROM Customer_Capital_Work_Details ORDER BY serial_number ASC';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching Customer Capital Work Details:', err);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching Customer Capital Work Details', 
        error: err.message 
      });
      return;
    }
    
    res.json({ 
      success: true, 
      data: rows,
      message: 'Customer Capital Work Details fetched from SQLite database'
    });
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'SQLite server is running',
    database: 'SQLite',
    file: dbPath,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 SQLite Server running on port', PORT);
  console.log('📊 Database: SQLite file at', dbPath);
  console.log('🔗 API Base URL: http://localhost:' + PORT + '/api');
  console.log('🏥 Health Check: http://localhost:' + PORT + '/api/health');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down SQLite server...');
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err.message);
    } else {
      console.log('✅ Database connection closed');
    }
    process.exit(0);
  });
}); 