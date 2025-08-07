const XLSX = require('xlsx');
const path = require('path');

console.log('🔍 Extracting dataTalk data from tracker.xlsx...\n');

try {
  const workbook = XLSX.readFile('tracker.xlsx');
  const sheetName = 'dataTalk';
  
  if (!workbook.SheetNames.includes(sheetName)) {
    console.log(`❌ Sheet "${sheetName}" not found in tracker.xlsx`);
    console.log('Available sheets:', workbook.SheetNames.join(', '));
    return;
  }
  
  console.log(`✅ Found sheet: ${sheetName}`);
  
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log('📊 dataTalk data:');
  console.log('---');
  
  let projectData = {
    project_name: 'dataTalk',
    description: '',
    purpose: '',
    actionable_data: '',
    go_live_date: '',
    contact_points: '',
    challenges: '',
    notes: '',
    progress_percentage: 0,
    mode: 'Development',
    date_updated: '06/08/2025'
  };
  
  if (jsonData.length > 0) {
    jsonData.forEach((row, index) => {
      if (row && row.length >= 2) {
        const description = row[0] ? row[0].toString() : '';
        const value = row[1] ? row[1].toString() : '';
        
        console.log(`Row ${index + 1}: "${description}" = "${value}"`);
        
        if (description.toLowerCase().includes('heading')) {
          projectData.project_name = value || 'dataTalk';
        } else if (description.toLowerCase().includes('purpose')) {
          projectData.purpose = value;
          projectData.description = value;
        } else if (description.toLowerCase().includes('actionable data')) {
          projectData.actionable_data = value;
        } else if (description.toLowerCase().includes('go live')) {
          projectData.go_live_date = value;
        } else if (description.toLowerCase().includes('contact')) {
          projectData.contact_points = value;
        } else if (description.toLowerCase().includes('challenge')) {
          projectData.challenges = value;
        } else if (description.toLowerCase().includes('status')) {
          projectData.notes = value;
        } else if (description.toLowerCase().includes('progress')) {
          const progressValue = parseFloat(value);
          if (!isNaN(progressValue)) {
            projectData.progress_percentage = Math.round(progressValue * 100);
          }
        } else if (description.toLowerCase().includes('mode')) {
          projectData.mode = value.trim();
        } else if (description.toLowerCase().includes('date updated')) {
          const { convertExcelDate } = require('./improved_date_conversion.cjs');
          projectData.date_updated = convertExcelDate(value);
        }
      }
    });
  }
  
  console.log('\n📋 Extracted dataTalk project data:');
  console.log(JSON.stringify(projectData, null, 2));
  
} catch (error) {
  console.error('❌ Error reading tracker.xlsx:', error.message);
} 