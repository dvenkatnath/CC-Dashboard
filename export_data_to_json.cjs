const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database file path
const dbPath = path.join(__dirname, 'customer_capital_dashboard.db');

console.log('📤 Exporting database data to JSON files...');

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    return;
  }
  console.log('✅ Connected to SQLite database');
  
  // Export project synopsis data
  exportProjectSynopsis();
});

function exportProjectSynopsis() {
  const query = 'SELECT * FROM Project_Synopsis ORDER BY id';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('❌ Error exporting project synopsis:', err.message);
      return;
    }
    
    const data = {
      success: true,
      data: rows,
      timestamp: new Date().toISOString(),
      total: rows.length
    };
    
    const filePath = path.join(__dirname, 'public', 'project-synopsis.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Exported ${rows.length} project synopsis records to public/project-synopsis.json`);
    
    // Export customer capital work details
    exportCustomerCapitalWorkDetails();
  });
}

function exportCustomerCapitalWorkDetails() {
  const query = 'SELECT * FROM Customer_Capital_Work_Details ORDER BY serial_number';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('❌ Error exporting customer capital work details:', err.message);
      return;
    }
    
    const data = {
      success: true,
      data: rows,
      timestamp: new Date().toISOString(),
      total: rows.length
    };
    
    const filePath = path.join(__dirname, 'public', 'customer-capital-work-details.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Exported ${rows.length} work details records to public/customer-capital-work-details.json`);
    
    // Close database connection
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err.message);
      } else {
        console.log('✅ Database connection closed');
        console.log('\n🎉 Data export completed!');
        console.log('📁 Files created:');
        console.log('   - public/project-synopsis.json');
        console.log('   - public/customer-capital-work-details.json');
        console.log('\n📋 Next steps:');
        console.log('   1. Update frontend to use static JSON files');
        console.log('   2. Rebuild and redeploy to Netlify');
        console.log('   3. Share the Netlify URL - it will work for everyone!');
      }
    });
  });
} 