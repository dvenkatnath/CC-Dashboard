# Customer Capital Dashboard

A modern React dashboard for project management and work tracking, built with Vite, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Project Dashboard** with "At a Glance" Excel data viewer
- **Dynamic Excel Integration** - Load and display data from Excel files
- **Interactive Modals** for Price Grab and RAG-Service details
- **Responsive Design** with modern UI components
- **Real-time Data Refresh** capabilities
- **Date Formatting** for Excel date columns

## 🚀 Live Demo

**https://whimsical-jelly-59e6c6.netlify.app**

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **SheetJS (xlsx)** for Excel file processing
- **Netlify** for deployment

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd CC-Dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Usage

### Local Development
```bash
npm run dev
```
Open http://localhost:5173 to view the dashboard.

### Building for Production
```bash
npm run build
```

### Deploying
```bash
# Deploy to Netlify
npx netlify deploy --prod --dir=dist
```

## 📊 Excel Integration

The dashboard can load and display data from Excel files:

1. **Place Excel files** in the `public/` directory
2. **Click "At a Glance"** to load the data
3. **Use "🔄 Refresh"** button to get fresh data
4. **For updates**: Copy new Excel file to `public/work-tracker-latest.xlsx`

### Excel File Requirements
- Supported format: `.xlsx`
- First row should contain headers
- Date columns are automatically formatted

## 🎯 Project Structure

```
CC-Dashboard/
├── src/
│   ├── components/
│   │   ├── DashboardPanel.tsx    # Individual dashboard panels
│   │   ├── Header.tsx           # Top navigation header
│   │   └── Sidebar.tsx          # Left sidebar navigation
│   ├── App.tsx                  # Main application component
│   ├── index.tsx               # Application entry point
│   └── index.css               # Global styles
├── public/
│   ├── CC3-bg.png             # Logo image
│   └── *.xlsx                 # Excel data files
├── package.json
└── README.md
```

## 🔄 Data Refresh Process

1. **Modify Excel file** locally
2. **Copy to public directory**:
   ```bash
   cp "Customer Capital Work Tracker-2.xlsx" "public/work-tracker-latest.xlsx"
   ```
3. **Click "🔄 Refresh"** in the dashboard
4. **View updated data**

## 🎨 Customization

### Adding New Dashboard Panels
1. Add panel data to `App.tsx`
2. Configure title, description, icon, and status
3. Add modal content if needed

### Styling
- Uses Tailwind CSS classes
- Custom colors defined in `tailwind.config.js`
- Responsive design with mobile-first approach

## 📱 Responsive Design

The dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🔗 Links

- **Live Dashboard**: https://whimsical-jelly-59e6c6.netlify.app
- **Netlify Admin**: https://app.netlify.com/projects/whimsical-jelly-59e6c6

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Customer Capital** - Project requirements and data
- **Shepardtri** - Development and implementation

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
