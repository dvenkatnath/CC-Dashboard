const XLSX = require('xlsx');
const path = require('path');

console.log('🔍 Showing all possible Status/Mode values from tracker.xlsx...\n');

try {
  const workbook = XLSX.readFile('tracker.xlsx');
  const sheetNames = workbook.SheetNames;
  
  console.log('📊 Status and Mode values for each project:\n');
  
  sheetNames.forEach(sheetName => {
    console.log(`--- ${sheetName} ---`);
    
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    let progress = '';
    let mode = '';
    let status = '';
    let details = '';
    
    if (jsonData.length > 0) {
      jsonData.forEach((row, index) => {
        if (row && row.length >= 2) {
          const description = row[0] ? row[0].toString() : '';
          const value = row[1] ? row[1].toString() : '';
          
          if (description.toLowerCase().includes('progress')) {
            progress = value;
          } else if (description.toLowerCase().includes('mode')) {
            mode = value;
          } else if (description.toLowerCase().includes('status')) {
            status = value;
          } else if (description.toLowerCase().includes('details')) {
            details = value;
          }
        }
      });
      
      console.log(`Progress: ${progress}`);
      console.log(`Mode: "${mode}"`);
      console.log(`Status: "${status}"`);
      console.log(`Details: "${details.substring(0, 100)}..."`);
      console.log('');
    }
  });
  
  console.log('📋 Summary of possible Mode values:');
  console.log('- "UAT " (with trailing space)');
  console.log('- "Development"');
  console.log('- Various status descriptions from Status field');
  console.log('');
  console.log('❓ Please tell me which values should be used for Mode field');
  
} catch (error) {
  console.error('❌ Error reading tracker.xlsx:', error.message);
} 