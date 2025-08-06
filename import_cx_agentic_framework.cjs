const XLSX = require('xlsx');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'customer_capital_dashboard.db');

console.log('📥 Importing CX Agentic Framework data from Tracker.xlsx...');

// Read the Excel file
const workbook = XLSX.readFile('tracker.xlsx');

// Find the CX Agentic Framework sheet
let cxSheet = null;
for (const sheetName of workbook.SheetNames) {
  if (sheetName.toLowerCase().includes('cx agentic framework')) {
    cxSheet = workbook.Sheets[sheetName];
    console.log(`✅ Found sheet: ${sheetName}`);
    break;
  }
}

if (!cxSheet) {
  console.error('❌ CX Agentic Framework sheet not found in tracker.xlsx');
  process.exit(1);
}

// Convert sheet to JSON
const data = XLSX.utils.sheet_to_json(cxSheet, { header: 1 });

// Parse the key-value pairs
const projectData = {};
data.forEach(row => {
  if (row.length >= 2) {
    const key = row[0]?.toString().trim();
    const value = row[1]?.toString().trim();
    
    if (key && value) {
      projectData[key] = value;
    }
  }
});

console.log('📊 Parsed data:', projectData);

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    return;
  }
  console.log('✅ Connected to SQLite database');
});

// Check if project already exists
const checkSQL = 'SELECT id FROM Project_Synopsis WHERE project_name LIKE ?';
db.get(checkSQL, ['%CX Agentic Framework%'], (err, row) => {
  if (err) {
    console.error('❌ Error checking existing project:', err.message);
    db.close();
    return;
  }

  if (row) {
    // Update existing project
    console.log(`🔄 Updating existing project (ID: ${row.id})`);
    updateProject(row.id);
  } else {
    // Insert new project
    console.log('➕ Inserting new project');
    insertProject();
  }
});

function updateProject(id) {
  const updateSQL = `
    UPDATE Project_Synopsis SET
      description = ?,
      purpose = ?,
      actionable_data = ?,
      go_live_date = ?,
      contact_points = ?,
      challenges = ?,
      notes = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  const params = [
    projectData['Purpose'] || 'Boost productivity for CX Agents on ground by having customer CRM data accessible easily and faster',
    projectData['Purpose'] || 'Boost productivity for CX Agents on ground by having customer CRM data accessible easily and faster',
    projectData['Actionable Data'] || 'Provide an integrated UI to the CX Agent on ground to simplify the way to identify the originating customer and retrieve their respective transactional data without searching across multiple portals',
    projectData['Go Live Date'] || 'Scheduled for January 15, 2026.',
    projectData['Contact Points'] || 'CC - CX Team; ST - Dr Venkat',
    projectData['Challenges'] || 'Integration with multiple CRM systems and ensuring data accuracy across different platforms.',
    projectData['Notes'] || 'Currently in development phase with CX team.',
    id
  ];

  db.run(updateSQL, params, function(err) {
    if (err) {
      console.error('❌ Error updating project:', err.message);
    } else {
      console.log(`✅ Updated CX Agentic Framework project (ID: ${id})`);
    }
    db.close();
  });
}

function insertProject() {
  const insertSQL = `
    INSERT INTO Project_Synopsis (
      project_name, description, status, priority, assigned_to, eta,
      progress_percentage, purpose, actionable_data, go_live_date,
      contact_points, challenges, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    'CX Agentic Framework',
    projectData['Purpose'] || 'Boost productivity for CX Agents on ground by having customer CRM data accessible easily and faster',
    'development',
    'high',
    'CX Team',
    'January 15, 2026',
    25,
    projectData['Purpose'] || 'Boost productivity for CX Agents on ground by having customer CRM data accessible easily and faster',
    projectData['Actionable Data'] || 'Provide an integrated UI to the CX Agent on ground to simplify the way to identify the originating customer and retrieve their respective transactional data without searching across multiple portals',
    projectData['Go Live Date'] || 'Scheduled for January 15, 2026.',
    projectData['Contact Points'] || 'CC - CX Team; ST - Dr Venkat',
    projectData['Challenges'] || 'Integration with multiple CRM systems and ensuring data accuracy across different platforms.',
    projectData['Notes'] || 'Currently in development phase with CX team.'
  ];

  db.run(insertSQL, params, function(err) {
    if (err) {
      console.error('❌ Error inserting project:', err.message);
    } else {
      console.log(`✅ Inserted CX Agentic Framework project (ID: ${this.lastID})`);
    }
    db.close();
  });
} 