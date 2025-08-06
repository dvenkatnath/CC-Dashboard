const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // No password for local development
  database: 'customer_capital_dashboard',
  port: 3306
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT 1 as test');
    res.json({ success: true, message: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ success: false, message: 'Database connection failed', error: error.message });
  }
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        p.*,
        pd.purpose,
        pd.actionable_data,
        pd.go_live_date,
        pd.contact_points,
        pd.challenges,
        pd.notes
      FROM projects p
      LEFT JOIN project_details pd ON p.id = pd.project_id
      ORDER BY p.created_at DESC
    `);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, message: 'Error fetching projects', error: error.message });
  }
});

// Get project by ID
app.get('/api/projects/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        p.*,
        pd.purpose,
        pd.actionable_data,
        pd.go_live_date,
        pd.contact_points,
        pd.challenges,
        pd.notes
      FROM projects p
      LEFT JOIN project_details pd ON p.id = pd.project_id
      WHERE p.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ success: false, message: 'Error fetching project', error: error.message });
  }
});

// Create new project
app.post('/api/projects', async (req, res) => {
  try {
    const projectData = req.body;
    const [result] = await pool.execute(`
      INSERT INTO projects (
        project_name, description, status, priority, 
        assigned_to, eta, due_date, start_date, end_date, 
        progress_percentage, budget, actual_cost
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      projectData.project_name,
      projectData.description,
      projectData.status || 'development',
      projectData.priority || 'medium',
      projectData.assigned_to,
      projectData.eta,
      projectData.due_date,
      projectData.start_date,
      projectData.end_date,
      projectData.progress_percentage || 0,
      projectData.budget,
      projectData.actual_cost
    ]);
    
    res.json({ success: true, data: { id: result.insertId }, message: 'Project created successfully' });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, message: 'Error creating project', error: error.message });
  }
});

// Update project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const projectData = req.body;
    const [result] = await pool.execute(`
      UPDATE projects SET
        project_name = ?,
        description = ?,
        status = ?,
        priority = ?,
        assigned_to = ?,
        eta = ?,
        due_date = ?,
        start_date = ?,
        end_date = ?,
        progress_percentage = ?,
        budget = ?,
        actual_cost = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      projectData.project_name,
      projectData.description,
      projectData.status,
      projectData.priority,
      projectData.assigned_to,
      projectData.eta,
      projectData.due_date,
      projectData.start_date,
      projectData.end_date,
      projectData.progress_percentage,
      projectData.budget,
      projectData.actual_cost,
      req.params.id
    ]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    res.json({ success: true, message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ success: false, message: 'Error updating project', error: error.message });
  }
});

// Delete project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const [result] = await pool.execute(`
      DELETE FROM projects WHERE id = ?
    `, [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, message: 'Error deleting project', error: error.message });
  }
});

// Get project statistics
app.get('/api/stats', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        COUNT(*) as total_projects,
        COUNT(CASE WHEN status = 'development' THEN 1 END) as development_count,
        COUNT(CASE WHEN status = 'testing' THEN 1 END) as testing_count,
        COUNT(CASE WHEN status = 'implemented' THEN 1 END) as implemented_count,
        COUNT(CASE WHEN status = 'uat' THEN 1 END) as uat_count,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
        AVG(progress_percentage) as avg_progress
      FROM projects
    `);
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching project stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching project stats', error: error.message });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM users 
      WHERE is_active = 1
      ORDER BY full_name
    `);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
  }
});

// Get Project Synopsis data
app.get('/api/project-synopsis', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM Project_Synopsis 
      ORDER BY created_at DESC
    `);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching Project Synopsis data:', error);
    res.status(500).json({ success: false, message: 'Error fetching Project Synopsis data', error: error.message });
  }
});

// Get Project Synopsis by ID
app.get('/api/project-synopsis/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM Project_Synopsis 
      WHERE id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Project Synopsis not found' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching Project Synopsis:', error);
    res.status(500).json({ success: false, message: 'Error fetching Project Synopsis', error: error.message });
  }
});

// Get Customer Capital Work Details
app.get('/api/customer-capital-work-details', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM Customer_Capital_Work_Details 
      ORDER BY serial_number ASC
    `);
    
    res.json({ 
      success: true, 
      data: rows,
      message: 'Customer Capital Work Details fetched from MySQL database'
    });
  } catch (error) {
    console.error('Error fetching Customer Capital Work Details:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching Customer Capital Work Details', 
      error: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'MySQL server is running',
    database: 'MySQL',
    host: dbConfig.host,
    port: dbConfig.port,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

module.exports = app; 