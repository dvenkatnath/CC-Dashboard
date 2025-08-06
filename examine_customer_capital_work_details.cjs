const XLSX = require('xlsx');

console.log('🔍 Examining Customer Capital Work details.xlsx...\n');

try {
  // Read the Excel file
  const workbook = XLSX.readFile('Customer Capital Work details.xlsx');
  
  console.log(`📊 File: Customer Capital Work details.xlsx`);
  console.log('==================================================');
  console.log(`📋 Sheets: ${workbook.SheetNames.join(', ')}\n`);
  
  // Examine each sheet in detail
  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`📄 Sheet: "${sheetName}"`);
    console.log(`   Rows: ${data.length}`);
    
    if (data.length > 0) {
      // Get headers (first row)
      const headers = data[0];
      console.log(`   Headers: ${headers.join(' | ')}`);
      
      // Show first few data rows
      console.log('   First 5 data rows:');
      for (let i = 1; i <= Math.min(5, data.length - 1); i++) {
        const row = data[i];
        console.log(`   Row ${i}: ${row.join(' | ')}`);
      }
      
      // Show all rows if there are fewer than 10
      if (data.length <= 10) {
        console.log('   All data rows:');
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          console.log(`   Row ${i}: ${row.join(' | ')}`);
        }
      }
    }
    console.log('');
  });
  
} catch (error) {
  console.error('❌ Error reading Excel file:', error.message);
} 