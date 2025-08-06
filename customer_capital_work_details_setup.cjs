const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'customer_capital_dashboard.db');

console.log('🗄️ Setting up Customer Capital Work Details table...');
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

// Create Customer_Capital_Work_Details table
const createTableSQL = `
CREATE TABLE IF NOT EXISTS Customer_Capital_Work_Details (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  serial_number INTEGER,
  description TEXT NOT NULL,
  project_type TEXT,
  status TEXT,
  customer_contact TEXT,
  eta TEXT,
  shepardti_owner TEXT,
  proposal_submitted TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`;

db.run(createTableSQL, (err) => {
  if (err) {
    console.error('❌ Error creating table:', err.message);
    return;
  }
  console.log('✅ Customer_Capital_Work_Details table created successfully');
});

// Create indexes
const createIndexesSQL = [
  'CREATE INDEX IF NOT EXISTS idx_work_details_status ON Customer_Capital_Work_Details(status)',
  'CREATE INDEX IF NOT EXISTS idx_work_details_project_type ON Customer_Capital_Work_Details(project_type)',
  'CREATE INDEX IF NOT EXISTS idx_work_details_serial_number ON Customer_Capital_Work_Details(serial_number)'
];

createIndexesSQL.forEach((indexSQL, i) => {
  db.run(indexSQL, (err) => {
    if (err) {
      console.error(`❌ Error creating index ${i + 1}:`, err.message);
      return;
    }
    console.log(`✅ Index ${i + 1} created successfully`);
  });
});

// Close database connection after a delay to ensure all operations complete
setTimeout(() => {
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err.message);
      return;
    }
    console.log('✅ Database connection closed');
    console.log('\n🎉 Customer Capital Work Details table setup completed!');
    console.log(`📁 Database file: ${dbPath}`);
    console.log('📊 You can now import data from Customer Capital Work details.xlsx');
  });
}, 2000); 