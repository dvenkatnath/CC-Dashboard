# 🔄 Data Update Guide - Keeping Shared Environment Current

## 🚨 **Important: Data Updates Are NOT Automatic**

When you change your local database, the shared environment **does NOT** automatically update. You must manually sync the changes.

## ✅ **Quick Update Process (Recommended)**

### **One-Command Update:**
```bash
node update_shared_data.cjs
```

This single command will:
1. Export fresh data to JSON
2. Build the application
3. Commit and push changes
4. Trigger Netlify auto-deployment

## 📋 **Manual Update Process**

### **Step 1: Update Your Local Database**
```bash
# Import new Excel data
node import_all_projects_sqlite.cjs
node import_customer_capital_work_details.cjs

# Or make direct database changes
# (your database changes here)
```

### **Step 2: Export Fresh Data**
```bash
# Export updated data to JSON files
node export_data_to_json.cjs
```

### **Step 3: Build and Deploy**
```bash
# Build the application
npm run build

# Commit changes
git add .
git commit -m "Update data - [describe your changes]"

# Push to GitHub
git push origin main
```

### **Step 4: Wait for Netlify**
- Netlify automatically detects the push
- Builds and deploys within 2-5 minutes
- Everyone sees the updated data

## 🔄 **Common Update Scenarios**

### **Scenario 1: Update Excel Data**
```bash
# 1. Update your Excel files
# 2. Import to database
node import_all_projects_sqlite.cjs
node import_customer_capital_work_details.cjs

# 3. Update shared environment
node update_shared_data.cjs
```

### **Scenario 2: Add New Projects**
```bash
# 1. Add new project to database
# 2. Update shared environment
node update_shared_data.cjs
```

### **Scenario 3: Update ETA Dates**
```bash
# 1. Update dates in Excel/database
# 2. Update shared environment
node update_shared_data.cjs
```

## ⏱️ **Timeline for Updates**

| Action | Time Required |
|--------|---------------|
| Run update script | 30-60 seconds |
| Git push | 10-30 seconds |
| Netlify build | 1-3 minutes |
| **Total time** | **2-5 minutes** |

## 🔍 **Verifying Updates**

### **Check if Update is Live:**
1. Visit: https://whimsical-jelly-59e6c6.netlify.app
2. Check the data you updated
3. If not updated, wait 1-2 more minutes

### **Check Netlify Status:**
1. Go to your Netlify dashboard
2. Check the latest deployment status
3. Look for "Published" status

## 🚨 **Troubleshooting**

### **Issue: Changes Not Appearing**
**Solution:**
```bash
# Force a fresh update
node update_shared_data.cjs
```

### **Issue: Build Errors**
**Solution:**
```bash
# Check for errors
npm run build

# Fix any issues, then update
node update_shared_data.cjs
```

### **Issue: Git Push Fails**
**Solution:**
```bash
# Pull latest changes first
git pull origin main

# Then update
node update_shared_data.cjs
```

## 📊 **What Gets Updated**

### **Files Updated:**
- `public/project-synopsis.json` - All project data
- `public/customer-capital-work-details.json` - Work tracker data
- `dist/` - Built application files

### **What Others See:**
- ✅ Updated project synopses
- ✅ Updated At a Glance data
- ✅ Updated ETA dates
- ✅ Any new projects added

## 🎯 **Best Practices**

### **Before Updates:**
1. ✅ Test changes locally first
2. ✅ Verify data is correct
3. ✅ Use descriptive commit messages

### **After Updates:**
1. ✅ Verify changes are live
2. ✅ Test the shared URL
3. ✅ Inform team of updates

## 🚀 **Quick Reference**

### **Most Common Commands:**
```bash
# Full update (recommended)
node update_shared_data.cjs

# Manual update
node export_data_to_json.cjs
npm run build
git add . && git commit -m "Update data" && git push origin main

# Check status
git status
```

### **Shared URL:**
**https://whimsical-jelly-59e6c6.netlify.app**

## 💡 **Pro Tips**

1. **Use the automated script** - `node update_shared_data.cjs`
2. **Update regularly** - Don't let data get too stale
3. **Test locally first** - Always verify before sharing
4. **Use descriptive messages** - Help track what changed
5. **Monitor Netlify** - Check deployment status

**🎉 With this guide, you can keep your shared environment always up-to-date!** 