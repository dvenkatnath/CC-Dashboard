const mysql = require('mysql2/promise');
const XLSX = require('xlsx');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // No password for local development
  database: 'customer_capital_dashboard',
  port: 3306
};

async function importCustomerCapitalWorkDetails() {
  try {
    console.log('📥 Importing Customer Capital Work Details from Excel to MySQL...');

    // Create database connection
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database');

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
      return;
    }

    // Get headers (first row)
    const headers = data[0];
    console.log(`📋 Headers: ${headers.join(' | ')}`);

    // Clear existing data
    await connection.execute('DELETE FROM Customer_Capital_Work_Details');
    console.log('🗑️ Cleared existing data');

    // Insert new data
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

      const insertSQL = `
        INSERT INTO Customer_Capital_Work_Details (
          serial_number, description, project_type, status, 
          customer_contact, eta, shepardti_owner, proposal_submitted
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

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

      try {
        const [result] = await connection.execute(insertSQL, params);
        insertedCount++;
        console.log(`✅ Inserted: ${description} (ID: ${result.insertId})`);
      } catch (error) {
        console.error(`❌ Error inserting row ${i}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n📊 Import Summary:`);
    console.log(`✅ Successfully inserted: ${insertedCount} records`);
    console.log(`❌ Errors: ${errorCount} records`);
    console.log(`📋 Total processed: ${insertedCount + errorCount} records`);

    // Close database connection
    await connection.end();
    console.log('✅ Database connection closed');
    console.log('\n🎉 Customer Capital Work Details import completed!');

  } catch (error) {
    console.error('❌ Error during import:', error.message);
  }
}

// Run the import
importCustomerCapitalWorkDetails(); 