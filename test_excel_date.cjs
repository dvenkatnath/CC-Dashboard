// Test Excel date conversion
const excelDate = 45816;

console.log('🔍 Testing Excel date conversion...');
console.log(`Excel serial number: ${excelDate}`);

// Method 1: Standard conversion
const date1 = new Date((excelDate - 25569) * 86400 * 1000);
console.log(`Method 1 (Standard): ${date1.toLocaleDateString('en-GB')}`);

// Method 2: Alternative conversion
const date2 = new Date((excelDate - 25569) * 24 * 60 * 60 * 1000);
console.log(`Method 2 (Alternative): ${date2.toLocaleDateString('en-GB')}`);

// Method 3: Using XLSX date conversion
const XLSX = require('xlsx');
const date3 = XLSX.SSF.parse_date_code(excelDate);
console.log(`Method 3 (XLSX): ${date3.y}-${String(date3.m).padStart(2, '0')}-${String(date3.d).padStart(2, '0')}`);

// Method 4: Manual calculation
const daysSince1900 = excelDate;
const daysSince1970 = daysSince1900 - 25569;
const millisecondsSince1970 = daysSince1970 * 24 * 60 * 60 * 1000;
const date4 = new Date(millisecondsSince1970);
console.log(`Method 4 (Manual): ${date4.toLocaleDateString('en-GB')}`);

console.log('\n📅 All methods should show the same date!'); 