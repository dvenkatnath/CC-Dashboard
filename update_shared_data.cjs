const { execSync } = require('child_process');
const path = require('path');

console.log('🔄 Updating shared data - Automated process...\n');

try {
  // Step 1: Export fresh data to JSON
  console.log('📤 Step 1: Exporting fresh data to JSON...');
  execSync('node export_data_to_json.cjs', { stdio: 'inherit' });
  console.log('✅ Data exported successfully\n');

  // Step 2: Build the application
  console.log('🔨 Step 2: Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Application built successfully\n');

  // Step 3: Commit changes
  console.log('📝 Step 3: Committing changes...');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const commitMessage = `Update shared data - ${timestamp}`;
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  console.log('✅ Changes committed successfully\n');

  // Step 4: Push to GitHub
  console.log('🚀 Step 4: Pushing to GitHub...');
  execSync('git push origin main', { stdio: 'inherit' });
  console.log('✅ Changes pushed to GitHub\n');

  console.log('🎉 Update process completed successfully!');
  console.log('\n📋 What happened:');
  console.log('   1. ✅ Fresh data exported to JSON files');
  console.log('   2. ✅ Application built with new data');
  console.log('   3. ✅ Changes committed to Git');
  console.log('   4. ✅ Changes pushed to GitHub');
  console.log('\n⏱️  Netlify will auto-deploy within 2-5 minutes');
  console.log('🌐 Shared URL: https://whimsical-jelly-59e6c6.netlify.app');
  console.log('\n💡 Everyone will see your updated data soon!');

} catch (error) {
  console.error('❌ Error during update process:', error.message);
  console.log('\n🔧 Manual steps:');
  console.log('   1. node export_data_to_json.cjs');
  console.log('   2. npm run build');
  console.log('   3. git add .');
  console.log('   4. git commit -m "Update data"');
  console.log('   5. git push origin main');
} 