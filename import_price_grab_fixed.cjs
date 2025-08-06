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

async function importPriceGrabFixed() {
  try {
    console.log('🔄 Starting Price Grab data import from Excel (Fixed)...');
    
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
    
    // Find the Price Grab sheet
    const priceGrabSheetName = workbook.SheetNames.find(name => 
      name.toLowerCase().includes('price') || 
      name.toLowerCase().includes('grab')
    );
    
    if (!priceGrabSheetName) {
      console.log('❌ Price Grab sheet not found in Excel file.');
      console.log('📋 Available sheets:', workbook.SheetNames);
      return;
    }
    
    const worksheet = workbook.Sheets[priceGrabSheetName];
    
    console.log(`📊 Reading Price Grab sheet: "${priceGrabSheetName}"`);
    
    // Convert to JSON with key-value pairs
    const data = XLSX.utils.sheet_to_json(worksheet, { header: ['description', 'value'] });
    
    if (data.length < 2) {
      console.log('❌ No data found in Price Grab sheet');
      return;
    }
    
    console.log(`📋 Found ${data.length} rows of Price Grab data`);
    
    // Extract data from key-value pairs
    let projectData = {
      project_name: 'Competitive Pricing Analysis',
      description: '',
      status: 'development',
      priority: 'high',
      assigned_to: 'Nishant',
      eta: 'August 16, 2025',
      progress_percentage: 60,
      purpose: '',
      actionable_data: '',
      go_live_date: 'Scheduled for August 16, 2025.',
      contact_points: 'Nishant or Ganesh from Customer Capital; Dr. Venkat, Owner from Shepardtri.',
      challenges: 'Overcomes Amazon\'s bot detection algorithms using IP rotation and CAPTCHA-solving techniques to discreetly scrape prices.',
      notes: 'Proposal submitted and pending approval.'
    };
    
    // Parse the key-value data
    data.forEach(row => {
      const description = row.description?.toString().toLowerCase() || '';
      const value = row.value?.toString() || '';
      
      if (description.includes('heading')) {
        projectData.project_name = value || 'Competitive Pricing Analysis';
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
    
    console.log('📋 Extracted Price Grab data:', projectData);
    
    // Check if Price Grab already exists
    const [existingData] = await connection.execute(
      "SELECT * FROM Project_Synopsis WHERE project_name LIKE '%Price%' OR project_name LIKE '%Pricing%' OR project_name LIKE '%Competitive%'"
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
      
      console.log(`✅ Updated existing Price Grab record (ID: ${existingData[0].id})`);
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
      
      console.log(`✅ Inserted new Price Grab record (ID: ${result.insertId})`);
    }
    
    // Show final results
    const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM Project_Synopsis');
    console.log(`\n🎉 Price Grab import completed! Total Project Synopsis records: ${countResult[0].count}`);
    
    // Show Price Grab data
    const [priceGrabData] = await connection.execute("SELECT * FROM Project_Synopsis WHERE project_name LIKE '%Price%' OR project_name LIKE '%Pricing%' OR project_name LIKE '%Competitive%'");
    console.log('\n📋 Price Grab data in database:');
    priceGrabData.forEach((project, index) => {
      console.log(`${index + 1}. ${project.project_name} - ${project.status} - ${project.progress_percentage}%`);
      console.log(`   Purpose: ${project.purpose?.substring(0, 100)}...`);
    });
    
    await connection.end();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Price Grab import failed:', error);
  }
}

// Run the import
importPriceGrabFixed(); 