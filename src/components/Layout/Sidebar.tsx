import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Shield, 
  Users, 
  FileText, 
  Settings, 
  Activity,
  Bell,
  ChevronRight,
  Smartphone,
  Package
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Shield, label: 'Policy Management', path: '/policies' },
  { icon: Users, label: 'User Management', path: '/users' },
  { icon: Smartphone, label: 'Device Management', path: '/devices' },
  { icon: Package, label: 'App Management', path: '/apps' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: Activity, label: 'Activity Log', path: '/activity' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">M365 Admin</h1>
            <p className="text-sm text-gray-500">Control Center</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200 mt-auto">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <Bell className="w-5 h-5" />
            <span className="font-medium">System Status</span>
          </div>
          <p className="text-sm opacity-90">All systems operational</p>
          <div className="mt-2 flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs">Connected to M365</span>
          </div>
        </div>
      </div>
    </div>
  );
};