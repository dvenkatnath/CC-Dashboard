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

async function importRagData() {
  try {
    console.log('🔄 Starting RAG data import from Excel...');
    
    // Create database connection
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');
    
    // Read Excel file
    const excelFile = 'Tracker.xlsx'; // Update this path to your Excel file
    if (!fs.existsSync(excelFile)) {
      console.log('❌ Excel file not found. Please place "Tracker.xlsx" in the current directory.');
      console.log('📋 Expected file structure:');
      console.log('   - RAG tab: RAG project data');
      console.log('   - Columns: Project Name, Description, Status, Priority, Assigned To, ETA, Due Date, Progress %, Purpose, Actionable Data, Go Live Date, Contact Points, Challenges, Notes');
      return;
    }
    
    const workbook = XLSX.readFile(excelFile);
    
    // Find the RAG sheet
    const ragSheetName = workbook.SheetNames.find(name => 
      name.toLowerCase().includes('rag') || 
      name.toLowerCase().includes('retrieval') ||
      name.toLowerCase().includes('generation')
    );
    
    if (!ragSheetName) {
      console.log('❌ RAG sheet not found in Excel file.');
      console.log('📋 Available sheets:', workbook.SheetNames);
      console.log('💡 Looking for sheets containing: rag, retrieval, or generation');
      return;
    }
    
    const worksheet = workbook.Sheets[ragSheetName];
    
    console.log(`📊 Reading RAG sheet: "${ragSheetName}"`);
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (data.length < 2) {
      console.log('❌ No data found in RAG sheet');
      return;
    }
    
    console.log(`📋 Found ${data.length - 1} rows of RAG data`);
    
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
          project_name: row[0] || 'RAG-Service',
          description: row[1] || 'Retrieval Augmented Generation service',
          status: row[2] || 'development',
          priority: row[3] || 'medium',
          assigned_to: row[4] || '',
          eta: row[5] || '',
          due_date: row[6] ? new Date(row[6]).toISOString().split('T')[0] : null,
          progress_percentage: parseInt(row[7]) || 0,
          purpose: row[8] || 'The RAG-Service enables users to upload PDF, Word, text, Excel, or PowerPoint documents and query their content for enhanced information retrieval and analysis.',
          actionable_data: row[9] || 'Provides accurate, context-aware responses to user queries based on document content, facilitating informed decision-making.',
          go_live_date: row[10] || 'Scheduled for Monday, August 11, 2025.',
          contact_points: row[11] || 'Kushal from Customer Capital; Dr. Venkat from Shepardtri.',
          challenges: row[12] || 'Achieves accuracies above 95%, with additional testing required to ensure reliability.',
          notes: row[13] || 'Proposal submitted and pending approval.'
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
        
        console.log(`✅ Imported RAG: ${projectData.project_name} (ID: ${result.insertId})`);
        
      } catch (error) {
        console.error(`❌ Error importing RAG row ${i + 1}:`, error.message);
      }
    }
    
    // Show final results
    const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM Project_Synopsis');
    console.log(`\n🎉 RAG import completed! Total Project Synopsis records: ${countResult[0].count}`);
    
    // Show RAG data
    const [ragData] = await connection.execute("SELECT * FROM Project_Synopsis WHERE project_name LIKE '%RAG%' OR project_name LIKE '%Retrieval%' ORDER BY created_at DESC");
    console.log('\n📋 RAG data in database:');
    ragData.forEach((project, index) => {
      console.log(`${index + 1}. ${project.project_name} - ${project.status} - ${project.progress_percentage}%`);
    });
    
    await connection.end();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ RAG import failed:', error);
  }
}

// Run the import
importRagData(); 