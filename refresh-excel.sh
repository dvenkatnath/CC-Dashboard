#!/bin/bash
# Script to refresh Excel file for the dashboard

echo "🔄 Refreshing Excel file for dashboard..."
timestamp=$(date +%s)
newFileName="excel-refresh-${timestamp}.xlsx"

# Copy the Excel file with timestamp
cp "Customer Capital Work Tracker-2.xlsx" "public/${newFileName}"

if [ $? -eq 0 ]; then
    echo "✅ Successfully copied Excel file to: public/${newFileName}"
    echo "📋 Now click the Refresh button in your dashboard to load the fresh data!"
    echo "📋 Or run this command to copy to the standard location:"
    echo "   cp \"Customer Capital Work Tracker-2.xlsx\" \"public/excel-current.xlsx\""
else
    echo "❌ Failed to copy Excel file"
    echo "💡 Make sure the file 'Customer Capital Work Tracker-2.xlsx' exists in the current directory"
fi 