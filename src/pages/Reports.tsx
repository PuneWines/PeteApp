// import { useState } from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Pie, Line } from "react-chartjs-2";
// import {
//   FaFilePdf,
//   FaFileExcel,
//   FaChartPie,
//   FaChartLine,
// } from "react-icons/fa";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// export default function Reports() {
//   const [dateFrom, setDateFrom] = useState("2025-11-01");
//   const [dateTo, setDateTo] = useState("2025-11-04");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [cashTally, setCashTally] = useState("total");
//   const [pettyCash, setPettyCash] = useState("daily");

//   const pieChartData = {
//     labels: [
//       "Tea + Nasta",
//       "Petrol",
//       "Stationary",
//       "Light Bill",
//       "Office Supplies",
//     ],
//     datasets: [
//       {
//         label: "Expenses by Category",
//         data: [3500, 8000, 4200, 2800, 1500],
//         backgroundColor: [
//           "rgba(42, 82, 152, 0.8)",
//           "rgba(239, 68, 68, 0.8)",
//           "rgba(59, 130, 246, 0.8)",
//           "rgba(251, 191, 36, 0.8)",
//           "rgba(16, 185, 129, 0.8)",
//         ],
//         borderColor: [
//           "rgba(42, 82, 152, 1)",
//           "rgba(239, 68, 68, 1)",
//           "rgba(59, 130, 246, 1)",
//           "rgba(251, 191, 36, 1)",
//           "rgba(16, 185, 129, 1)",
//         ],
//         borderWidth: 2,
//       },
//     ],
//   };

//   const lineChartData = {
//     labels: ["Nov 1", "Nov 2", "Nov 3", "Nov 4"],
//     datasets: [
//       {
//         label: "Daily Expenses",
//         data: [2500, 3800, 4200, 3200],
//         borderColor: "rgba(42, 82, 152, 1)",
//         backgroundColor: "rgba(42, 82, 152, 0.1)",
//         tension: 0.4,
//         fill: true,
//         pointRadius: 6,
//         pointHoverRadius: 8,
//         pointBackgroundColor: "rgba(42, 82, 152, 1)",
//         pointBorderColor: "#fff",
//         pointBorderWidth: 2,
//       },
//     ],
//   };

//   const pieOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "bottom" as const,
//         labels: {
//           padding: 20,
//           font: {
//             size: 12,
//             family: "'Segoe UI', sans-serif",
//           },
//         },
//       },
//       tooltip: {
//         callbacks: {
//           label: function (context: any) {
//             const label = context.label || "";
//             const value = context.parsed || 0;
//             return `${label}: ₹${value.toLocaleString("en-IN")}`;
//           },
//         },
//       },
//     },
//   };

