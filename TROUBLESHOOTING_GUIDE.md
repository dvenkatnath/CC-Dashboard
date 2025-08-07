# 🔧 Troubleshooting Guide - Data Loading Issues

## 🚨 **Current Issue: "At a Glance" and Panel Synopses Not Working**

### **Symptoms:**
- ❌ "At a Glance" button doesn't show data
- ❌ Panel synopses don't appear when clicked
- ❌ No error messages visible

## 🔍 **Step-by-Step Diagnosis**

### **Step 1: Check Development Server**
```bash
# Make sure development server is running
npm run dev

# Should show something like:
# VITE v5.4.19  ready in 141 ms
# ➜  Local:   http://localhost:5173/
```

### **Step 2: Test JSON Files Directly**
Visit these URLs in your browser:
- `http://localhost:5173/project-synopsis.json`
- `http://localhost:5173/customer-capital-work-details.json`

**Expected Result:** You should see JSON data with `{"success": true, "data": [...]}`

### **Step 3: Use Debug Page**
Visit: `http://localhost:5173/debug_data_loading.html`

This will automatically test:
- ✅ Project Synopsis data loading
- ✅ Work Details data loading  
- ✅ Direct file access

### **Step 4: Check Browser Console**
1. Open browser developer tools (F12)
2. Go to Console tab
3. Click "At a Glance" button
4. Look for error messages or success logs

**Expected Console Output:**
```
🔄 Loading Customer Capital Work Details from database...
📍 API Service: StaticApiService
✅ Work Details loaded successfully! [...]
📊 Work Details length: X records
📊 Work Details data set in state
```

## 🛠️ **Common Issues & Solutions**

### **Issue 1: JSON Files Not Found (404 Error)**
**Symptoms:** Console shows 404 errors
**Solution:**
```bash
# Check if files exist
ls -la public/*.json

# Regenerate JSON files
node export_data_to_json.cjs
```

### **Issue 2: CORS Errors**
**Symptoms:** Console shows CORS policy errors
**Solution:**
- This shouldn't happen with static files
- Make sure you're accessing via `http://localhost:5173/` not `file://`

### **Issue 3: Empty Data Arrays**
**Symptoms:** JSON loads but `data` array is empty
**Solution:**
```bash
# Check database has data
node -e "const sqlite3 = require('sqlite3').verbose(); const db = new sqlite3.Database('customer_capital_dashboard.db'); db.all('SELECT COUNT(*) as count FROM Project_Synopsis', (err, rows) => { console.log('Project count:', rows[0].count); db.close(); });"
```

### **Issue 4: Project Name Mismatch**
**Symptoms:** Panel synopses show wrong data
**Solution:**
The project detection logic has been fixed. Check if project names in JSON match:
```bash
# Check project names in JSON
grep "project_name" public/project-synopsis.json
```

## 🔧 **Quick Fixes**

### **Fix 1: Regenerate All Data**
```bash
# Export fresh data
node export_data_to_json.cjs

# Restart development server
npm run dev
```

### **Fix 2: Clear Browser Cache**
1. Open Developer Tools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### **Fix 3: Check File Permissions**
```bash
# Make sure JSON files are readable
chmod 644 public/*.json
```

## 📊 **Expected Data Structure**

### **Project Synopsis JSON:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "project_name": "Competitive Pricing Analysis",
      "description": "...",
      "purpose": "...",
      "actionable_data": "...",
      "go_live_date": "...",
      "contact_points": "...",
      "challenges": "...",
      "notes": "...",
      "date_updated": "06/08/2025"
    }
  ]
}
```

### **Work Details JSON:**
```json
{
  "success": true,
  "data": [
    {
      "id": 31,
      "serial_number": 1,
      "description": "Price Grab - Competitive Price scraping from Portals",
      "project_type": "Agentic Automation",
      "status": "UAT",
      "customer_contact": "Ganesh",
      "eta": "01/08/2022",
      "shepardti_owner": "Dr.Venkat",
      "proposal_submitted": "Yes"
    }
  ]
}
```

## 🎯 **Testing Checklist**

### **Before Testing:**
- ✅ Development server running on port 5173
- ✅ JSON files exist in `public/` directory
- ✅ Browser console is open
- ✅ Cache is cleared

### **Test "At a Glance":**
1. Click "At a Glance" button
2. Check console for loading messages
3. Verify table appears with data
4. Check if ETA dates are formatted correctly

### **Test Panel Synopses:**
1. Click any panel (Price Grab, RAG, etc.)
2. Check console for loading messages
3. Verify modal opens with project details
4. Check if "Date Updated" field appears

## 🚀 **If Nothing Works**

### **Nuclear Option - Complete Reset:**
```bash
# 1. Stop development server (Ctrl+C)
# 2. Clear all generated files
rm -f public/*.json
rm -f dist/

# 3. Regenerate everything
node export_data_to_json.cjs
npm run build

# 4. Restart development server
npm run dev
```

### **Check Database:**
```bash
# Verify database has data
sqlite3 customer_capital_dashboard.db "SELECT COUNT(*) FROM Project_Synopsis;"
sqlite3 customer_capital_dashboard.db "SELECT COUNT(*) FROM Customer_Capital_Work_Details;"
```

## 📞 **Debug Information to Collect**

If issues persist, collect this information:

1. **Browser Console Logs** - Copy all console output
2. **Network Tab** - Check if JSON requests succeed
3. **JSON File Contents** - First few lines of each JSON file
4. **Database Counts** - Number of records in each table
5. **Development Server Output** - Any error messages

## 🎉 **Success Indicators**

### **"At a Glance" Working:**
- ✅ Button toggles between blue and light green
- ✅ Table appears with work details
- ✅ ETA dates show correctly (not as numbers)
- ✅ Console shows success messages

### **Panel Synopses Working:**
- ✅ Clicking panels opens modals
- ✅ Project details are displayed
- ✅ "Date Updated" field shows in dark blue
- ✅ Refresh button works

**💡 If you see these indicators, everything is working correctly!** 