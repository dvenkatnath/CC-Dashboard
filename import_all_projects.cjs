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

async function importAllProjects() {
  try {
    console.log('🚀 Starting import of all projects from Excel...\n');
    
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
    console.log(`📊 Excel file loaded: ${excelFile}`);
    console.log(`📋 Available sheets: ${workbook.SheetNames.join(', ')}\n`);
    
    // Define projects to import
    const projects = [
      {
        name: 'Price Grab',
        sheetKeywords: ['price', 'grab'],
        dbKeywords: ['price', 'pricing', 'competitive'],
        defaultData: {
          project_name: 'Competitive Pricing Analysis',
          status: 'development',
          priority: 'high',
          assigned_to: 'Nishant',
          eta: 'August 16, 2025',
          progress_percentage: 60
        }
      },
      {
        name: 'RAG',
        sheetKeywords: ['rag'],
        dbKeywords: ['rag', 'retrieval', 'generation'],
        defaultData: {
          project_name: 'RAG-Service',
          status: 'development',
          priority: 'high',
          assigned_to: 'Kushal',
          eta: 'August 11, 2025',
          progress_percentage: 70
        }
      },
      {
        name: 'GA Insights',
        sheetKeywords: ['ga', 'insights'],
        dbKeywords: ['ga', 'insights', 'analytics'],
        defaultData: {
          project_name: 'GA Insights',
          status: 'testing',
          priority: 'medium',
          assigned_to: 'Sakthi',
          eta: 'September 1, 2025',
          progress_percentage: 45
        }
      }
    ];
    
    // Import each project
    for (const project of projects) {
      console.log(`🔄 Processing ${project.name}...`);
      
      // Find the sheet
      const sheetName = workbook.SheetNames.find(name => 
        project.sheetKeywords.some(keyword => 
          name.toLowerCase().includes(keyword)
        )
      );
      
      if (!sheetName) {
        console.log(`❌ ${project.name} sheet not found. Skipping...\n`);
        continue;
      }
      
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: ['description', 'value'] });
      
      if (data.length < 2) {
        console.log(`❌ No data found in ${project.name} sheet. Skipping...\n`);
        continue;
      }
      
      // Extract data from key-value pairs
      let projectData = {
        ...project.defaultData,
        description: '',
        purpose: '',
        actionable_data: '',
        go_live_date: `Scheduled for ${project.defaultData.eta}.`,
        contact_points: `${project.defaultData.assigned_to} from Customer Capital; Dr. Venkat from Shepardtri.`,
        challenges: 'Project challenges and technical requirements.',
        notes: 'Project status and notes.'
      };
      
      // Parse the key-value data
      data.forEach(row => {
        const description = row.description?.toString().toLowerCase() || '';
        const value = row.value?.toString() || '';
        
        if (description.includes('heading')) {
          projectData.project_name = value || project.defaultData.project_name;
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
      
      // Check if project already exists
      const [existingData] = await connection.execute(
        `SELECT * FROM Project_Synopsis WHERE ${project.dbKeywords.map(keyword => 
          `project_name LIKE '%${keyword}%'`
        ).join(' OR ')}`
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
        
        console.log(`✅ Updated existing ${project.name} record (ID: ${existingData[0].id})`);
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
        
        console.log(`✅ Inserted new ${project.name} record (ID: ${result.insertId})`);
      }
      
      console.log(`📋 ${project.name} data: ${projectData.project_name} - ${projectData.status} - ${projectData.progress_percentage}%\n`);
    }
    
    // Show final results
    const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM Project_Synopsis');
    console.log(`🎉 All projects import completed! Total Project Synopsis records: ${countResult[0].count}`);
    
    // Show all projects
    const [allProjects] = await connection.execute("SELECT * FROM Project_Synopsis ORDER BY id");
    console.log('\n📋 All projects in database:');
    allProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.project_name} - ${project.status} - ${project.progress_percentage}%`);
      console.log(`   Purpose: ${project.purpose?.substring(0, 80)}...`);
    });
    
    await connection.end();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

// Run the import
importAllProjects(); 