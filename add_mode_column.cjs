const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('🔧 Adding Mode column to Project_Synopsis table...\n');

const dbPath = path.join(__dirname, 'customer_capital_dashboard.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Check if mode column already exists
  db.get("PRAGMA table_info(Project_Synopsis)", (err, rows) => {
    if (err) {
      console.error('❌ Error checking table structure:', err.message);
      return;
    }
    
    db.all("PRAGMA table_info(Project_Synopsis)", (err, columns) => {
      if (err) {
        console.error('❌ Error getting table info:', err.message);
        return;
      }
      
      const hasModeColumn = columns.some(col => col.name === 'mode');
      
      if (hasModeColumn) {
        console.log('✅ Mode column already exists in Project_Synopsis table');
      } else {
        // Add mode column
        db.run("ALTER TABLE Project_Synopsis ADD COLUMN mode TEXT", (err) => {
          if (err) {
            console.error('❌ Error adding mode column:', err.message);
          } else {
            console.log('✅ Mode column added successfully to Project_Synopsis table');
          }
        });
      }
      
      // Show updated table structure
      db.all("PRAGMA table_info(Project_Synopsis)", (err, columns) => {
        if (err) {
          console.error('❌ Error getting updated table info:', err.message);
        } else {
          console.log('\n📋 Updated Project_Synopsis table structure:');
          columns.forEach(col => {
            console.log(`  - ${col.name}: ${col.type}${col.notnull ? ' NOT NULL' : ''}${col.dflt_value ? ` DEFAULT ${col.dflt_value}` : ''}`);
          });
        }
        
        db.close((err) => {
          if (err) {
            console.error('❌ Error closing database:', err.message);
          } else {
            console.log('\n✅ Database connection closed');
          }
        });
      });
    });
  });
}); 