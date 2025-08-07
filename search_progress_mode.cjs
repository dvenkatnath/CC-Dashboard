const XLSX = require('xlsx');
const path = require('path');

console.log('🔍 Searching for Progress and Mode entries in tracker.xlsx...\n');

try {
  const workbook = XLSX.readFile('tracker.xlsx');
  const sheetNames = workbook.SheetNames;
  
  console.log('📋 Searching all sheets for Progress and Mode data...\n');
  
  sheetNames.forEach(sheetName => {
    console.log(`--- ${sheetName} ---`);
    
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    let foundProgress = false;
    let foundMode = false;
    
    if (jsonData.length > 0) {
      jsonData.forEach((row, index) => {
        if (row && row.length >= 2) {
          const description = row[0] ? row[0].toString().toLowerCase() : '';
          const value = row[1] ? row[1].toString() : '';
          
          if (description.includes('progress')) {
            console.log(`✅ Progress found in ${sheetName} at row ${index + 1}:`);
            console.log(`   Description: "${row[0]}"`);
            console.log(`   Value: "${value}"`);
            foundProgress = true;
          }
          
          if (description.includes('mode')) {
            console.log(`✅ Mode found in ${sheetName} at row ${index + 1}:`);
            console.log(`   Description: "${row[0]}"`);
            console.log(`   Value: "${value}"`);
            foundMode = true;
          }
        }
      });
      
      if (!foundProgress) {
        console.log(`❌ No Progress entry found in ${sheetName}`);
      }
      
      if (!foundMode) {
        console.log(`❌ No Mode entry found in ${sheetName}`);
      }
    }
    
    console.log(''); // Empty line for separation
  });
  
  console.log('📊 Summary:');
  console.log('- If Progress and Mode entries are found, we can extract them');
  console.log('- If not found, we need to add them to the Excel file');
  console.log('- The import script will need to be updated to handle these fields');
  
} catch (error) {
  console.error('❌ Error reading tracker.xlsx:', error.message);
} 