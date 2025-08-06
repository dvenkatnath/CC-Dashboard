const XLSX = require('xlsx');

// Improved Excel date conversion function
function convertExcelDate(value) {
  console.log(`🔄 Converting date value: "${value}"`);
  
  // If value is null, undefined, or empty
  if (!value || value.toString().trim() === '') {
    console.log('⚠️ Empty date value, using default');
    return '06/08/2025';
  }
  
  const strValue = value.toString().trim();
  
  // Handle special text values that should remain as-is
  const specialValues = ['NA', 'N/A', 'na', 'n/a', 'TBD', 'tbd', 'TBA', 'tba'];
  if (specialValues.includes(strValue.toUpperCase())) {
    console.log(`ℹ️ Special value preserved: "${strValue}"`);
    return strValue;
  }
  
  // Check if it's already a formatted date (DD/MM/YYYY or MM/DD/YYYY)
  const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  if (dateRegex.test(strValue)) {
    console.log(`✅ Already formatted date: ${strValue}`);
    return strValue;
  }
  
  // Check if it's an ISO date format (YYYY-MM-DD)
  const isoDateRegex = /^\d{4}-\d{1,2}-\d{1,2}$/;
  if (isoDateRegex.test(strValue)) {
    try {
      const date = new Date(strValue);
      const formattedDate = date.toLocaleDateString('en-GB');
      console.log(`✅ ISO date conversion: "${strValue}" → ${formattedDate}`);
      return formattedDate;
    } catch (error) {
      console.log(`❌ ISO date conversion failed: ${error.message}`);
    }
  }
  
  // Check if it's a number (Excel serial number)
  const excelDate = parseInt(strValue);
  if (!isNaN(excelDate)) {
    // Only use XLSX conversion for actual Excel serial numbers (reasonable range)
    if (excelDate > 1000 && excelDate < 100000) {
      try {
        // Method 1: Using XLSX library (most reliable for Excel dates)
        const xlsxDate = XLSX.SSF.parse_date_code(excelDate);
        const formattedDate = `${String(xlsxDate.d).padStart(2, '0')}/${String(xlsxDate.m).padStart(2, '0')}/${xlsxDate.y}`;
        console.log(`✅ XLSX conversion: ${excelDate} → ${formattedDate}`);
        return formattedDate;
      } catch (error) {
        console.log(`❌ XLSX conversion failed, trying manual method`);
      }
    }
    
    // Method 2: Manual conversion
    try {
      const date = new Date((excelDate - 25569) * 86400 * 1000);
      const formattedDate = date.toLocaleDateString('en-GB');
      console.log(`✅ Manual conversion: ${excelDate} → ${formattedDate}`);
      return formattedDate;
    } catch (manualError) {
      console.log(`❌ Manual conversion failed: ${manualError.message}`);
      return '06/08/2025'; // Default fallback
    }
  }
  
  // If it's not a number, try to parse as a date string
  try {
    const date = new Date(strValue);
    if (!isNaN(date.getTime())) {
      const formattedDate = date.toLocaleDateString('en-GB');
      console.log(`✅ String date conversion: "${strValue}" → ${formattedDate}`);
      return formattedDate;
    }
  } catch (error) {
    console.log(`❌ String date conversion failed: ${error.message}`);
  }
  
  // Final fallback
  console.log(`⚠️ Could not convert "${strValue}", using default`);
  return '06/08/2025';
}

// Test the function with various inputs
console.log('🧪 Testing improved date conversion...\n');

const testCases = [
  45816,           // Excel serial number
  '45816',         // String Excel serial number
  '08/06/2025',    // Already formatted date
  '06/08/2025',    // Another formatted date
  '',              // Empty string
  null,            // Null value
  'invalid',       // Invalid string
  '2025-06-08',    // ISO date format
  'NA',            // Special value
  'N/A',           // Another special value
  'TBD',           // To be determined
];

testCases.forEach(testCase => {
  console.log(`Input: ${JSON.stringify(testCase)}`);
  const result = convertExcelDate(testCase);
  console.log(`Output: ${result}\n`);
});

module.exports = { convertExcelDate }; 