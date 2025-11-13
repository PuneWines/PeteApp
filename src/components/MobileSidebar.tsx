import {
  FaHome,
  FaFileInvoice,
  FaMoneyBillWave,
  FaChartBar,
  FaTimes,
  FaSignOutAlt,
  FaHistory,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { useState } from 'react';

interface MobileSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({
  activeTab,
  onTabChange,
  isOpen,
  onClose,
}: MobileSidebarProps) {
  const { logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  const menuItems = [
    { id: "dashboard", icon: FaHome, label: "Dashboard" },
    { id: "petty-cash", icon: FaFileInvoice, label: "Petty Cash Form" },
    { id: "cash-tally", icon: FaMoneyBillWave, label: "Cash Tally", hasSubmenu: true },
    { id: "reports", icon: FaChartBar, label: "Reports" },
    { id: "transaction-history", icon: FaHistory, label: "Transaction History" },
  ];

  const submenuItems = [
    { id: "cash-tally-1", label: "Counter 1", parent: "cash-tally" },
    { id: "cash-tally-2", label: "Counter 2", parent: "cash-tally" },
    { id: "cash-tally-3", label: "Counter 3", parent: "cash-tally" },
  ];

  const handleTabClick = (tab: string) => {
    onTabChange(tab);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 lg:hidden transform transition-transform duration-300">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#2a5298] p-3 rounded-lg">
              <FaMoneyBillWave className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Petty Cash</h1>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isExpanded = expandedMenus[item.id];
              return (
                <div key={item.id}>
                  <button
                    onClick={() => item.hasSubmenu ? toggleMenu(item.id) : handleTabClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-[#2a5298] text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span className="font-medium flex-1 text-left">{item.label}</span>
                    {item.hasSubmenu && (
                      isExpanded ? <FaChevronDown className="text-sm" /> : <FaChevronRight className="text-sm" />
                    )}
                  </button>
                  {item.hasSubmenu && isExpanded && (
                    <ul className="ml-8 mt-1 space-y-1">
                      {submenuItems.filter(sub => sub.parent === item.id).map((subItem) => (
                        <li key={subItem.id}>
                          <button
                            onClick={() => handleTabClick(subItem.id)}
                            className={`w-full flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                              activeTab === subItem.id
                                ? "bg-[#2a5298] text-white shadow-md"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {subItem.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
