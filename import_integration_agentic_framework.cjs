const XLSX = require('xlsx');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'customer_capital_dashboard.db');

console.log('📥 Importing Integration - Agentic Framework data from Tracker.xlsx...');

// Read the Excel file
const workbook = XLSX.readFile('tracker.xlsx');

// Find the Integration - Agentic Framework sheet
let integrationSheet = null;
for (const sheetName of workbook.SheetNames) {
  if (sheetName.toLowerCase().includes('integration') && sheetName.toLowerCase().includes('agentic framework')) {
    integrationSheet = workbook.Sheets[sheetName];
    console.log(`✅ Found sheet: ${sheetName}`);
    break;
  }
}

if (!integrationSheet) {
  console.error('❌ Integration - Agentic Framework sheet not found in tracker.xlsx');
  process.exit(1);
}

// Convert sheet to JSON
const data = XLSX.utils.sheet_to_json(integrationSheet, { header: 1 });

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
db.get(checkSQL, ['%Integration%Agentic%Framework%'], (err, row) => {
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
    projectData['Purpose'] || 'Sync ticket information across bank SFDC platform and V-Tiger CRM',
    projectData['Purpose'] || 'Sync ticket information across bank SFDC platform and V-Tiger CRM',
    projectData['Actionable Data'] || 'Provide a way for the CX agent to reconcile and monitor the daily ticket and update summary with bank',
    projectData['Go Live Date'] || 'Scheduled for February 1, 2026.',
    projectData['Contact Points'] || 'CC - Integration Team; ST - Dr Venkat',
    projectData['Challenges'] || 'Integration with multiple CRM platforms and ensuring data synchronization accuracy.',
    projectData['Notes'] || 'Currently in development phase with integration team.',
    id
  ];

  db.run(updateSQL, params, function(err) {
    if (err) {
      console.error('❌ Error updating project:', err.message);
    } else {
      console.log(`✅ Updated Integration - Agentic Framework project (ID: ${id})`);
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
    'Integration - Agentic Framework',
    projectData['Purpose'] || 'Sync ticket information across bank SFDC platform and V-Tiger CRM',
    'development',
    'high',
    'Integration Team',
    'February 1, 2026',
    20,
    projectData['Purpose'] || 'Sync ticket information across bank SFDC platform and V-Tiger CRM',
    projectData['Actionable Data'] || 'Provide a way for the CX agent to reconcile and monitor the daily ticket and update summary with bank',
    projectData['Go Live Date'] || 'Scheduled for February 1, 2026.',
    projectData['Contact Points'] || 'CC - Integration Team; ST - Dr Venkat',
    projectData['Challenges'] || 'Integration with multiple CRM platforms and ensuring data synchronization accuracy.',
    projectData['Notes'] || 'Currently in development phase with integration team.'
  ];

  db.run(insertSQL, params, function(err) {
    if (err) {
      console.error('❌ Error inserting project:', err.message);
    } else {
      console.log(`✅ Inserted Integration - Agentic Framework project (ID: ${this.lastID})`);
    }
    db.close();
  });
} 