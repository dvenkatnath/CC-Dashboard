import React, { useState } from 'react';
import { TrendingUpIcon, TrendingDownIcon, MoreVerticalIcon, XIcon } from 'lucide-react';
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
}
export function DashboardPanel({
  title,
  description,
  icon,
  color,
  stats,
  change,
  status = 'development',
  onPanelClick
}: DashboardPanelProps) {
  const [currentStatus, setCurrentStatus] = useState<Status>(status);
  const [showDetails, setShowDetails] = useState(false);
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

  const getProjectDetails = (title: string) => {
    if (title === 'Price Grab') {
      return {
        title: 'Competitive Pricing Analysis',
        purpose: 'The software aggregates and compares prices from Amazon, Flipkart, Croma, and Reliance to optimize pricing strategies for enhanced marketability.',
        actionableData: 'Provides real-time price comparisons, competitor pricing trends, and demand fluctuations to inform dynamic pricing decisions.',
        goLiveDate: 'Scheduled for August 16, 2025.',
        contactPoints: 'Nishant or Ganesh from Customer Capital; Dr. Venkat, Owner from Shepardtri.',
        challenges: 'Overcomes Amazon\'s bot detection algorithms using IP rotation and CAPTCHA-solving techniques to discreetly scrape prices.',
        status: 'Proposal submitted and pending approval.'
      };
    }
    if (title === 'RAG-Service') {
      return {
        title: 'Retrieval Augmented Generation (RAG-Service)',
        purpose: 'The RAG-Service enables users to upload PDF, Word, text, Excel, or PowerPoint documents and query their content for enhanced information retrieval and analysis.',
        actionableData: 'Provides accurate, context-aware responses to user queries based on document content, facilitating informed decision-making.',
        goLiveDate: 'Scheduled for Monday, August 11, 2025.',
        contactPoints: 'Kushal from Customer Capital; Dr. Venkat from Shepardtri.',
        challenges: 'Achieves accuracies above 95%, with additional testing required to ensure reliability.',
        status: 'Proposal submitted and pending approval.'
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
    {showDetails && getProjectDetails(title) && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {getProjectDetails(title)?.title}
              </h2>
              <button 
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <XIcon size={24} />
              </button>
            </div>
            
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
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}