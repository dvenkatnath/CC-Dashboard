const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'customer_capital_dashboard.db');

console.log('🔧 Adding date_updated column to existing Project_Synopsis table...');
console.log(`📁 Database file: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
    return;
  }
  console.log('✅ Connected to SQLite database');
  
  // Add the date_updated column
  const addColumnSQL = 'ALTER TABLE Project_Synopsis ADD COLUMN date_updated TEXT';
  
  db.run(addColumnSQL, (err) => {
    if (err) {
      if (err.message.includes('duplicate column name')) {
        console.log('ℹ️ Column date_updated already exists');
      } else {
        console.error('❌ Error adding column:', err.message);
        return;
      }
    } else {
      console.log('✅ Added date_updated column successfully');
    }
    
    // Update existing records with default date
    const updateSQL = 'UPDATE Project_Synopsis SET date_updated = ? WHERE date_updated IS NULL';
    db.run(updateSQL, ['06/08/2025'], (err) => {
      if (err) {
        console.error('❌ Error updating existing records:', err.message);
      } else {
        console.log('✅ Updated existing records with default date');
      }
      
      // Close database connection
      db.close((err) => {
        if (err) {
          console.error('❌ Error closing database:', err.message);
        } else {
          console.log('✅ Database connection closed');
          console.log('\n🎉 Date Updated column added successfully!');
        }
      });
    });
  });
}); 