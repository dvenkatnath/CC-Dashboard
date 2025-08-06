const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'customer_capital_dashboard.db');

console.log('🗄️ Setting up SQLite database...');
console.log(`📁 Database file: ${dbPath}`);

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    return;
  }
  console.log('✅ Connected to SQLite database');
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Create Project_Synopsis table
const createTableSQL = `
CREATE TABLE IF NOT EXISTS Project_Synopsis (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'development' CHECK(status IN ('development', 'testing', 'implemented', 'uat', 'completed', 'on_hold')),
  priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'critical')),
  assigned_to TEXT,
  eta TEXT,
  due_date TEXT,
  start_date TEXT,
  end_date TEXT,
  progress_percentage INTEGER DEFAULT 0,
  budget REAL,
  actual_cost REAL,
  purpose TEXT,
  actionable_data TEXT,
  go_live_date TEXT,
  contact_points TEXT,
  challenges TEXT,
  notes TEXT,
  date_updated TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`;

db.run(createTableSQL, (err) => {
  if (err) {
    console.error('❌ Error creating table:', err.message);
    return;
  }
  console.log('✅ Project_Synopsis table created successfully');
  
  // Create indexes after table is created
  const createIndexesSQL = [
    'CREATE INDEX IF NOT EXISTS idx_project_synopsis_status ON Project_Synopsis(status)',
    'CREATE INDEX IF NOT EXISTS idx_project_synopsis_assigned_to ON Project_Synopsis(assigned_to)',
    'CREATE INDEX IF NOT EXISTS idx_project_synopsis_due_date ON Project_Synopsis(due_date)'
  ];

  let indexesCreated = 0;
  createIndexesSQL.forEach((indexSQL, i) => {
    db.run(indexSQL, (err) => {
      if (err) {
        console.error(`❌ Error creating index ${i + 1}:`, err.message);
        return;
      }
      console.log(`✅ Index ${i + 1} created successfully`);
      indexesCreated++;
      
      // Insert sample data after all indexes are created
      if (indexesCreated === createIndexesSQL.length) {
        insertSampleData();
      }
    });
  });
});

