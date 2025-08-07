const XLSX = require('xlsx');
const path = require('path');

console.log('🔍 Examining ALL data in tracker.xlsx to find correct Mode values...\n');

try {
  const workbook = XLSX.readFile('tracker.xlsx');
  const sheetNames = workbook.SheetNames;
  
  console.log('📋 Available sheets in tracker.xlsx:');
  sheetNames.forEach((sheetName, index) => {
    console.log(`  ${index + 1}. ${sheetName}`);
  });
  
  console.log('\n📊 Examining each sheet for ALL data...\n');
  
  sheetNames.forEach(sheetName => {
    console.log(`--- ${sheetName} ---`);
    
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length > 0) {
      console.log('All rows in this sheet:');
      jsonData.forEach((row, index) => {
        if (row && row.length >= 2) {
          const description = row[0] ? row[0].toString() : '';
          const value = row[1] ? row[1].toString() : '';
          
          // Highlight Progress and Mode entries
          if (description.toLowerCase().includes('progress') || description.toLowerCase().includes('mode')) {
            console.log(`  Row ${index + 1}: "${description}" = "${value}" ⭐`);
          } else {
            console.log(`  Row ${index + 1}: "${description}" = "${value}"`);
          }
        }
      });
    }
    
    console.log(''); // Empty line for separation
  });
  
  console.log('📊 Summary:');
  console.log('- Check if there are different Mode values or if the current ones are correct');
  console.log('- Verify Progress values for Price Grab and HR Automation');
  
} catch (error) {
  console.error('❌ Error reading tracker.xlsx:', error.message);
} 