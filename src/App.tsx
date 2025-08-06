import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPanel } from './components/DashboardPanel';
import { BarChart3Icon, SearchIcon, DatabaseIcon, MessageSquareIcon, DollarSignIcon, UsersIcon, XIcon } from 'lucide-react';
import * as XLSX from 'xlsx';

// Helper function to format Excel dates
const formatExcelDate = (value: any): string => {
  if (typeof value === 'number' && value > 1) {
    // Excel dates are serial numbers starting from January 1, 1900
    const excelEpoch = new Date(1900, 0, 1);
    const date = new Date(excelEpoch.getTime() + (value - 2) * 24 * 60 * 60 * 1000);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  }
  return value?.toString() || '';
};
export function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showWorkTracker, setShowWorkTracker] = useState(false);
  const [workTrackerData, setWorkTrackerData] = useState<any[]>([]);
  const [showPriceGrabModal, setShowPriceGrabModal] = useState(false);
  const [showRagModal, setShowRagModal] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleWorkTracker = async () => {
    if (!showWorkTracker) {
      // Load fresh data when opening the tracker
      try {
        console.log('🔄 Loading Excel file...');
        
        // Load the Excel file with cache busting
        const timestamp = new Date().getTime();
        const url = `/Customer Capital Work Tracker-2.xlsx?t=${timestamp}&refresh=true`;
        console.log('Loading from URL:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        console.log('✅ File loaded successfully! Size:', arrayBuffer.byteLength, 'bytes');
        
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Read with date formatting
        const rawData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          raw: false,
          dateNF: 'yyyy-mm-dd'
        }) as any[][];
        
        // Format dates in the data
        const data = rawData.map((row: any[]) => 
          row.map((cell: any) => formatExcelDate(cell))
        );
        
        console.log('📊 Excel data loaded:', data.length, 'rows');
        console.log('📋 First few rows:', data.slice(0, 3));
        
        // Check if data contains the expected value
        const hasExpectedValue = data.some(row => 
          Array.isArray(row) && row.some(cell => 
            cell && cell.toString().includes('Order Reconciliation')
          )
        );
        
        if (hasExpectedValue) {
          console.log('✅ SUCCESS: Found "Order Reconciliation" in the data!');
        } else {
          console.log('❌ "Order Reconciliation" not found in the data');
          console.log('📋 Current data sample:', data.slice(0, 5));
          console.log('💡 To update Excel data:');
          console.log('1. Modify your Excel file locally');
          console.log('2. Upload the new file to Netlify (Files tab)');
          console.log('3. Click "🔄 Refresh" button again');
        }
        
        setWorkTrackerData(data);
      } catch (error) {
        console.error('❌ Error loading Excel file:', error);
        console.log('💡 To update Excel data:');
        console.log('1. Modify your Excel file locally');
        console.log('2. Upload the new file to Netlify (Files tab)');
        console.log('3. Click "🔄 Refresh" button again');
      }
    }
    setShowWorkTracker(!showWorkTracker);
  };

  const refreshExcelData = async () => {
    try {
      console.log('🔄 REFRESHING EXCEL DATA...');
      
      // Load the Excel file with cache busting
      const timestamp = new Date().getTime();
      const url = `/Customer Capital Work Tracker-2.xlsx?t=${timestamp}&refresh=true`;
      console.log('Trying to load:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        console.log('❌ File not found. Please run the copy command first.');
        return;
      }
      
      const arrayBuffer = await response.arrayBuffer();
      console.log('✅ Fresh file loaded successfully!');
      console.log('File size:', arrayBuffer.byteLength, 'bytes');
      
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Read with date formatting
      const rawData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        raw: false,
        dateNF: 'yyyy-mm-dd'
      }) as any[][];
      
      // Format dates in the data
      const data = rawData.map((row: any[]) => 
        row.map((cell: any) => formatExcelDate(cell))
      );
      
      console.log('📊 Excel data loaded:', data.length, 'rows');
      console.log('📋 First few rows:', data.slice(0, 3));
      
      // Check if data contains the expected value
      const hasExpectedValue = data.some(row => 
        Array.isArray(row) && row.some(cell => 
          cell && cell.toString().includes('Order Reconciliation')
        )
      );
      
      if (hasExpectedValue) {
        console.log('✅ SUCCESS: Found "Order Reconciliation" in the fresh data!');
      } else {
        console.log('❌ "Order Reconciliation" not found in the fresh data');
        console.log('📋 Current data sample:', data.slice(0, 5));
        console.log('💡 To update Excel data:');
        console.log('1. Modify your Excel file locally');
        console.log('2. Upload the new file to Netlify (Files tab)');
        console.log('3. Click "🔄 Refresh" button again');
      }
      
      setWorkTrackerData(data);
    } catch (error) {
      console.error('❌ Error refreshing Excel file:', error);
      console.log('💡 To update Excel data:');
      console.log('1. Modify your Excel file locally');
      console.log('2. Upload the new file to Netlify (Files tab)');
      console.log('3. Click "🔄 Refresh" button again');
    }
  };

  const handlePriceGrabClick = () => {
    setShowPriceGrabModal(true);
  };

  const handleRagClick = () => {
    setShowRagModal(true);
  };




  return <div className="flex h-screen w-full bg-gray-50">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={toggleSidebar} 
        onPriceGrabClick={handlePriceGrabClick}
        onRagClick={handleRagClick}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Project Dashboard
            </h1>
            <button 
              onClick={toggleWorkTracker}
              className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 shadow-sm ${
                showWorkTracker 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
              title={showWorkTracker ? "Hide Work Tracker" : "Show Work Tracker"}
            >
              {showWorkTracker ? 'Hide Tracker' : 'At a Glance'}
            </button>
          </div>
          
          {showWorkTracker && workTrackerData.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Projects Work Tracker</h2>
                <button 
                  onClick={refreshExcelData}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors duration-200"
                  title="Refresh Excel data"
                >
                  🔄 Refresh
                </button>
              </div>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      {workTrackerData.length > 0 && (
                        <tr>
                          {workTrackerData[0].map((header: string, index: number) => (
                            <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {header}
                            </th>
                          ))}
                        </tr>
                      )}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {workTrackerData.slice(1).map((row: any[], rowIndex: number) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {row.map((cell: any, cellIndex: number) => (
                            <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardPanel 
              title="Price Grab" 
              description="Competitive price monitoring and analysis" 
              icon={<SearchIcon />} 
              color="bg-blue-500" 
              stats={{
                value: '12,345',
                label: 'Products tracked'
              }} 
              change={{
                value: '+5.3%',
                positive: true
              }} 
              status="uat"
              onPanelClick={handlePriceGrabClick}
            />
            <DashboardPanel title="GA Insights" description="Advanced Google Analytics data processing" icon={<BarChart3Icon />} color="bg-purple-500" stats={{
            value: '2.4M',
            label: 'Monthly pageviews'
          }} change={{
            value: '+12.7%',
            positive: true
          }} status="testing" />
            <DashboardPanel 
              title="RAG-Service" 
              description="Retrieval-Augmented Generation AI system" 
              icon={<DatabaseIcon />} 
              color="bg-green-500" 
              stats={{
                value: '98.2%',
                label: 'Accuracy rate'
              }} 
              change={{
                value: '+1.5%',
                positive: true
              }} 
              status="implemented"
              onPanelClick={handleRagClick}
            />
            <DashboardPanel title="dataTalk" description="Natural language data query platform" icon={<MessageSquareIcon />} color="bg-yellow-500" stats={{
            value: '5,672',
            label: 'Queries processed'
          }} change={{
            value: '-2.1%',
            positive: false
          }} status="development" />
            <DashboardPanel title="Fin Automation" description="Financial process automation tools" icon={<DollarSignIcon />} color="bg-red-500" stats={{
            value: '$1.2M',
            label: 'Cost savings'
          }} change={{
            value: '+15.8%',
            positive: true
          }} status="testing" />
            <DashboardPanel title="HR Automation" description="Human resources workflow automation" icon={<UsersIcon />} color="bg-indigo-500" stats={{
            value: '824',
            label: 'Hours saved monthly'
          }} change={{
            value: '+8.9%',
            positive: true
          }} status="implemented" />
          </div>
        </main>
      </div>
      
      {/* Global Price Grab Modal */}
      {showPriceGrabModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Competitive Pricing Analysis
                </h2>
                <button 
                  onClick={() => setShowPriceGrabModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <XIcon size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Purpose</h3>
                  <p className="text-gray-600 leading-relaxed">
                    The software aggregates and compares prices from Amazon, Flipkart, Croma, and Reliance to optimize pricing strategies for enhanced marketability.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Actionable Data</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Provides real-time price comparisons, competitor pricing trends, and demand fluctuations to inform dynamic pricing decisions.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Go-Live Date</h3>
                  <p className="text-gray-600">
                    Scheduled for August 16, 2025.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Contact Points</h3>
                  <p className="text-gray-600">
                    Nishant or Ganesh from Customer Capital; Dr. Venkat, Owner from Shepardtri.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Challenges</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Overcomes Amazon's bot detection algorithms using IP rotation and CAPTCHA-solving techniques to discreetly scrape prices.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Status</h3>
                  <p className="text-gray-600">
                    Proposal submitted and pending approval.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Global RAG Modal */}
      {showRagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Retrieval Augmented Generation (RAG-Service)
                </h2>
                <button 
                  onClick={() => setShowRagModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <XIcon size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Purpose</h3>
                  <p className="text-gray-600 leading-relaxed">
                    The RAG-Service enables users to upload PDF, Word, text, Excel, or PowerPoint documents and query their content for enhanced information retrieval and analysis.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Actionable Data</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Provides accurate, context-aware responses to user queries based on document content, facilitating informed decision-making.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Go-Live Date</h3>
                  <p className="text-gray-600">
                    Scheduled for Monday, August 11, 2025.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Contact Points</h3>
                  <p className="text-gray-600">
                    Kushal from Customer Capital; Dr. Venkat from Shepardtri.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Challenges</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Achieves accuracies above 95%, with additional testing required to ensure reliability.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Status</h3>
                  <p className="text-gray-600">
                    Proposal submitted and pending approval.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>;
}