// Function to insert sample data
function insertSampleData() {
const sampleData = [
  {
    project_name: 'Competitive Pricing Analysis',
    description: 'The software aggregates and compares prices from Amazon, Flipkart, Croma, and Reliance to optimize pricing strategies for enhanced marketability.',
    status: 'development',
    priority: 'high',
    assigned_to: 'Nishant',
    eta: 'August 16, 2025',
    progress_percentage: 60,
    purpose: 'The software aggregates and compares prices from Amazon, Flipkart, Croma, and Reliance to optimize pricing strategies for enhanced marketability.',
    actionable_data: 'Provides real-time price comparisons, competitor pricing trends, and demand fluctuations to inform dynamic pricing decisions.',
    go_live_date: 'Scheduled for August 16, 2025.',
    contact_points: 'CC - Nishant Bhagaya / Ganesh; ST - Dr Venkat',
    challenges: 'Overcomes Amazon\'s bot detection algorithms using IP rotation and CAPTCHA-solving techniques to discreetly scrape prices.',
    notes: 'Proposal submitted and pending approval.',
    date_updated: '06/08/2025'
  },
  {
    project_name: 'RAG-Service',
    description: 'The RAG-Service enables users to upload PDF, Word, text, Excel, or PowerPoint documents and query their content for enhanced information retrieval and analysis.',
    status: 'development',
    priority: 'high',
    assigned_to: 'Kushal',
    eta: 'August 11, 2025',
    progress_percentage: 70,
    purpose: 'The RAG-Service enables users to upload PDF, Word, text, Excel, or PowerPoint documents and query their content for enhanced information retrieval and analysis.',
    actionable_data: 'Provides accurate, context-aware responses to user queries based on document content, facilitating informed decision-making.',
    go_live_date: 'Scheduled for Monday, August 11, 2025.',
    contact_points: 'CC - Kushal, CX - Nishit; ST - Dr Venkat',
    challenges: 'Achieves accuracies above 95%, with additional testing required to ensure reliability.',
    notes: 'POC - UAT in progress. ETA - 21st Aug',
    date_updated: '06/08/2025'
  },
  {
    project_name: 'GA Insights',
    description: 'The GA dashboards enables users to visualise the different metrics using the GA4 data and transactional data from databases such as MySql and Postgres.',
    status: 'testing',
    priority: 'medium',
    assigned_to: 'Sakthi',
    eta: 'September 1, 2025',
    progress_percentage: 45,
    purpose: 'The GA dashboards enables users to visualise the different metrics using the GA4 data and transactional data from databases such as MySql and Postgres.',
    actionable_data: 'The dashboard gives an insight into user behaviour, customer segmentation, volume based metrics to track sales and margin across various categories, products.',
    go_live_date: 'Scheduled for September 1, 2025.',
    contact_points: 'CC - Srishti / Uma ; ST - Sakthi / Abhinav',
    challenges: 'Dashboard - HDFC - KPI\'s scoping in progress with CC team. Fynd and Payment reports still under finalization with CC',
    notes: 'Live Dashboards - 1 (Tripstacc), Ready for Go Live - 1 (Shopstacc)',
    date_updated: '06/08/2025'
  },
  {
    project_name: 'Finance Automation',
    description: 'Automate the calculations being done for HDFC using manual excel macros to maintain vendor cost master, MOP and selling margins to assist in sales and margin reporting and revenue tracking (sales/refunds).',
    status: 'development',
    priority: 'high',
    assigned_to: 'Uma',
    eta: 'October 15, 2025',
    progress_percentage: 35,
    purpose: 'Automate the calculations being done for HDFC using manual excel macros to maintain vendor cost master, MOP and selling margins to assist in sales and margin reporting and revenue tracking (sales/refunds).',
    actionable_data: 'Implement automation to capture the various input sources like FYND report, Payment Gateway report, Vendor cost master, Mark up master and provide auto calculations for various reports.',
    go_live_date: 'Scheduled for October 15, 2025.',
    contact_points: 'CC - Manju, Nishant, Ganesh ; ST - Thawpeek / Abhinav',
    challenges: '1. Input report layouts still being finalized for FYND and Payment gateway\n2. Input test data for Payables automation still pending with CC team\n3. Change requests coming in on ad-hoc basis as the system is being tested in UAT',
    notes: 'UAT delivery - 18/Jul/25',
    date_updated: '06/08/2025'
  },
  {
    project_name: 'Data Warehouse',
    description: 'Streamline and consolidate multiple segments and sources of sales and input data for understanding and deriving better sales insights to grow and run business better.',
    status: 'development',
    priority: 'medium',
    assigned_to: 'Abhinav',
    eta: 'November 1, 2025',
    progress_percentage: 20,
    purpose: 'Streamline and consolidate multiple segments and sources of sales and input data for understanding and deriving better sales insights to grow and run business better.',
    actionable_data: 'Setup of pipelines to ingest data from various sources and setup ETL processes to transform the data into a more insight driven format. To assist business to drive more revenue growth.',
    go_live_date: 'Scheduled for November 1, 2025.',
    contact_points: 'CC - Ayesha/Srishti/Uma ; ST - Dr Venkat',
    challenges: 'No Updates received from CC post submission of proposal',
    notes: 'Proposal submitted on 09/Jun/25\nStill under review with CC team till date',
    date_updated: '06/08/2025'
  },
  {
    project_name: 'HR Automation',
    description: 'Provide Agentic support for L1 screening and parsing of resume to help shortlist interview candidates for recruitment.',
    status: 'development',
    priority: 'medium',
    assigned_to: 'Denesh',
    eta: 'December 1, 2025',
    progress_percentage: 15,
    purpose: 'Provide Agentic support for L1 screening and parsing of resume to help shortlist interview candidates for recruitment.',
    actionable_data: 'Agent to provide facility to generate Job Descriptions for various roles and implement a mathematical model to calculate the profile fitment score against the job posting.',
    go_live_date: 'Scheduled for December 1, 2025.',
    contact_points: 'CC - Kunal/Sourabh Kala ; ST - Dr Venkat',
    challenges: '',
    notes: 'Procurement of requisite infra in progress',
    date_updated: '06/08/2025'
  }
];

// Insert sample data
const insertSQL = `
INSERT INTO Project_Synopsis (
  project_name, description, status, priority, assigned_to, eta, 
  progress_percentage, purpose, actionable_data, go_live_date, 
  contact_points, challenges, notes, date_updated
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

sampleData.forEach((project, index) => {
  db.run(insertSQL, [
    project.project_name,
    project.description,
    project.status,
    project.priority,
    project.assigned_to,
    project.eta,
    project.progress_percentage,
    project.purpose,
    project.actionable_data,
    project.go_live_date,
    project.contact_points,
    project.challenges,
    project.notes,
    project.date_updated
  ], function(err) {
    if (err) {
      console.error(`❌ Error inserting project ${index + 1}:`, err.message);
      return;
    }
    console.log(`✅ Inserted project: ${project.project_name} (ID: ${this.lastID})`);
  });
});

  // Close database connection after all data is inserted
  setTimeout(() => {
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err.message);
        return;
      }
      console.log('✅ Database connection closed');
      console.log('\n🎉 SQLite database setup completed!');
      console.log(`📁 Database file: ${dbPath}`);
      console.log('📊 You can now use SQLite instead of MySQL');
    });
  }, 1000);
} 