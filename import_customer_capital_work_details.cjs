const XLSX = require('xlsx');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'customer_capital_dashboard.db');

console.log('📥 Importing Customer Capital Work Details from Excel...');

// Read the Excel file
const workbook = XLSX.readFile('Customer Capital Work details.xlsx');

// Get the first sheet (Sheet1)
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

console.log(`✅ Found sheet: ${sheetName}`);

// Convert sheet to JSON with headers
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log(`📊 Total rows: ${data.length}`);

if (data.length < 2) {
  console.error('❌ No data found in Excel file');
  process.exit(1);
}

// Get headers (first row)
const headers = data[0];
console.log(`📋 Headers: ${headers.join(' | ')}`);

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    return;
  }
  console.log('✅ Connected to SQLite database');
});

// Clear existing data
db.run('DELETE FROM Customer_Capital_Work_Details', (err) => {
  if (err) {
    console.error('❌ Error clearing existing data:', err.message);
    return;
  }
  console.log('🗑️ Cleared existing data');
  
  // Insert new data
  insertData();
});

function insertData() {
  const insertSQL = `
    INSERT INTO Customer_Capital_Work_Details (
      serial_number, description, project_type, status, 
      customer_contact, eta, shepardti_owner, proposal_submitted
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  let insertedCount = 0;
  let errorCount = 0;

  // Process data rows (skip header row)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    // Skip empty rows
    if (!row || row.length === 0 || !row[0]) {
      continue;
    }

    // Map Excel columns to database fields
    const serialNumber = parseInt(row[0]) || null;
    const description = row[1] || '';
    const projectType = row[2] || '';
    const status = row[3] || '';
    const customerContact = row[4] || '';
    
    // Convert ETA using improved date conversion function
    const { convertExcelDate } = require('./improved_date_conversion.cjs');
    const eta = convertExcelDate(row[5] || '');
    
    const shepardtiOwner = row[6] || '';
    const proposalSubmitted = row[7] || '';

    // Skip if no description
    if (!description.trim()) {
      continue;
    }

    const params = [
      serialNumber,
      description,
      projectType,
      status,
      customerContact,
      eta,
      shepardtiOwner,
      proposalSubmitted
    ];

    db.run(insertSQL, params, function(err) {
      if (err) {
        console.error(`❌ Error inserting row ${i}:`, err.message);
        errorCount++;
      } else {
        insertedCount++;
        console.log(`✅ Inserted: ${description} (ID: ${this.lastID})`);
      }

      // Check if all rows have been processed
      if (insertedCount + errorCount === data.length - 1) {
        console.log(`\n📊 Import Summary:`);
        console.log(`✅ Successfully inserted: ${insertedCount} records`);
        console.log(`❌ Errors: ${errorCount} records`);
        console.log(`📋 Total processed: ${insertedCount + errorCount} records`);
        
        // Close database connection
        db.close((err) => {
          if (err) {
            console.error('❌ Error closing database:', err.message);
          } else {
            console.log('✅ Database connection closed');
            console.log('\n🎉 Customer Capital Work Details import completed!');
          }
        });
      }
    });
  }
} 