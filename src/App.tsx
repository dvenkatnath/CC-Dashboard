import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPanel } from './components/DashboardPanel';
import { BarChart3Icon, SearchIcon, DatabaseIcon, MessageSquareIcon, DollarSignIcon, UsersIcon, XIcon } from 'lucide-react';
import { StaticApiService as ApiService } from './services/staticApi';

// Helper function to format database dates
const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      });
    }
  } catch (error) {
    console.log('Error formatting date:', dateString, error);
  }
  
  return dateString;
};

export function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showWorkTracker, setShowWorkTracker] = useState(false);
  const [workDetailsData, setWorkDetailsData] = useState<any[]>([]);
  const [showPriceGrabModal, setShowPriceGrabModal] = useState(false);
  const [showRagModal, setShowRagModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dbConnectionStatus, setDbConnectionStatus] = useState<string>('checking');
  const [projectData, setProjectData] = useState<any[]>([]);
  
  // Modal trigger states
  const [triggerPriceGrabModal, setTriggerPriceGrabModal] = useState(false);
  const [triggerRagModal, setTriggerRagModal] = useState(false);
  const [triggerGAInsightsModal, setTriggerGAInsightsModal] = useState(false);
  const [triggerFinanceAutomationModal, setTriggerFinanceAutomationModal] = useState(false);
  const [triggerDataWarehouseModal, setTriggerDataWarehouseModal] = useState(false);
  const [triggerHRAutomationModal, setTriggerHRAutomationModal] = useState(false);
  const [triggerCXAgenticModal, setTriggerCXAgenticModal] = useState(false);
  const [triggerIntegrationAgenticModal, setTriggerIntegrationAgenticModal] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleWorkTracker = async () => {
    if (!showWorkTracker) {
      // Load fresh data when opening the tracker
      try {
        console.log('🔄 Loading Customer Capital Work Details from database...');
        console.log('📍 API Service:', ApiService);
        setIsLoading(true);
        
        const workDetails = await ApiService.getCustomerCapitalWorkDetails() as any[];
        console.log('✅ Work Details loaded successfully!', workDetails);
        console.log('📊 Work Details length:', workDetails.length, 'records');
        
        setWorkDetailsData(workDetails);
        console.log('📊 Work Details data set in state');
        
      } catch (error) {
        console.error('❌ Error loading work details from database:', error);
        console.error('❌ Error details:', (error as Error).message);
        // Don't set connection status to error if we can still load data
      } finally {
        setIsLoading(false);
      }
    }
    setShowWorkTracker(!showWorkTracker);
  };

  const refreshWorkDetailsData = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 REFRESHING WORK DETAILS DATA...');
      
      const workDetails = await ApiService.getCustomerCapitalWorkDetails() as any[];
      console.log('✅ Work Details refreshed successfully!', workDetails.length, 'records');
      
      setWorkDetailsData(workDetails);
      console.log('✅ Work Details data refreshed successfully!');
      
    } catch (error) {
      console.error('❌ Error refreshing work details data:', error);
      // Don't set connection status to error if we can still load data
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceGrabClick = () => {
    setTriggerPriceGrabModal(true);
    // Reset after a short delay to allow the modal to open
    setTimeout(() => setTriggerPriceGrabModal(false), 100);
  };

  const handleRagClick = () => {
    setTriggerRagModal(true);
    setTimeout(() => setTriggerRagModal(false), 100);
  };

  const handleGAInsightsClick = () => {
    setTriggerGAInsightsModal(true);
    setTimeout(() => setTriggerGAInsightsModal(false), 100);
  };

  const handleFinanceAutomationClick = () => {
    setTriggerFinanceAutomationModal(true);
    setTimeout(() => setTriggerFinanceAutomationModal(false), 100);
  };

  const handleDataWarehouseClick = () => {
    setTriggerDataWarehouseModal(true);
    setTimeout(() => setTriggerDataWarehouseModal(false), 100);
  };

  const handleHRAutomationClick = () => {
    setTriggerHRAutomationModal(true);
    setTimeout(() => setTriggerHRAutomationModal(false), 100);
  };

  const handleCXAgenticClick = () => {
    setTriggerCXAgenticModal(true);
    setTimeout(() => setTriggerCXAgenticModal(false), 100);
  };

  const handleIntegrationAgenticClick = () => {
    setTriggerIntegrationAgenticModal(true);
    setTimeout(() => setTriggerIntegrationAgenticModal(false), 100);
  };

  // Load project data and test database connection on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load project data for progress percentages
        const projects = await ApiService.getProjectSynopsisData();
        setProjectData(projects);
        console.log('✅ Project data loaded for progress tracking:', projects.length, 'projects');
        
        // Test the actual endpoint we're using for At a Glance
        const workDetails = await ApiService.getCustomerCapitalWorkDetails();
        setDbConnectionStatus(workDetails && workDetails.length > 0 ? 'connected' : 'error');
      } catch (error) {
        console.error('Database connection test failed:', error);
        setDbConnectionStatus('error');
      }
    };
    
    loadData();
  }, []);

  // Helper function to get progress percentage for a project
  const getProjectProgress = (projectTitle: string): number => {
    if (!projectData || projectData.length === 0) {
      // Return default values if no data loaded yet
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
      return defaults[projectTitle] || 0;
    }

    // Find the project by title
    let targetProject = null;
    if (projectTitle === 'Price Grab') {
      targetProject = projectData.find((project: any) => 
        project.project_name.toLowerCase().includes('price grab') ||
        project.project_name.toLowerCase().includes('competitive pricing') ||
        project.project_name.toLowerCase().includes('price')
      );
    } else if (projectTitle === 'RAG-Service') {
      targetProject = projectData.find((project: any) => 
        project.project_name.toLowerCase().includes('rag') || 
        project.project_name.toLowerCase().includes('retrieval')
      );
    } else if (projectTitle === 'GA Insights') {
      targetProject = projectData.find((project: any) => 
        project.project_name.toLowerCase().includes('ga dashboard') ||
        project.project_name.toLowerCase().includes('ga')
      );
    } else if (projectTitle === 'Finance Automation') {
      targetProject = projectData.find((project: any) => 
        project.project_name.toLowerCase().includes('finance automation')
      );
    } else if (projectTitle === 'Data Warehouse') {
      targetProject = projectData.find((project: any) => 
        project.project_name.toLowerCase().includes('datawarehouse') ||
        project.project_name.toLowerCase().includes('data warehouse')
      );
    } else if (projectTitle === 'HR Automation') {
      targetProject = projectData.find((project: any) => 
        project.project_name.toLowerCase().includes('hr automation') ||
        project.project_name.toLowerCase().includes('hr')
      );
    } else if (projectTitle === 'CX Agentic Framework') {
      targetProject = projectData.find((project: any) => 
        project.project_name.toLowerCase().includes('cx agentic framework')
      );
    } else if (projectTitle === 'Integration - Agentic Framework') {
      targetProject = projectData.find((project: any) => 
        project.project_name.toLowerCase().includes('integration') || 
        project.project_name.toLowerCase().includes('agentic framework')
      );
    }

    return targetProject ? targetProject.progress_percentage || 0 : 0;
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={toggleSidebar} 
        onPriceGrabClick={handlePriceGrabClick}
        onRagClick={handleRagClick}
        onGAInsightsClick={handleGAInsightsClick}
        onFinanceAutomationClick={handleFinanceAutomationClick}
        onDataWarehouseClick={handleDataWarehouseClick}
        onHRAutomationClick={handleHRAutomationClick}
        onCXAgenticClick={handleCXAgenticClick}
        onIntegrationAgenticClick={handleIntegrationAgenticClick}
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
                  ? 'bg-green-400 hover:bg-green-500 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              title={showWorkTracker ? "Hide Work Details" : "Show Work Details"}
            >
              {showWorkTracker ? 'Hide List' : 'At a Glance'}
            </button>
          </div>
          
          {showWorkTracker && workDetailsData.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Work Tracker</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={refreshWorkDetailsData}
                    disabled={isLoading}
                    className={`px-3 py-1 text-white text-sm rounded-md transition-colors duration-200 ${
                      isLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    title={isLoading ? "Refreshing..." : "Refresh work details data"}
                  >
                    {isLoading ? '⏳ Refreshing...' : '🔄 Refresh'}
                  </button>
                  <div className={`px-3 py-1 text-sm rounded-md ${
                    dbConnectionStatus === 'connected' 
                      ? 'bg-green-100 text-green-800' 
                      : dbConnectionStatus === 'error'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {dbConnectionStatus === 'connected' ? '✅ DB Connected' : 
                     dbConnectionStatus === 'error' ? '❌ DB Error' : '⏳ Checking DB...'}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S#</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETA</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shepardti Owner</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proposal Submitted</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {workDetailsData.map((row: any, rowIndex: number) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.serial_number}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{row.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.project_type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.status}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.customer_contact}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.eta}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.shepardti_owner}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.proposal_submitted}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <DashboardPanel
              title="Price Grab"
              description="Competitive pricing analysis tool"
              icon={<SearchIcon size={24} />}
              color="bg-blue-500"
              stats={{
                value: `${getProjectProgress('Price Grab')}%`,
                label: "Progress"
              }}
              change={{
                value: "+12%",
                positive: true
              }}
              status="development"
              onPanelClick={handlePriceGrabClick}
              triggerModal={triggerPriceGrabModal}
            />
            
            <DashboardPanel
              title="RAG-Service"
              description="Retrieval Augmented Generation service"
              icon={<DatabaseIcon size={24} />}
              color="bg-green-500"
              stats={{
                value: `${getProjectProgress('RAG-Service')}%`,
                label: "Progress"
              }}
              change={{
                value: "+8%",
                positive: true
              }}
              status="development"
              onPanelClick={handleRagClick}
              triggerModal={triggerRagModal}
            />
            
            <DashboardPanel
              title="GA Insights"
              description="Google Analytics insights dashboard"
              icon={<BarChart3Icon size={24} />}
              color="bg-purple-500"
              stats={{
                value: `${getProjectProgress('GA Insights')}%`,
                label: "Progress"
              }}
              change={{
                value: "+5%",
                positive: true
              }}
              status="testing"
              onPanelClick={handleGAInsightsClick}
              triggerModal={triggerGAInsightsModal}
            />
            
            <DashboardPanel
              title="Finance Automation"
              description="Financial process automation system"
              icon={<DollarSignIcon size={24} />}
              color="bg-emerald-500"
              stats={{
                value: `${getProjectProgress('Finance Automation')}%`,
                label: "Progress"
              }}
              change={{
                value: "+7%",
                positive: true
              }}
              status="development"
              onPanelClick={handleFinanceAutomationClick}
              triggerModal={triggerFinanceAutomationModal}
            />
            
            <DashboardPanel
              title="Data Warehouse"
              description="Data warehouse and ETL processes"
              icon={<DatabaseIcon size={24} />}
              color="bg-orange-500"
              stats={{
                value: `${getProjectProgress('Data Warehouse')}%`,
                label: "Progress"
              }}
              change={{
                value: "+3%",
                positive: true
              }}
              status="development"
              onPanelClick={handleDataWarehouseClick}
              triggerModal={triggerDataWarehouseModal}
            />
            
            <DashboardPanel
              title="HR Automation"
              description="Human resources process automation"
              icon={<UsersIcon size={24} />}
              color="bg-indigo-500"
              stats={{
                value: `${getProjectProgress('HR Automation')}%`,
                label: "Progress"
              }}
              change={{
                value: "+2%",
                positive: true
              }}
              status="development"
              onPanelClick={handleHRAutomationClick}
              triggerModal={triggerHRAutomationModal}
            />
            
            <DashboardPanel
              title="CX Agentic Framework"
              description="Customer experience agentic framework"
              icon={<MessageSquareIcon size={24} />}
              color="bg-teal-500"
              stats={{
                value: `${getProjectProgress('CX Agentic Framework')}%`,
                label: "Progress"
              }}
              change={{
                value: "+4%",
                positive: true
              }}
              status="development"
              onPanelClick={handleCXAgenticClick}
              triggerModal={triggerCXAgenticModal}
            />
            
            <DashboardPanel
              title="Integration - Agentic Framework"
              description="Integration agentic framework for CRM sync"
              icon={<DatabaseIcon size={24} />}
              color="bg-cyan-500"
              stats={{
                value: `${getProjectProgress('Integration - Agentic Framework')}%`,
                label: "Progress"
              }}
              change={{
                value: "+3%",
                positive: true
              }}
              status="development"
              onPanelClick={handleIntegrationAgenticClick}
              triggerModal={triggerIntegrationAgenticModal}
            />
          </div>
        </main>
      </div>
    </div>
  );
}