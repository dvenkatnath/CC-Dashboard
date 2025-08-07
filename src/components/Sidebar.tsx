import React from 'react';
import { LayoutDashboardIcon, BarChart3Icon, SearchIcon, DatabaseIcon, MessageSquareIcon, DollarSignIcon, UsersIcon, SettingsIcon, HelpCircleIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  onPriceGrabClick?: () => void;
  onRagClick?: () => void;
  onGAInsightsClick?: () => void;
  onFinanceAutomationClick?: () => void;
  onDataWarehouseClick?: () => void;
  onHRAutomationClick?: () => void;
  onCXAgenticClick?: () => void;
  onIntegrationAgenticClick?: () => void;
  onDataTalkClick?: () => void;
}
export function Sidebar({
  isCollapsed,
  toggleSidebar,
  onPriceGrabClick,
  onRagClick,
  onGAInsightsClick,
  onFinanceAutomationClick,
  onDataWarehouseClick,
  onHRAutomationClick,
  onCXAgenticClick,
  onIntegrationAgenticClick,
  onDataTalkClick
}: SidebarProps) {
  const menuItems = [{
    icon: <LayoutDashboardIcon size={20} />,
    label: 'Dashboard',
    active: true
  }, {
    icon: <SearchIcon size={20} />,
    label: 'Price Grab',
    onClick: onPriceGrabClick
  }, {
    icon: <BarChart3Icon size={20} />,
    label: 'GA Insights',
    onClick: onGAInsightsClick
  }, {
    icon: <DatabaseIcon size={20} />,
    label: 'RAG-Service',
    onClick: onRagClick
  }, {
    icon: <MessageSquareIcon size={20} />,
    label: 'dataTalk',
    onClick: onDataTalkClick
  }, {
    icon: <DollarSignIcon size={20} />,
    label: 'Fin Automation',
    onClick: onFinanceAutomationClick
  }, {
    icon: <DatabaseIcon size={20} />,
    label: 'Data Warehouse',
    onClick: onDataWarehouseClick
  }, {
    icon: <UsersIcon size={20} />,
    label: 'HR Automation',
    onClick: onHRAutomationClick
  }, {
    icon: <MessageSquareIcon size={20} />,
    label: 'CX Agentic Framework',
    onClick: onCXAgenticClick
  }, {
    icon: <DatabaseIcon size={20} />,
    label: 'Integration - Agentic Framework',
    onClick: onIntegrationAgenticClick
  }, {
    icon: <SettingsIcon size={20} />,
    label: 'Settings'
  }, {
    icon: <HelpCircleIcon size={20} />,
    label: 'Help'
  }];
  return <aside className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && <div className="flex items-center gap-2">
          <img src="/CC3-bg.png" alt="Customer Capital Logo" className="h-12 w-auto" />
          <span className="font-bold text-xl text-gray-800">Customer Capital</span>
        </div>}
        <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
          {isCollapsed ? <ChevronRightIcon size={20} /> : <ChevronLeftIcon size={20} />}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => <li key={index}>
              <a 
                href="#" 
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${item.active ? 'bg-blue-50 text-blue-600' : ''}`}
                onClick={item.onClick}
              >
                <span className="text-gray-500">{item.icon}</span>
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </a>
            </li>)}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
            ST
          </div>
          {!isCollapsed && <div className="ml-3">
              <div className="font-medium text-sm">Shepardtri</div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>}
        </div>
      </div>
    </aside>;
}