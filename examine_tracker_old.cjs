const XLSX = require('xlsx');
const path = require('path');

console.log('🔍 Examining tracker-old.xlsx structure...\n');

try {
  const workbook = XLSX.readFile('tracker-old.xlsx');
  const sheetNames = workbook.SheetNames;
  
  console.log('📋 Available sheets in tracker-old.xlsx:');
  sheetNames.forEach((sheetName, index) => {
    console.log(`  ${index + 1}. ${sheetName}`);
  });
  
  console.log('\n📊 Examining each sheet for Progress and Mode columns:');
  
  sheetNames.forEach(sheetName => {
    console.log(`\n--- ${sheetName} ---`);
    
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length > 0) {
      const headers = jsonData[0];
      console.log('Headers:', headers);
      
      // Check for Progress and Mode columns
      const progressIndex = headers.findIndex(header => 
        header && header.toString().toLowerCase().includes('progress')
      );
      const modeIndex = headers.findIndex(header => 
        header && header.toString().toLowerCase().includes('mode')
      );
      
      if (progressIndex !== -1) {
        console.log(`✅ Progress column found at index ${progressIndex}: "${headers[progressIndex]}"`);
      } else {
        console.log('❌ Progress column not found');
      }
      
      if (modeIndex !== -1) {
        console.log(`✅ Mode column found at index ${modeIndex}: "${headers[modeIndex]}"`);
      } else {
        console.log('❌ Mode column not found');
      }
      
      // Show first few rows of data
      if (jsonData.length > 1) {
        console.log('\nFirst 3 rows of data:');
        for (let i = 1; i <= Math.min(3, jsonData.length - 1); i++) {
          console.log(`Row ${i}:`, jsonData[i]);
        }
      }
    } else {
      console.log('❌ No data found in sheet');
    }
  });
  
} catch (error) {
  console.error('❌ Error reading tracker-old.xlsx:', error.message);
} 