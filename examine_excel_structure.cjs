const XLSX = require('xlsx');
const fs = require('fs');

function examineExcelStructure() {
  try {
    console.log('🔍 Examining Excel file structure...\n');
    
    // Check all Excel files
    const excelFiles = ['tracker.xlsx', 'Customer Capital Work Tracker-2.xlsx', 'tracker-old.xlsx'];
    
    excelFiles.forEach(fileName => {
      if (fs.existsSync(fileName)) {
        console.log(`📊 File: ${fileName}`);
        console.log('='.repeat(50));
        
        const workbook = XLSX.readFile(fileName);
        console.log(`📋 Sheets: ${workbook.SheetNames.join(', ')}`);
        
        workbook.SheetNames.forEach(sheetName => {
          console.log(`\n📄 Sheet: "${sheetName}"`);
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          console.log(`   Rows: ${data.length}`);
          if (data.length > 0) {
            console.log(`   Headers: ${data[0].join(' | ')}`);
            
            // Show first few data rows
            console.log(`   First 3 data rows:`);
            for (let i = 1; i < Math.min(4, data.length); i++) {
              console.log(`   Row ${i}: ${data[i].join(' | ')}`);
            }
          }
        });
        console.log('\n');
      } else {
        console.log(`❌ File not found: ${fileName}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error examining Excel structure:', error);
  }
}

examineExcelStructure(); 