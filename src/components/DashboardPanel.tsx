import React, { useState, useEffect } from 'react';
import { TrendingUpIcon, TrendingDownIcon, MoreVerticalIcon, XIcon } from 'lucide-react';
import { StaticApiService as ApiService } from '../services/staticApi';
type Status = 'development' | 'testing' | 'implemented' | 'uat';
interface DashboardPanelProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  stats: {
    value: string;
    label: string;
  };
  change: {
    value: string;
    positive: boolean;
  };
  status?: Status;
  onPanelClick?: () => void;
  triggerModal?: boolean;
}
export function DashboardPanel({
  title,
  description,
  icon,
  color,
  stats,
  change,
  status = 'development',
  onPanelClick,
  triggerModal = false
}: DashboardPanelProps) {
  const [currentStatus, setCurrentStatus] = useState<Status>(status);
  const [showDetails, setShowDetails] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleStatusClick = () => {
    // Cycle through statuses: development -> testing -> implemented -> development
    if (currentStatus === 'development') {
      setCurrentStatus('testing');
    } else if (currentStatus === 'testing') {
      setCurrentStatus('implemented');
    } else {
      setCurrentStatus('development');
    }
  };
  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'development':
        return 'bg-red-500';
      case 'testing':
        return 'bg-amber-500';
      case 'implemented':
        return 'bg-green-500';
      case 'uat':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  const getStatusText = (status: Status) => {
    switch (status) {
      case 'development':
        return 'Development';
      case 'testing':
        return 'Testing';
      case 'implemented':
        return 'Implemented';
      case 'uat':
        return 'UAT';
      default:
        return 'Unknown';
    }
  };

  // Watch for triggerModal prop to open modal from outside
  useEffect(() => {
    if (triggerModal && !showDetails) {
      setShowDetails(true);
    }
  }, [triggerModal, showDetails]);

  // Fetch project data when modal opens
  useEffect(() => {
    if (showDetails && (title === 'Price Grab' || title === 'RAG-Service' || title === 'GA Insights' || title === 'Finance Automation' || title === 'Data Warehouse' || title === 'HR Automation' || title === 'CX Agentic Framework' || title === 'Integration - Agentic Framework') && !projectData) {
      const fetchProjectSynopsisData = async () => {
        setIsLoading(true);
        try {
          const data = await ApiService.getProjectSynopsisData();
          if (data && data.length > 0) {
            // Find the specific project based on title
            let targetProject = null;
            if (title === 'Price Grab') {
              targetProject = data.find(project => 
                project.project_name.toLowerCase().includes('price') || 
                project.project_name.toLowerCase().includes('pricing') ||
                project.project_name.toLowerCase().includes('competitive')
              );
            } else if (title === 'RAG-Service') {
              targetProject = data.find(project => 
                project.project_name.toLowerCase().includes('rag') || 
                project.project_name.toLowerCase().includes('retrieval') ||
                project.project_name.toLowerCase().includes('generation')
              );
            } else if (title === 'GA Insights') {
              targetProject = data.find(project => 
                project.project_name.toLowerCase().includes('ga') || 
                project.project_name.toLowerCase().includes('insights') ||
                project.project_name.toLowerCase().includes('analytics') ||
                project.project_name.toLowerCase().includes('google')
              );
            } else if (title === 'Finance Automation') {
              targetProject = data.find(project => 
                project.project_name.toLowerCase() === 'finance automation' ||
                project.project_name.toLowerCase().includes('finance automation')
              );
            } else if (title === 'Data Warehouse') {
              targetProject = data.find(project => 
                project.project_name.toLowerCase() === 'data warehouse' ||
                project.project_name.toLowerCase().includes('data warehouse') ||
                project.project_name.toLowerCase().includes('datawarehouse')
              );
            } else if (title === 'HR Automation') {
              targetProject = data.find(project => 
                project.project_name.toLowerCase() === 'hr automation' ||
                project.project_name.toLowerCase().includes('hr automation')
              );
            } else if (title === 'CX Agentic Framework') {
              targetProject = data.find(project => 
                project.project_name.toLowerCase().includes('cx') || 
                project.project_name.toLowerCase().includes('agentic') ||
                project.project_name.toLowerCase().includes('framework')
              );
            } else if (title === 'Integration - Agentic Framework') {
              targetProject = data.find(project => 
                project.project_name.toLowerCase().includes('integration') || 
                project.project_name.toLowerCase().includes('agentic') ||
                project.project_name.toLowerCase().includes('framework')
              );
            }
            
            // If specific project not found, use the first one
            setProjectData(targetProject || data[0]);
          }
        } catch (error) {
          console.error('Error fetching Project Synopsis data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchProjectSynopsisData();
    }
  }, [showDetails, title, projectData]);

  const getProjectDetails = (title: string) => {
    if (title === 'Price Grab' && projectData) {
      return {
        title: projectData.project_name || 'Competitive Pricing Analysis',
        purpose: projectData.purpose || 'The software aggregates and compares prices from Amazon, Flipkart, Croma, and Reliance to optimize pricing strategies for enhanced marketability.',
        actionableData: projectData.actionable_data || 'Provides real-time price comparisons, competitor pricing trends, and demand fluctuations to inform dynamic pricing decisions.',
        goLiveDate: projectData.go_live_date || 'Scheduled for August 16, 2025.',
        contactPoints: projectData.contact_points || 'Nishant or Ganesh from Customer Capital; Dr. Venkat, Owner from Shepardtri.',
        challenges: projectData.challenges || 'Overcomes Amazon\'s bot detection algorithms using IP rotation and CAPTCHA-solving techniques to discreetly scrape prices.',
        status: projectData.notes || 'Proposal submitted and pending approval.',
        dateUpdated: projectData.date_updated || '06/08/2025'
      };
    }
    if (title === 'RAG-Service' && projectData) {
      return {
        title: projectData.project_name || 'Retrieval Augmented Generation (RAG-Service)',
        purpose: projectData.purpose || 'The RAG-Service enables users to upload PDF, Word, text, Excel, or PowerPoint documents and query their content for enhanced information retrieval and analysis.',
        actionableData: projectData.actionable_data || 'Provides accurate, context-aware responses to user queries based on document content, facilitating informed decision-making.',
        goLiveDate: projectData.go_live_date || 'Scheduled for Monday, August 11, 2025.',
        contactPoints: projectData.contact_points || 'Kushal from Customer Capital; Dr. Venkat from Shepardtri.',
        challenges: projectData.challenges || 'Achieves accuracies above 95%, with additional testing required to ensure reliability.',
        status: projectData.notes || 'Proposal submitted and pending approval.',
        dateUpdated: projectData.date_updated || '06/08/2025'
      };
    }
    if (title === 'GA Insights' && projectData) {
      return {
        title: projectData.project_name || 'GA Insights',
        purpose: projectData.purpose || 'The GA Insights dashboard provides comprehensive analytics and insights from Google Analytics data to enable data-driven decision making and performance optimization.',
        actionableData: projectData.actionable_data || 'Delivers real-time analytics, user behavior insights, conversion tracking, and performance metrics to optimize business strategies and marketing campaigns.',
        goLiveDate: projectData.go_live_date || 'Scheduled for September 1, 2025.',
        contactPoints: projectData.contact_points || 'Sakthi from Customer Capital; Dr. Venkat from Shepardtri.',
        challenges: projectData.challenges || 'Integration with multiple GA properties and ensuring data accuracy across different time zones and user segments.',
        status: projectData.notes || 'Currently in testing phase with beta users.',
        dateUpdated: projectData.date_updated || '06/08/2025'
      };
    }
    if (title === 'Finance Automation' && projectData) {
      return {
        title: projectData.project_name || 'Finance Automation',
        purpose: projectData.purpose || 'Automate the calculations being done for HDFC using manual excel macros to maintain vendor cost master, MOP and selling margins to assist in sales and margin reporting and revenue tracking (sales/refunds).',
        actionableData: projectData.actionable_data || 'Implement automation to capture the various input sources like FYND report, Payment Gateway report, Vendor cost master, Mark up master and provide auto calculations for various reports.',
        goLiveDate: projectData.go_live_date || 'Scheduled for October 15, 2025.',
        contactPoints: projectData.contact_points || 'Uma from Customer Capital; Dr. Venkat from Shepardtri.',
        challenges: projectData.challenges || 'Integration with multiple financial systems and ensuring data accuracy across different payment gateways.',
        status: projectData.notes || 'Currently in development phase with HDFC team.',
        dateUpdated: projectData.date_updated || '06/08/2025'
      };
    }
    if (title === 'Data Warehouse' && projectData) {
      return {
        title: projectData.project_name || 'Data Warehouse',
        purpose: projectData.purpose || 'Streamline and consolidate multiple segments and sources of sales and input data for understanding and deriving better sales insights to grow and run business better.',
        actionableData: projectData.actionable_data || 'Setup of pipelines to ingest data from various sources and setup ETL processes to transform the data into a more insight driven format. To assist business to drive more revenue growth.',
        goLiveDate: projectData.go_live_date || 'Scheduled for November 1, 2025.',
        contactPoints: projectData.contact_points || 'Abhinav from Customer Capital; Dr. Venkat from Shepardtri.',
        challenges: projectData.challenges || 'Integration with multiple data sources and ensuring data quality across different systems.',
        status: projectData.notes || 'Currently in development phase with data architecture team.',
        dateUpdated: projectData.date_updated || '06/08/2025'
      };
    }
    if (title === 'HR Automation' && projectData) {
      return {
        title: projectData.project_name || 'HR Automation',
        purpose: projectData.purpose || 'Provide Agentic support for L1 screening and parsing of resume to help shortlist interview candidates for recruitment.',
        actionableData: projectData.actionable_data || 'Agent to provide facility to generate Job Descriptions for various roles and implement a mathematical model to calculate the profile fitment score against the job posting.',
        goLiveDate: projectData.go_live_date || 'Scheduled for December 1, 2025.',
        contactPoints: projectData.contact_points || 'Denesh from Customer Capital; Dr. Venkat from Shepardtri.',
        challenges: projectData.challenges || 'Integration with multiple HR systems and ensuring accurate candidate screening.',
        status: projectData.notes || 'Currently in development phase with HR team.',
        dateUpdated: projectData.date_updated || '06/08/2025'
      };
    }
    if (title === 'CX Agentic Framework' && projectData) {
      return {
        title: projectData.project_name || 'CX Agentic Framework',
        purpose: projectData.purpose || 'Boost productivity for CX Agents on ground by having customer CRM data accessible easily and faster',
        actionableData: projectData.actionable_data || 'Provide an integrated UI to the CX Agent on ground to simplify the way to identify the originating customer and retrieve their respective transactional data without searching across multiple portals',
        goLiveDate: projectData.go_live_date || 'Scheduled for January 15, 2026.',
        contactPoints: projectData.contact_points || 'CC - Nishit Gandhi ; ST - Deva / Abhinav',
        challenges: projectData.challenges || 'Integration with multiple CRM systems and ensuring data accuracy across different platforms.',
        status: projectData.notes || 'Initial risk and requirement scoping in progress',
        dateUpdated: projectData.date_updated || '06/08/2025'
      };
    }
    if (title === 'Integration - Agentic Framework' && projectData) {
      return {
        title: projectData.project_name || 'Integration - Agentic Framework',
        purpose: projectData.purpose || 'Sync ticket information across bank SFDC platform and V-Tiger CRM',
        actionableData: projectData.actionable_data || 'Provide a way for the CX agent to reconcile and monitor the daily ticket and update summary with bank',
        goLiveDate: projectData.go_live_date || 'Scheduled for February 1, 2026.',
        contactPoints: projectData.contact_points || 'CC - Nishit Gandhi ; ST - Thawpeek / Abhinav',
        challenges: projectData.challenges || 'Integration with multiple CRM platforms and ensuring data synchronization accuracy.',
        status: projectData.notes || 'Proposal to be submitted post initial feasibility check',
        dateUpdated: projectData.date_updated || '06/08/2025'
      };
    }
    return null;
  };
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div 
            className={`p-3 rounded-lg ${color} cursor-pointer hover:opacity-80 transition-opacity`}
            onClick={onPanelClick}
          >
            <div className="text-white">{icon}</div>
          </div>
          <button 
            className="text-gray-400 hover:text-gray-600"
            onClick={() => setShowDetails(true)}
          >
            <MoreVerticalIcon size={18} />
          </button>
        </div>
        <h3 className="font-semibold text-lg text-gray-800 mb-1">{title}</h3>
        <p className="text-gray-500 text-sm mb-4">{description}</p>
        <button onClick={handleStatusClick} className="mb-4 flex items-center gap-2">
          <span className={`inline-block w-3 h-3 rounded-full ${getStatusColor(currentStatus)}`}></span>
          <span className="text-sm font-medium text-gray-700">
            Status: {getStatusText(currentStatus)}
          </span>
        </button>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-800">
              {stats.value}
            </div>
            <div className="text-xs text-gray-500 mt-1">{stats.label}</div>
          </div>
          <div className={`flex items-center ${change.positive ? 'text-green-500' : 'text-red-500'}`}>
            {change.positive ? <TrendingUpIcon size={16} /> : <TrendingDownIcon size={16} />}
            <span className="ml-1 text-sm font-medium">{change.value}</span>
          </div>
        </div>
      </div>
      <div className={`h-1 w-full ${color}`}></div>
    </div>
    
    {/* Project Details Modal */}
    {showDetails && (getProjectDetails(title) || ((title === 'Price Grab' || title === 'RAG-Service' || title === 'GA Insights' || title === 'Finance Automation' || title === 'Data Warehouse' || title === 'HR Automation' || title === 'CX Agentic Framework' || title === 'Integration - Agentic Framework') && isLoading)) && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {isLoading ? 'Loading...' : getProjectDetails(title)?.title}
              </h2>
              <div className="flex gap-2">
                {(title === 'Price Grab' || title === 'RAG-Service' || title === 'GA Insights' || title === 'Finance Automation' || title === 'Data Warehouse' || title === 'HR Automation' || title === 'CX Agentic Framework' || title === 'Integration - Agentic Framework') && (
                  <button 
                    onClick={() => {
                      setProjectData(null); // Clear cached data
                      setIsLoading(true);
                      // Re-fetch data
                      ApiService.getProjectSynopsisData().then(data => {
                        if (data && data.length > 0) {
                          // Find the specific project based on title
                          let targetProject = null;
                          if (title === 'Price Grab') {
                            targetProject = data.find(project => 
                              project.project_name.toLowerCase().includes('price') || 
                              project.project_name.toLowerCase().includes('pricing') ||
                              project.project_name.toLowerCase().includes('competitive')
                            );
                          } else if (title === 'RAG-Service') {
                            targetProject = data.find(project => 
                              project.project_name.toLowerCase().includes('rag') || 
                              project.project_name.toLowerCase().includes('retrieval') ||
                              project.project_name.toLowerCase().includes('generation')
                            );
                          } else if (title === 'GA Insights') {
                            targetProject = data.find(project => 
                              project.project_name.toLowerCase().includes('ga') || 
                              project.project_name.toLowerCase().includes('insights') ||
                              project.project_name.toLowerCase().includes('analytics') ||
                              project.project_name.toLowerCase().includes('google')
                            );
                          } else if (title === 'Finance Automation') {
                            targetProject = data.find(project => 
                              project.project_name.toLowerCase() === 'finance automation' ||
                              project.project_name.toLowerCase().includes('finance automation')
                            );
                          } else if (title === 'Data Warehouse') {
                            targetProject = data.find(project => 
                              project.project_name.toLowerCase() === 'data warehouse' ||
                              project.project_name.toLowerCase().includes('data warehouse') ||
                              project.project_name.toLowerCase().includes('datawarehouse')
                            );
                          } else if (title === 'HR Automation') {
                            targetProject = data.find(project => 
                              project.project_name.toLowerCase() === 'hr automation' ||
                              project.project_name.toLowerCase().includes('hr automation')
                            );
                          } else if (title === 'CX Agentic Framework') {
                            targetProject = data.find(project => 
                              project.project_name.toLowerCase().includes('cx') || 
                              project.project_name.toLowerCase().includes('agentic') ||
                              project.project_name.toLowerCase().includes('framework')
                            );
                          } else if (title === 'Integration - Agentic Framework') {
                            targetProject = data.find(project => 
                              project.project_name.toLowerCase().includes('integration') || 
                              project.project_name.toLowerCase().includes('agentic') ||
                              project.project_name.toLowerCase().includes('framework')
                            );
                          }
                          
                          // If specific project not found, use the first one
                          setProjectData(targetProject || data[0]);
                        }
                        setIsLoading(false);
                      }).catch(error => {
                        console.error('Error refreshing Project Synopsis data:', error);
                        setIsLoading(false);
                      });
                    }}
                    disabled={isLoading}
                    className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                      isLoading 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                    title="Refresh data from database"
                  >
                    {isLoading ? '⏳' : '🔄'}
                  </button>
                )}
                <button 
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <XIcon size={24} />
                </button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading project details...</span>
              </div>
            ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Purpose</h3>
                <p className="text-gray-600 leading-relaxed">
                  {getProjectDetails(title)?.purpose}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Actionable Data</h3>
                <p className="text-gray-600 leading-relaxed">
                  {getProjectDetails(title)?.actionableData}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Go-Live Date</h3>
                <p className="text-gray-600">
                  {getProjectDetails(title)?.goLiveDate}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Contact Points</h3>
                <p className="text-gray-600">
                  {getProjectDetails(title)?.contactPoints}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Challenges</h3>
                <p className="text-gray-600 leading-relaxed">
                  {getProjectDetails(title)?.challenges}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Status</h3>
                <p className="text-gray-600">
                  {getProjectDetails(title)?.status}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Date Updated</h3>
                <p className="text-blue-800 font-medium">
                  {getProjectDetails(title)?.dateUpdated}
                </p>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}