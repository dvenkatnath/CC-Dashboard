// This script copies the Excel file to force a fresh load
const fs = require('fs');
const path = require('path');

function copyExcelFile() {
  const sourceFile = path.join(__dirname, '..', 'Customer Capital Work Tracker-2.xlsx');
  const targetFile = path.join(__dirname, 'work-tracker-fresh.xlsx');
  
  try {
    fs.copyFileSync(sourceFile, targetFile);
    console.log('Excel file copied successfully');
    return true;
  } catch (error) {
    console.error('Error copying Excel file:', error);
    return false;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { copyExcelFile };
} 