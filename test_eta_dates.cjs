const XLSX = require('xlsx');

// Test the specific ETA values from Customer Capital Work details.xlsx
const etaValues = [
  44774,  // Row 1: Price Grab
  43313,  // Row 2: RAG
  45852,  // Row 3: GA dashboards
  45847,  // Row 4: Auto Scheduling
  'NA',   // Row 5: DataWarehouse
  'Dr.Venkat', // Some other values that might appear
  'Sakthi'
];

console.log('🔍 Testing ETA date conversions from Customer Capital Work details.xlsx...\n');

etaValues.forEach((value, index) => {
  console.log(`ETA Value ${index + 1}: "${value}"`);
  
  if (typeof value === 'number' || !isNaN(parseInt(value))) {
    const excelDate = parseInt(value);
    try {
      // Method 1: XLSX library
      const xlsxDate = XLSX.SSF.parse_date_code(excelDate);
      const formattedDate = `${String(xlsxDate.d).padStart(2, '0')}/${String(xlsxDate.m).padStart(2, '0')}/${xlsxDate.y}`;
      console.log(`   ✅ XLSX conversion: ${excelDate} → ${formattedDate}`);
    } catch (error) {
      console.log(`   ❌ XLSX conversion failed: ${error.message}`);
    }
    
    // Method 2: Manual conversion
    try {
      const date = new Date((excelDate - 25569) * 86400 * 1000);
      const formattedDate = date.toLocaleDateString('en-GB');
      console.log(`   ✅ Manual conversion: ${excelDate} → ${formattedDate}`);
    } catch (error) {
      console.log(`   ❌ Manual conversion failed: ${error.message}`);
    }
  } else {
    console.log(`   ℹ️ Text value: "${value}" (no conversion needed)`);
  }
  console.log('');
}); 