//   const lineOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       tooltip: {
//         callbacks: {
//           label: function (context: any) {
//             return `Expenses: ₹${context.parsed.y.toLocaleString("en-IN")}`;
//           },
//         },
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: {
//           callback: function (value: any) {
//             return "₹" + value.toLocaleString("en-IN");
//           },
//         },
//       },
//     },
//   };

//   const handleExportPDF = () => {
//     alert("Exporting report as PDF...");
//   };

//   const handleExportExcel = () => {
//     alert("Exporting report as Excel...");
//   };

//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <h2 className="text-xl font-bold text-gray-800 mb-4">Filter Options</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               From Date
//             </label>
//             <input
//               type="date"
//               value={dateFrom}
//               onChange={(e) => setDateFrom(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               To Date
//             </label>
//             <input
//               type="date"
//               value={dateTo}
//               onChange={(e) => setDateTo(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Category
//             </label>
//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent"
//             >
//               <option value="all">All Categories</option>
//               <option value="tea">Tea + Nasta</option>
//               <option value="petrol">Petrol</option>
//               <option value="stationary">Stationary</option>
//               <option value="light">Light Bill</option>
//               <option value="office">Office Supplies</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Cash Tally
//             </label>
//             <select
//               value={cashTally}
//               onChange={(e) => setCashTally(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent"
//             >
//               <option value="total">Total</option>
//               <option value="breakdown">Breakdown</option>
//               <option value="summary">Summary</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Petty Cash
//             </label>
//             <select
//               value={pettyCash}
//               onChange={(e) => setPettyCash(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent"
//             >
//               <option value="daily">Daily</option>
//               <option value="weekly">Weekly</option>
//               <option value="monthly">Monthly</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="bg-blue-100 p-2 rounded-lg">
//               <FaChartPie className="text-[#2a5298] text-xl" />
//             </div>
//             <div>
//               <h3 className="text-lg font-bold text-gray-800">
//                 Expense by Category
//               </h3>
//               <p className="text-sm text-gray-600">Distribution of expenses</p>
//             </div>
//           </div>
//           <div className="h-[300px] md:h-[350px]">
//             <Pie data={pieChartData} options={pieOptions} />
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="bg-green-100 p-2 rounded-lg">
//               <FaChartLine className="text-green-600 text-xl" />
//             </div>
//             <div>
//               <h3 className="text-lg font-bold text-gray-800">
//                 Daily Expense Trend
//               </h3>
//               <p className="text-sm text-gray-600">Expenses over time</p>
//             </div>
//           </div>
//           <div className="h-[300px] md:h-[350px]">
//             <Line data={lineChartData} options={lineOptions} />
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//           <div>
//             <h3 className="text-lg font-bold text-gray-800">Export Reports</h3>
//             <p className="text-sm text-gray-600 mt-1">
//               Download your reports in various formats
//             </p>
//           </div>
//           <div className="flex flex-wrap gap-3">
//             <button
//               onClick={handleExportPDF}
//               className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
//             >
//               <FaFilePdf />
//               Export PDF
//             </button>
//             <button
//               onClick={handleExportExcel}
//               className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
//             >
//               <FaFileExcel />
//               Export Excel
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <h3 className="text-lg font-bold text-gray-800 mb-4">
//           Summary Statistics
//         </h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
//             <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
//             <p className="text-2xl font-bold text-blue-700">₹20,000</p>
//           </div>
//           <div className="p-4 bg-green-50 rounded-lg border border-green-200">
//             <p className="text-sm text-gray-600 mb-1">Avg. Daily</p>
//             <p className="text-2xl font-bold text-green-700">₹5,000</p>
//           </div>
//           <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
//             <p className="text-sm text-gray-600 mb-1">Highest Day</p>
//             <p className="text-2xl font-bold text-yellow-700">₹8,000</p>
//           </div>
//           <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
//             <p className="text-sm text-gray-600 mb-1">Categories</p>
//             <p className="text-2xl font-bold text-purple-700">5</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import {
  FaFilePdf,
  FaFileExcel,
  FaChartPie,
  FaChartLine,
} from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Reports() {
  const [dateFrom, setDateFrom] = useState("2025-11-01");
  const [dateTo, setDateTo] = useState("2025-11-04");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cashType, setCashType] = useState("petty"); // New state for Petty/Tally Cash
  const [cashTally, setCashTally] = useState("total");
  const [pettyCash, setPettyCash] = useState("daily");

  // Petty Cash Data
  const pettyCashData = {
    pieChart: {
      labels: ["Tea + Nasta", "Petrol", "Stationary", "Light Bill", "Office Supplies"],
      values: [3500, 8000, 4200, 2800, 1500],
    },
    lineChart: {
      labels: ["Nov 1", "Nov 2", "Nov 3", "Nov 4"],
      values: [2500, 3800, 4200, 3200],
    },
    summary: {
      total: 20000,
      avgDaily: 5000,
      highest: 8000,
      categories: 5,
    },
  };

  // Tally Cash Data
  const tallyCashData = {
    pieChart: {
      labels: ["Salary", "Rent", "Equipment", "Marketing", "Miscellaneous"],
      values: [45000, 25000, 15000, 12000, 8000],
    },
    lineChart: {
      labels: ["Nov 1", "Nov 2", "Nov 3", "Nov 4"],
      values: [22000, 28000, 26000, 29000],
    },
    summary: {
      total: 105000,
      avgDaily: 26250,
      highest: 45000,
      categories: 5,
    },
  };

  // Select data based on cash type
  const currentData = cashType === "petty" ? pettyCashData : tallyCashData;

  const pieChartData = {
    labels: currentData.pieChart.labels,
    datasets: [
      {
        label: "Expenses by Category",
        data: currentData.pieChart.values,
        backgroundColor: [
          "rgba(42, 82, 152, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(16, 185, 129, 0.8)",
        ],
        borderColor: [
          "rgba(42, 82, 152, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(251, 191, 36, 1)",
          "rgba(16, 185, 129, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const lineChartData = {
    labels: currentData.lineChart.labels,
    datasets: [
      {
        label: "Daily Expenses",
        data: currentData.lineChart.values,
        borderColor: "rgba(42, 82, 152, 1)",
        backgroundColor: "rgba(42, 82, 152, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "rgba(42, 82, 152, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          font: {
            size: 12,
            family: "'Segoe UI', sans-serif",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.parsed || 0;
            return `${label}: ₹${value.toLocaleString("en-IN")}`;
          },
        },
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `Expenses: ₹${context.parsed.y.toLocaleString("en-IN")}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return "₹" + value.toLocaleString("en-IN");
          },
        },
      },
    },
  };

  const handleExportPDF = () => {
    alert("Exporting report as PDF...");
  };

  const handleExportExcel = () => {
    alert("Exporting report as Excel...");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Filter Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cash Type
            </label>
            <select
              value={cashType}
              onChange={(e) => setCashType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent font-semibold"
            >
              <option value="petty">Petty Cash</option>
              <option value="tally">Tally Cash</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {cashType === "petty" ? (
                <>
                  <option value="tea">Tea + Nasta</option>
                  <option value="petrol">Petrol</option>
                  <option value="stationary">Stationary</option>
                  <option value="light">Light Bill</option>
                  <option value="office">Office Supplies</option>
                </>
              ) : (
                <>
                  <option value="salary">Salary</option>
                  <option value="rent">Rent</option>
                  <option value="equipment">Equipment</option>
                  <option value="marketing">Marketing</option>
                  <option value="misc">Miscellaneous</option>
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              View Type
            </label>
            <select
              value={cashType === "petty" ? pettyCash : cashTally}
              onChange={(e) =>
                cashType === "petty"
                  ? setPettyCash(e.target.value)
                  : setCashTally(e.target.value)
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent"
            >
              {cashType === "petty" ? (
                <>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </>
              ) : (
                <>
                  <option value="total">Total</option>
                  <option value="breakdown">Breakdown</option>
                  <option value="summary">Summary</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FaChartPie className="text-[#2a5298] text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Expense by Category
              </h3>
              <p className="text-sm text-gray-600">
                {cashType === "petty" ? "Petty Cash" : "Tally Cash"} Distribution
              </p>
            </div>
          </div>
          <div className="h-[300px] md:h-[350px]">
            <Pie data={pieChartData} options={pieOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-2 rounded-lg">
              <FaChartLine className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Daily Expense Trend
              </h3>
              <p className="text-sm text-gray-600">
                {cashType === "petty" ? "Petty Cash" : "Tally Cash"} over time
              </p>
            </div>
          </div>
          <div className="h-[300px] md:h-[350px]">
            <Line data={lineChartData} options={lineOptions} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Export Reports</h3>
            <p className="text-sm text-gray-600 mt-1">
              Download your {cashType === "petty" ? "Petty Cash" : "Tally Cash"} reports
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
            >
              <FaFilePdf />
              Export PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
            >
              <FaFileExcel />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Summary Statistics - {cashType === "petty" ? "Petty Cash" : "Tally Cash"}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-blue-700">
              ₹{currentData.summary.total.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Avg. Daily</p>
            <p className="text-2xl font-bold text-green-700">
              ₹{currentData.summary.avgDaily.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-gray-600 mb-1">Highest Day</p>
            <p className="text-2xl font-bold text-yellow-700">
              ₹{currentData.summary.highest.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-gray-600 mb-1">Categories</p>
            <p className="text-2xl font-bold text-purple-700">
              {currentData.summary.categories}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}