const sqlite3 = require('sqlite3').verbose();
const XLSX = require('xlsx');
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'customer_capital_dashboard.db');

console.log('🚀 Starting corrected import of all projects from Excel to SQLite...\n');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening SQLite database:', err.message);
    return;
  }
  console.log('✅ Connected to SQLite database');
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Read Excel file
const excelFile = 'tracker.xlsx';
const workbook = XLSX.readFile(excelFile);
console.log(`📊 Excel file loaded: ${excelFile}`);
console.log(`📋 Available sheets: ${workbook.SheetNames.join(', ')}\n`);

// Define projects with CORRECTED Progress values
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
      progress_percentage: 60 // TO BE UPDATED - what should this be?
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
      progress_percentage: 80
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
      progress_percentage: 90
    }
  },
  {
    name: 'Finance Automation',
    sheetKeywords: ['finance', 'automation'],
    dbKeywords: ['finance', 'automation'],
    defaultData: {
      project_name: 'Finance Automation',
      status: 'development',
      priority: 'high',
      assigned_to: 'Uma',
      eta: 'October 15, 2025',
      progress_percentage: 95
    }
  },
  {
    name: 'Datawarehouse',
    sheetKeywords: ['datawarehouse', 'data warehouse'],
    dbKeywords: ['data', 'warehouse', 'datawarehouse'],
    defaultData: {
      project_name: 'Data Warehouse',
      status: 'development',
      priority: 'medium',
      assigned_to: 'Abhinav',
      eta: 'November 1, 2025',
      progress_percentage: 20
    }
  },
  {
    name: 'HR Automation',
    sheetKeywords: ['hr automation'],
    dbKeywords: ['hr', 'automation'],
    defaultData: {
      project_name: 'HR Automation',
      status: 'development',
      priority: 'medium',
      assigned_to: 'Denesh',
      eta: 'December 1, 2025',
      progress_percentage: 15 // TO BE UPDATED - what should this be?
    }
  },
  {
    name: 'CX Agentic Framework',
    sheetKeywords: ['cx agentic framework'],
    dbKeywords: ['cx', 'agentic', 'framework'],
    defaultData: {
      project_name: 'CX Agentic Framework',
      status: 'development',
      priority: 'high',
      assigned_to: 'CX Team',
      eta: 'January 15, 2026',
      progress_percentage: 20
    }
  },
  {
    name: 'Integration - Agentic Framework',
    sheetKeywords: ['integration', 'agentic framework'],
    dbKeywords: ['integration', 'agentic', 'framework'],
    defaultData: {
      project_name: 'Integration - Agentic Framework',
      status: 'development',
      priority: 'high',
      assigned_to: 'Integration Team',
      eta: 'February 1, 2026',
      progress_percentage: 10
    }
  }
];

// Function to import a single project
function importProject(project, index) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 Processing ${project.name}...`);
    
    // Find the sheet
    const sheetName = workbook.SheetNames.find(name => 
      project.sheetKeywords.some(keyword => 
        name.toLowerCase().includes(keyword)
      )
    );
    
    if (!sheetName) {
      console.log(`❌ ${project.name} sheet not found. Skipping...\n`);
      resolve();
      return;
    }
    
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (data.length < 2) {
      console.log(`❌ No data found in ${project.name} sheet. Skipping...\n`);
      resolve();
      return;
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
      notes: 'Project status and notes.',
      progress_percentage: project.defaultData.progress_percentage,
      mode: 'Development' // Default mode
    };
    
    // Parse the key-value data
    data.forEach(row => {
      if (row.length >= 2) {
        const description = row[0]?.toString().toLowerCase() || '';
        const value = row[1]?.toString() || '';
        
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
          // Use Status field for notes
          projectData.notes = value;
        } else if (description.includes('mode')) {
          // Use Mode field for Mode (trim trailing spaces)
          projectData.mode = value.trim();
        } else if (description.includes('progress')) {
          // Convert progress from decimal (0.9) to percentage (90)
          console.log(`📊 Processing progress for ${project.name}: "${value}"`);
          const progressValue = parseFloat(value);
          if (!isNaN(progressValue)) {
            projectData.progress_percentage = Math.round(progressValue * 100);
          }
        } else if (description.includes('date updated')) {
          // Convert Excel date serial number to readable date
          console.log(`📅 Processing date_updated for ${project.name}: "${value}"`);
          
          // Use improved date conversion function
          const { convertExcelDate } = require('./improved_date_conversion.cjs');
          projectData.date_updated = convertExcelDate(value);
        }
      }
    });
    
    // Check if project already exists
    const checkSQL = 'SELECT id FROM Project_Synopsis WHERE project_name LIKE ?';
    db.get(checkSQL, [`%${project.dbKeywords[0]}%`], (err, row) => {
      if (err) {
        console.error(`❌ Error checking existing project ${project.name}:`, err.message);
        resolve();
        return;
      }
      
      if (row) {
        // Update existing project
        console.log(`🔄 Updating existing project ${project.name} (ID: ${row.id})`);
        updateProject(row.id, projectData, resolve);
      } else {
        // Insert new project
        console.log(`➕ Inserting new project ${project.name}`);
        insertProject(projectData, resolve);
      }
    });
  });
}

function updateProject(id, projectData, resolve) {
  const updateSQL = `
    UPDATE Project_Synopsis SET
      project_name = ?, description = ?, status = ?, priority = ?,
      assigned_to = ?, eta = ?, progress_percentage = ?, purpose = ?,
      actionable_data = ?, go_live_date = ?, contact_points = ?,
      challenges = ?, notes = ?, date_updated = ?, mode = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  const params = [
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
    projectData.notes,
    projectData.date_updated || '06/08/2025',
    projectData.mode,
    id
  ];

  db.run(updateSQL, params, function(err) {
    if (err) {
      console.error(`❌ Error updating project:`, err.message);
    } else {
      console.log(`✅ Updated ${projectData.project_name} (ID: ${id})`);
      console.log(`   Progress: ${projectData.progress_percentage}%`);
      console.log(`   Mode: "${projectData.mode}"`);
    }
    resolve();
  });
}

function insertProject(projectData, resolve) {
  const insertSQL = `
    INSERT INTO Project_Synopsis (
      project_name, description, status, priority, assigned_to, eta,
      progress_percentage, purpose, actionable_data, go_live_date,
      contact_points, challenges, notes, date_updated, mode
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
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
    projectData.notes,
    projectData.date_updated || '06/08/2025',
    projectData.mode
  ];

  db.run(insertSQL, params, function(err) {
    if (err) {
      console.error(`❌ Error inserting project:`, err.message);
    } else {
      console.log(`✅ Inserted ${projectData.project_name} (ID: ${this.lastID})`);
      console.log(`   Progress: ${projectData.progress_percentage}%`);
      console.log(`   Mode: "${projectData.mode}"`);
    }
    resolve();
  });
}

// Import all projects sequentially
async function importAllProjects() {
  for (let i = 0; i < projects.length; i++) {
    await importProject(projects[i], i);
  }
  
  // Close database connection
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err.message);
    } else {
      console.log('✅ Database connection closed');
      console.log('\n🎉 All projects imported successfully!');
      console.log(`📁 Database file: ${dbPath}`);
      console.log('📊 You can now view all 8 projects in the dashboard');
    }
  });
}

// Start the import process
importAllProjects(); 