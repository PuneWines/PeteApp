import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PettyCash from "./pages/PettyCash";
import CashTally from "./pages/CashTally";
import Reports from "./pages/Reports";
import TransactionHistory from "./pages/TransactionHistory";
import Sidebar from "./components/Sidebar";
import MobileSidebar from "./components/MobileSidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";

function MainApp() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Login />;
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Petty Cash Dashboard";
      case "petty-cash":
        return "Petty Cash Management";
      case "cash-tally":
        return "Cash Tally";
      case "reports":
        return "Reports & Analytics";
      case "transaction-history":
        return "Transaction History";
      default:
        return "Petty Cash System";
    }
  };

  const renderPage = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "petty-cash":
        return <PettyCash onClose={() => setActiveTab('transaction-history')} />;
      case "cash-tally":
        return <CashTally onClose={() => setActiveTab("dashboard")} />;
      case "cash-tally-1":
        return <CashTally onClose={() => setActiveTab("dashboard")} counter={1} />;
      case "cash-tally-2":
        return <CashTally onClose={() => setActiveTab("dashboard")} counter={2} />;
      case "cash-tally-3":
        return <CashTally onClose={() => setActiveTab("dashboard")} counter={3} />;
      case "reports":
        return <Reports />;
      case "transaction-history":
        return <TransactionHistory />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <MobileSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="lg:ml-64">
        <Header
          title={getPageTitle()}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
        />
        <main className="p-4 pb-20 md:p-6">{renderPage()}</main>
      </div>
      

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
