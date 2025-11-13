import { useState } from "react";
import {
  FaWallet,
  FaMoneyBillWave,
  FaChartLine,
  FaCalendar,
} from "react-icons/fa";

// Transaction type
interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  status: string;
  remarks: string;
}

// Dummy data for Petty Expense
const pettyExpenseTransactions: Transaction[] = [
  {
    id: "1",
    date: "2025-11-02",
    category: "Tea + Nasta",
    description: "Morning tea and snacks for office staff",
    amount: 350,
    status: "Approved",
    remarks: "Monthly expense",
  },
  {
    id: "2",
    date: "2025-11-03",
    category: "Petrol",
    description: "Vehicle fuel for delivery",
    amount: 2000,
    status: "Pending",
    remarks: "",
  },
  {
    id: "3",
    date: "2025-11-03",
    category: "Stationary",
    description: "Office supplies and printer paper",
    amount: 850,
    status: "Approved",
    remarks: "Urgent purchase",
  },
];

// Dummy data for Cash Tally
const cashTallyTransactions: Transaction[] = [
  {
    id: "4",
    date: "2025-11-01",
    category: "Cash Received",
    description: "Opening balance for the month",
    amount: 50000,
    status: "Approved",
    remarks: "Monthly opening",
  },
  {
    id: "5",
    date: "2025-11-05",
    category: "Client Payment",
    description: "Payment received from client XYZ",
    amount: 15000,
    status: "Approved",
    remarks: "Invoice #123",
  },
  {
    id: "6",
    date: "2025-11-06",
    category: "Salary Advance",
    description: "Advance payment to staff",
    amount: 5000,
    status: "Pending",
    remarks: "To be adjusted",
  },
];

// Transaction Table Component
function TransactionTable({ transactions, onDelete }: { transactions: Transaction[], onDelete: (id: string) => void }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Transaction History</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Description</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">Amount</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase">Status</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-800">{transaction.date}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{transaction.category}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{transaction.description}</td>
                <td className="px-4 py-3 text-sm text-right font-medium text-gray-800">
                  ₹{transaction.amount.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    transaction.status === 'Approved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"petty" | "tally">("petty");
  const [pettyTransactions, setPettyTransactions] = useState<Transaction[]>(pettyExpenseTransactions);
  const [tallyTransactions, setTallyTransactions] = useState<Transaction[]>(cashTallyTransactions);

  // Get current transactions based on active tab
  const currentTransactions = activeTab === "petty" ? pettyTransactions : tallyTransactions;

  // Petty Expense calculations
  const pettyOpeningBalance = 50000;
  const pettyTotalExpenses = pettyTransactions.reduce((sum, t) => sum + t.amount, 0);
  const pettyClosingBalance = pettyOpeningBalance - pettyTotalExpenses;
  const pettyMonthlyBudget = 75000;

  // Cash Tally calculations
  const tallyOpeningBalance = 50000;
  const tallyTotalExpenses = tallyTransactions.reduce((sum, t) => sum + t.amount, 0);
  const tallyClosingBalance = tallyOpeningBalance + tallyTotalExpenses;
  const tallyMonthlyBudget = 100000;

  const handleDeleteTransaction = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      if (activeTab === "petty") {
        setPettyTransactions(pettyTransactions.filter((t) => t.id !== id));
      } else {
        setTallyTransactions(tallyTransactions.filter((t) => t.id !== id));
      }
    }
  };

  // Calculate stats based on active tab
  const openingBalance = activeTab === "petty" ? pettyOpeningBalance : tallyOpeningBalance;
  const totalExpenses = activeTab === "petty" ? pettyTotalExpenses : tallyTotalExpenses;
  const closingBalance = activeTab === "petty" ? pettyClosingBalance : tallyClosingBalance;
  const monthlyBudget = activeTab === "petty" ? pettyMonthlyBudget : tallyMonthlyBudget;

  const totalTransactions = currentTransactions.length;
  const approvedTransactions = currentTransactions.filter((t) => t.status === "Approved").length;
  const pendingTransactions = currentTransactions.filter((t) => t.status === "Pending").length;
  const averageExpense = totalTransactions > 0 ? totalExpenses / totalTransactions : 0;

  const stats = [
    {
      title: "Opening Balance",
      value: openingBalance,
      icon: FaWallet,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
    },
    {
      title: activeTab === "petty" ? "Total Expenses" : "Total Amount",
      value: totalExpenses,
      icon: FaMoneyBillWave,
      color: "bg-red-500",
      textColor: "text-red-600",
      bgLight: "bg-red-50",
    },
    {
      title: "Closing Balance",
      value: closingBalance,
      icon: FaChartLine,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgLight: "bg-green-50",
    },
    {
      title: "Monthly Budget",
      value: monthlyBudget,
      icon: FaCalendar,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgLight: "bg-purple-50",
    },
    {
      title: "Total Transactions",
      value: totalTransactions,
      icon: FaMoneyBillWave,
      color: "bg-indigo-500",
      textColor: "text-indigo-600",
      bgLight: "bg-indigo-50",
    },
    {
      title: "Approved Transactions",
      value: approvedTransactions,
      icon: FaChartLine,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgLight: "bg-green-50",
    },
    {
      title: "Pending Transactions",
      value: pendingTransactions,
      icon: FaWallet,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      bgLight: "bg-yellow-50",
    },
    {
      title: "Avg Expense",
      value: Math.round(averageExpense),
      icon: FaCalendar,
      color: "bg-pink-500",
      textColor: "text-pink-600",
      bgLight: "bg-pink-50",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Toggle Buttons */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("petty")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === "petty"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Petty Expense
            </button>
            <button
              onClick={() => setActiveTab("tally")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === "tally"
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Cash Tally
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`${stat.bgLight} p-2 rounded-lg`}>
                      <Icon className={`${stat.textColor} text-xl`} />
                    </div>
                  </div>
                  <p className="text-xs font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-lg md:text-xl font-bold text-gray-800">
                    {formatCurrency(stat.value)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Transaction Table */}
          <TransactionTable
            transactions={currentTransactions}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </div>
    </div>
  );
}