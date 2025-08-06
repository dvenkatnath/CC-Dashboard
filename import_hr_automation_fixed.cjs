const mysql = require('mysql2/promise');
const XLSX = require('xlsx');
const fs = require('fs');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // No password for local development
  database: 'customer_capital_dashboard',
  port: 3306
};

async function importHRAutomationFixed() {
  try {
    console.log('🔄 Starting HR Automation data import from Excel (Fixed)...');
    
    // Create database connection
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');
    
    // Read Excel file
    const excelFile = 'tracker.xlsx';
    if (!fs.existsSync(excelFile)) {
      console.log('❌ Excel file not found. Please place "tracker.xlsx" in the current directory.');
      return;
    }
    
    const workbook = XLSX.readFile(excelFile);
    
    // Find the HR Automation sheet
    const hrSheetName = workbook.SheetNames.find(name => 
      name.toLowerCase().includes('hr automation')
    );
    
    if (!hrSheetName) {
      console.log('❌ HR Automation sheet not found in Excel file.');
      console.log('📋 Available sheets:', workbook.SheetNames);
      return;
    }
    
    const worksheet = workbook.Sheets[hrSheetName];
    
    console.log(`📊 Reading HR Automation sheet: "${hrSheetName}"`);
    
    // Convert to JSON with key-value pairs
    const data = XLSX.utils.sheet_to_json(worksheet, { header: ['description', 'value'] });
    
    if (data.length < 2) {
      console.log('❌ No data found in HR Automation sheet');
      return;
    }
    
    console.log(`📋 Found ${data.length} rows of HR Automation data`);
    
    // Extract data from key-value pairs
    let projectData = {
      project_name: 'HR Automation',
      description: '',
      status: 'development',
      priority: 'medium',
      assigned_to: 'Denesh',
      eta: 'December 1, 2025',
      progress_percentage: 15,
      purpose: '',
      actionable_data: '',
      go_live_date: 'Scheduled for December 1, 2025.',
      contact_points: 'Denesh from Customer Capital; Dr. Venkat from Shepardtri.',
      challenges: 'Integration with multiple HR systems and ensuring accurate candidate screening.',
      notes: 'Currently in development phase with HR team.'
    };
    
    // Parse the key-value data
    data.forEach(row => {
      const description = row.description?.toString().toLowerCase() || '';
      const value = row.value?.toString() || '';
      
      if (description.includes('heading')) {
        // The HR Automation sheet has wrong heading, so we'll use the default
        projectData.project_name = 'HR Automation';
      } else if (description.includes('purpose')) {
        projectData.purpose = value;
        projectData.description = value;
      } else if (description.includes('actionable data')) {
        projectData.actionable_data = value;
      } else if (description.includes('go live')) {
        projectData.go_live_date = value;
      } else if (description.includes('contact')) {
        projectData.contact_points = value;
      } else if (description.includes('challenge')) {
        projectData.challenges = value;
      } else if (description.includes('status')) {
        projectData.notes = value;
      }
    });
    
    console.log('📋 Extracted HR Automation data:', projectData);
    
    // Check if HR Automation already exists
    const [existingData] = await connection.execute(
      "SELECT * FROM Project_Synopsis WHERE project_name LIKE '%HR%' AND project_name LIKE '%Automation%'"
    );
    
    if (existingData.length > 0) {
      // Update existing record
      const [result] = await connection.execute(`
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
      `, [
        projectData.description,
        projectData.purpose,
        projectData.actionable_data,
        projectData.go_live_date,
        projectData.contact_points,
        projectData.challenges,
        projectData.notes,
        existingData[0].id
      ]);
      
      console.log(`✅ Updated existing HR Automation record (ID: ${existingData[0].id})`);
    } else {
      // Insert new record
      const [result] = await connection.execute(`
        INSERT INTO Project_Synopsis (
          project_name, description, status, priority, 
          assigned_to, eta, progress_percentage,
          purpose, actionable_data, go_live_date, 
          contact_points, challenges, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        projectData.project_name,
        projectData.description,
        projectData.status,
        projectData.priority,
        projectData.assigned_to,
        projectData.eta,
        projectData.progress_percentage,
        projectData.purpose,
        projectData.actionable_data,
        projectData.go_live_date,
        projectData.contact_points,
        projectData.challenges,
        projectData.notes
      ]);
      
      console.log(`✅ Inserted new HR Automation record (ID: ${result.insertId})`);
    }
    
    // Show final results
    const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM Project_Synopsis');
    console.log(`\n🎉 HR Automation import completed! Total Project Synopsis records: ${countResult[0].count}`);
    
    // Show HR Automation data
    const [hrData] = await connection.execute("SELECT * FROM Project_Synopsis WHERE project_name LIKE '%HR%' OR project_name LIKE '%Automation%'");
    console.log('\n📋 HR Automation data in database:');
    hrData.forEach((project, index) => {
      console.log(`${index + 1}. ${project.project_name} - ${project.status} - ${project.progress_percentage}%`);
      console.log(`   Purpose: ${project.purpose?.substring(0, 100)}...`);
    });
    
    await connection.end();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ HR Automation import failed:', error);
  }
}

// Run the import
importHRAutomationFixed(); 