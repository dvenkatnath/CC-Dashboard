#!/bin/bash
# Script to copy Excel file with timestamp
timestamp=$(date +%s)
cp "Customer Capital Work Tracker-2.xlsx" "public/excel-${timestamp}.xlsx"
echo "excel-${timestamp}.xlsx" 