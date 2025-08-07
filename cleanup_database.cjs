const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('🧹 Cleaning up database - removing duplicates and fixing data...\n');

const dbPath = path.join(__dirname, 'customer_capital_dashboard.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // First, let's see what we have
  console.log('📊 Current data in database:');
  db.all("SELECT id, project_name, progress_percentage, mode FROM Project_Synopsis ORDER BY id", (err, rows) => {
    if (err) {
      console.error('❌ Error querying data:', err.message);
      return;
    }
    
    rows.forEach(row => {
      console.log(`ID ${row.id}: ${row.project_name} - Progress: ${row.progress_percentage}% - Mode: "${row.mode}"`);
    });
    
    console.log('\n🗑️ Removing duplicate and incorrect records...');
    
    // Remove records with wrong project names or duplicates
    const recordsToDelete = [
      // Remove duplicate Datawarehouse records with wrong descriptions
      "DELETE FROM Project_Synopsis WHERE id IN (3, 10, 12)",
      // Remove duplicate CX Agentic Framework records
      "DELETE FROM Project_Synopsis WHERE id IN (8, 11, 15)",
      // Remove the old Competitive Pricing Analysis record (keep Price Grab)
      "DELETE FROM Project_Synopsis WHERE id = 1"
    ];
    
    recordsToDelete.forEach((sql, index) => {
      db.run(sql, function(err) {
        if (err) {
          console.error(`❌ Error deleting record ${index + 1}:`, err.message);
        } else {
          console.log(`✅ Deleted ${this.changes} record(s) with query ${index + 1}`);
        }
      });
    });
    
    // Update the remaining records to ensure they have correct Mode values
    setTimeout(() => {
      console.log('\n🔄 Updating Mode values for remaining records...');
      
      const updates = [
        {
          id: 9,
          project_name: 'Price Grab',
          progress_percentage: 90,
          mode: 'UAT'
        },
        {
          id: 2,
          project_name: 'Datawarehouse',
          progress_percentage: 20,
          mode: 'Development'
        },
        {
          id: 4,
          project_name: 'Finance Automation',
          progress_percentage: 95,
          mode: 'UAT'
        },
        {
          id: 5,
          project_name: 'Retrieval Aumented Service (RAG)',
          progress_percentage: 80,
          mode: 'UAT'
        },
        {
          id: 6,
          project_name: 'GA dashboards',
          progress_percentage: 90,
          mode: 'UAT'
        },
        {
          id: 7,
          project_name: 'CX Agentic Framework',
          progress_percentage: 20,
          mode: 'Development'
        },
        {
          id: 14,
          project_name: 'HR Automation',
          progress_percentage: 30,
          mode: 'Development'
        }
      ];
      
      updates.forEach(update => {
        const sql = `
          UPDATE Project_Synopsis 
          SET progress_percentage = ?, mode = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `;
        
        db.run(sql, [update.progress_percentage, update.mode, update.id], function(err) {
          if (err) {
            console.error(`❌ Error updating ${update.project_name}:`, err.message);
          } else {
            console.log(`✅ Updated ${update.project_name}: Progress ${update.progress_percentage}%, Mode "${update.mode}"`);
          }
        });
      });
      
      // Show final results
      setTimeout(() => {
        console.log('\n📊 Final data after cleanup:');
        db.all("SELECT id, project_name, progress_percentage, mode FROM Project_Synopsis ORDER BY id", (err, rows) => {
          if (err) {
            console.error('❌ Error querying final data:', err.message);
            return;
          }
          
          rows.forEach(row => {
            console.log(`ID ${row.id}: ${row.project_name} - Progress: ${row.progress_percentage}% - Mode: "${row.mode}"`);
          });
          
          console.log(`\n✅ Cleanup completed! ${rows.length} records remaining.`);
          
          db.close((err) => {
            if (err) {
              console.error('❌ Error closing database:', err.message);
            } else {
              console.log('✅ Database connection closed');
            }
          });
        });
      }, 1000);
    }, 1000);
  });
}); 