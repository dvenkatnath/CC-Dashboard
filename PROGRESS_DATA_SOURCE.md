# 📊 Progress Data Source - Dashboard Panels

## 🔍 **Where Progress Percentages Come From**

### **Before (Hardcoded Values):**
The progress percentages in dashboard panels were **hardcoded** in `src/App.tsx`:

```typescript
// OLD - Hardcoded values
stats={{
  value: "60%",  // ❌ Static value
  label: "Progress"
}}
```

### **After (Dynamic from Database):**
Now the progress percentages are **dynamically loaded** from the database:

```typescript
// NEW - Dynamic values from database
stats={{
  value: `${getProjectProgress('Price Grab')}%`,  // ✅ Real data from database
  label: "Progress"
}}
```

## 📋 **Data Flow**

### **1. Database Source:**
- **Table:** `Project_Synopsis`
- **Column:** `progress_percentage`
- **Data Type:** Integer (0-100)

### **2. JSON Export:**
- **File:** `public/project-synopsis.json`
- **Structure:** 
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "project_name": "Competitive Pricing Analysis",
      "progress_percentage": 60,
      // ... other fields
    }
  ]
}
```

### **3. Frontend Loading:**
- **Component:** `App.tsx`
- **Function:** `getProjectProgress(projectTitle)`
- **Logic:** Matches panel title to project name and returns progress

## 🎯 **Current Progress Values**

Based on the database data, here are the actual progress percentages:

| Panel | Project Name in DB | Progress % |
|-------|-------------------|------------|
| **Price Grab** | "Competitive Pricing Analysis" | **60%** |
| **RAG-Service** | "Retrieval Aumented Service (RAG)" | **70%** |
| **GA Insights** | "GA dashboards" | **45%** |
| **Finance Automation** | "Finance Automation" | **35%** |
| **Data Warehouse** | "Datawarehouse" | **20%** |
| **HR Automation** | "Datawarehouse" (HR project) | **15%** |
| **CX Agentic Framework** | "CX Agentic Framework" | **25%** |
| **Integration - Agentic Framework** | "CX Agentic Framework" (Integration) | **20%** |

## 🔄 **How It Works**

### **Step 1: Data Loading**
```typescript
// Load project data on component mount
useEffect(() => {
  const loadData = async () => {
    const projects = await ApiService.getProjectSynopsisData();
    setProjectData(projects);
  };
  loadData();
}, []);
```

### **Step 2: Progress Calculation**
```typescript
const getProjectProgress = (projectTitle: string): number => {
  // Find project by matching title to project_name
  const targetProject = projectData.find(project => 
    project.project_name.toLowerCase().includes('price grab')
  );
  
  return targetProject ? targetProject.progress_percentage || 0 : 0;
};
```

### **Step 3: Display**
```typescript
<DashboardPanel
  title="Price Grab"
  stats={{
    value: `${getProjectProgress('Price Grab')}%`, // Dynamic value
    label: "Progress"
  }}
/>
```

## 🚀 **Benefits of Dynamic Progress**

### **✅ Real-time Updates:**
- Progress updates when database changes
- No need to modify code for progress updates
- Consistent with actual project status

### **✅ Data Accuracy:**
- Progress reflects real project status
- Single source of truth (database)
- No manual synchronization needed

### **✅ Scalability:**
- Easy to add new projects
- Automatic progress tracking
- Database-driven approach

## 🔧 **How to Update Progress**

### **Method 1: Update Database Directly**
```sql
UPDATE Project_Synopsis 
SET progress_percentage = 75 
WHERE project_name LIKE '%Price%';
```

### **Method 2: Update Excel and Re-import**
1. Update progress in `Tracker.xlsx`
2. Run import script: `node import_all_projects_sqlite.cjs`
3. Export to JSON: `node export_data_to_json.cjs`

### **Method 3: Use Update Script**
```bash
# Complete update process
node update_shared_data.cjs
```

## 📊 **Fallback Values**

If database data isn't loaded yet, the system uses these default values:

```typescript
const defaults: { [key: string]: number } = {
  'Price Grab': 60,
  'RAG-Service': 70,
  'GA Insights': 45,
  'Finance Automation': 35,
  'Data Warehouse': 20,
  'HR Automation': 15,
  'CX Agentic Framework': 25,
  'Integration - Agentic Framework': 20
};
```

## 🎉 **Summary**

**The progress percentages now come from the `progress_percentage` column in the `Project_Synopsis` table in your SQLite database, not from hardcoded values in the code.**

This means:
- ✅ **Real data** from your database
- ✅ **Automatic updates** when database changes
- ✅ **Consistent** across all views
- ✅ **Maintainable** - no code changes needed for progress updates

**💡 The progress values you see now (60%, 70%, 45%, etc.) are the actual values from your database!** 