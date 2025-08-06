const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'customer_capital_dashboard',
  port: 3306
};

async function testPriceGrabUpdates() {
  try {
    console.log('🧪 Testing Price Grab Real-time Updates...\n');
    
    // Create database connection
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');
    
    // Show current data
    console.log('\n📋 Current Price Grab data:');
    const [currentData] = await connection.execute('SELECT project_name, notes, updated_at FROM price_grab WHERE id = 1');
    console.log(`   Project: ${currentData[0].project_name}`);
    console.log(`   Notes: ${currentData[0].notes}`);
    console.log(`   Last Updated: ${currentData[0].updated_at}`);
    
    // Update the data
    const newNote = `Test update at ${new Date().toLocaleTimeString()}`;
    await connection.execute('UPDATE price_grab SET notes = ? WHERE id = 1', [newNote]);
    console.log(`\n🔄 Updated notes to: "${newNote}"`);
    
    // Show updated data
    console.log('\n📋 Updated Price Grab data:');
    const [updatedData] = await connection.execute('SELECT project_name, notes, updated_at FROM price_grab WHERE id = 1');
    console.log(`   Project: ${updatedData[0].project_name}`);
    console.log(`   Notes: ${updatedData[0].notes}`);
    console.log(`   Last Updated: ${updatedData[0].updated_at}`);
    
    await connection.end();
    
    console.log('\n🎯 How to see the changes in your dashboard:');
    console.log('   1. Open your dashboard at http://localhost:5173');
    console.log('   2. Click the Price Grab icon');
    console.log('   3. Click the 🔄 refresh button in the modal');
    console.log('   4. You should see the updated notes!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testPriceGrabUpdates(); 