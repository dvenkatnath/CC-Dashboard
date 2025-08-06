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

async function importGAInsightsData() {
  try {
    console.log('🔄 Starting GA Insights data import from Excel...');
    
    // Create database connection
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');
    
    // Read Excel file
    const excelFile = 'Tracker.xlsx'; // Update this path to your Excel file
    if (!fs.existsSync(excelFile)) {
      console.log('❌ Excel file not found. Please place "Tracker.xlsx" in the current directory.');
      console.log('📋 Expected file structure:');
      console.log('   - GA Insights tab: GA Insights project data');
      console.log('   - Columns: Project Name, Description, Status, Priority, Assigned To, ETA, Due Date, Progress %, Purpose, Actionable Data, Go Live Date, Contact Points, Challenges, Notes');
      return;
    }
    
    const workbook = XLSX.readFile(excelFile);
    
    // Find the GA Insights sheet
    const gaSheetName = workbook.SheetNames.find(name => 
      name.toLowerCase().includes('ga') || 
      name.toLowerCase().includes('insights') ||
      name.toLowerCase().includes('analytics') ||
      name.toLowerCase().includes('google')
    );
    
    if (!gaSheetName) {
      console.log('❌ GA Insights sheet not found in Excel file.');
      console.log('📋 Available sheets:', workbook.SheetNames);
      console.log('💡 Looking for sheets containing: ga, insights, analytics, or google');
      return;
    }
    
    const worksheet = workbook.Sheets[gaSheetName];
    
    console.log(`📊 Reading GA Insights sheet: "${gaSheetName}"`);
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (data.length < 2) {
      console.log('❌ No data found in GA Insights sheet');
      return;
    }
    
    console.log(`📋 Found ${data.length - 1} rows of GA Insights data`);
    
    // Get headers (first row)
    const headers = data[0];
    console.log('📋 Headers:', headers);
    
    // Process data rows (skip header)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row.length === 0 || !row[0]) continue; // Skip empty rows
      
      try {
        // Map Excel columns to database fields
        const projectData = {
          project_name: row[0] || 'GA Insights',
          description: row[1] || 'Google Analytics insights dashboard for data-driven decision making',
          status: row[2] || 'testing',
          priority: row[3] || 'medium',
          assigned_to: row[4] || '',
          eta: row[5] || '',
          due_date: row[6] ? new Date(row[6]).toISOString().split('T')[0] : null,
          progress_percentage: parseInt(row[7]) || 0,
          purpose: row[8] || 'The GA Insights dashboard provides comprehensive analytics and insights from Google Analytics data to enable data-driven decision making and performance optimization.',
          actionable_data: row[9] || 'Delivers real-time analytics, user behavior insights, conversion tracking, and performance metrics to optimize business strategies and marketing campaigns.',
          go_live_date: row[10] || 'Scheduled for September 1, 2025.',
          contact_points: row[11] || 'Sakthi from Customer Capital; Dr. Venkat from Shepardtri.',
          challenges: row[12] || 'Integration with multiple GA properties and ensuring data accuracy across different time zones and user segments.',
          notes: row[13] || 'Currently in testing phase with beta users.'
        };
        
        // Insert into Project_Synopsis table
        const [result] = await connection.execute(`
          INSERT INTO Project_Synopsis (
            project_name, description, status, priority, 
            assigned_to, eta, due_date, progress_percentage,
            purpose, actionable_data, go_live_date, 
            contact_points, challenges, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          projectData.project_name,
          projectData.description,
          projectData.status,
          projectData.priority,
          projectData.assigned_to,
          projectData.eta,
          projectData.due_date,
          projectData.progress_percentage,
          projectData.purpose,
          projectData.actionable_data,
          projectData.go_live_date,
          projectData.contact_points,
          projectData.challenges,
          projectData.notes
        ]);
        
        console.log(`✅ Imported GA Insights: ${projectData.project_name} (ID: ${result.insertId})`);
        
      } catch (error) {
        console.error(`❌ Error importing GA Insights row ${i + 1}:`, error.message);
      }
    }
    
    // Show final results
    const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM Project_Synopsis');
    console.log(`\n🎉 GA Insights import completed! Total Project Synopsis records: ${countResult[0].count}`);
    
    // Show GA Insights data
    const [gaData] = await connection.execute("SELECT * FROM Project_Synopsis WHERE project_name LIKE '%GA%' OR project_name LIKE '%Insights%' OR project_name LIKE '%Analytics%' ORDER BY created_at DESC");
    console.log('\n📋 GA Insights data in database:');
    gaData.forEach((project, index) => {
      console.log(`${index + 1}. ${project.project_name} - ${project.status} - ${project.progress_percentage}%`);
    });
    
    await connection.end();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ GA Insights import failed:', error);
  }
}

// Run the import
importGAInsightsData(); 