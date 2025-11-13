import { useState, useEffect } from "react";
import { FaTimes, FaUser, FaShoppingCart, FaTruck, FaPlus } from "react-icons/fa";

interface CashTallyProps {
  isOpen?: boolean;
  onClose?: () => void;
  counter?: number;
  initialData?: any;
}

export default function CashTally({
  isOpen = true,
  onClose = () => {},
  counter = 1,
  initialData,
}: CashTallyProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    name: "",
    retailScanAmount: "",
    retail500: "",
    retail200: "",
    retail100: "",
    retail50: "",
    retail20: "",
    retail10: "",
    retail1: "",
    retailGpay: "",
    retailCard: "",
    expense: "",
    wsCashBillingAmount: "",
    wsCreditBillingAmount: "",
    wsCreditReceipt: "",
    ws500: "",
    ws200: "",
    ws100: "",
    ws50: "",
    ws20: "",
    ws10: "",
    ws1: "",
    wsGpayCard: "",
    homeDelivery: "",
    voidSale: "",
  });

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          date: new Date().toISOString().split("T")[0],
          name: "",
          retailScanAmount: "",
          retail500: "",
          retail200: "",
          retail100: "",
          retail50: "",
          retail20: "",
          retail10: "",
          retail1: "",
          retailGpay: "",
          retailCard: "",
          expense: "",
          wsCashBillingAmount: "",
          wsCreditBillingAmount: "",
          wsCreditReceipt: "",
          ws500: "",
          ws200: "",
          ws100: "",
          ws50: "",
          ws20: "",
          ws10: "",
          ws1: "",
          wsGpayCard: "",
          homeDelivery: "",
          voidSale: "",
        });
      }
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    const sum = [
      parseFloat(formData.retailScanAmount) || 0,
      parseFloat(formData.retail500) || 0,
      parseFloat(formData.retail200) || 0,
      parseFloat(formData.retail100) || 0,
      parseFloat(formData.retail50) || 0,
      parseFloat(formData.retail20) || 0,
      parseFloat(formData.retail10) || 0,
      parseFloat(formData.retail1) || 0,
      parseFloat(formData.retailGpay) || 0,
      parseFloat(formData.retailCard) || 0,
      parseFloat(formData.expense) || 0,
      parseFloat(formData.wsCashBillingAmount) || 0,
      parseFloat(formData.wsCreditBillingAmount) || 0,
      parseFloat(formData.wsCreditReceipt) || 0,
      parseFloat(formData.ws500) || 0,
      parseFloat(formData.ws200) || 0,
      parseFloat(formData.ws100) || 0,
      parseFloat(formData.ws50) || 0,
      parseFloat(formData.ws20) || 0,
      parseFloat(formData.ws10) || 0,
      parseFloat(formData.ws1) || 0,
      parseFloat(formData.wsGpayCard) || 0,
      parseFloat(formData.homeDelivery) || 0,
      parseFloat(formData.voidSale) || 0,
    ].reduce((acc, val) => acc + val, 0);
    setTotalAmount(sum);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existingEntries = JSON.parse(
      localStorage.getItem("cashTallyEntries") || "[]"
    );
    
    if (initialData) {
      // Update existing entry
      const updatedEntries = existingEntries.map((entry: any) => 
        entry.id === initialData.id ? { ...formData, id: initialData.id } : entry
      );
      localStorage.setItem("cashTallyEntries", JSON.stringify(updatedEntries));
    } else {
      // Create new entry
      const newEntry = { id: Date.now().toString(), ...formData };
      localStorage.setItem(
        "cashTallyEntries",
        JSON.stringify([newEntry, ...existingEntries])
      );
    }
    
    console.log("Form submitted:", formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-[#f5f7fa] rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#f5f7fa] border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            Cash Tally - Counter {counter}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-600 text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="bg-[#f5f7fa] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#2a5298] p-2 rounded-lg">
                  <FaUser className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* DATE */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent transition-all bg-white"
                    required
                  />
                </div>

                {/* NAME */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Employee Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter employee name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent transition-all bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Retail Transactions */}
            <div className="bg-[#f5f7fa] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <FaShoppingCart className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Retail Transactions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* RETAIL SCAN AMOUNT */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Scan Amount</label>
                  <input
                    type="number"
                    name="retailScanAmount"
                    value={formData.retailScanAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  />
                </div>

                {/* Retail Denominations */}
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cash Denominations</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹500</label>
                      <input
                        type="number"
                        name="retail500"
                        value={formData.retail500}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹200</label>
                      <input
                        type="number"
                        name="retail200"
                        value={formData.retail200}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹100</label>
                      <input
                        type="number"
                        name="retail100"
                        value={formData.retail100}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹50</label>
                      <input
                        type="number"
                        name="retail50"
                        value={formData.retail50}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹20</label>
                      <input
                        type="number"
                        name="retail20"
                        value={formData.retail20}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹10</label>
                      <input
                        type="number"
                        name="retail10"
                        value={formData.retail10}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹1</label>
                      <input
                        type="number"
                        name="retail1"
                        value={formData.retail1}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* RETAIL GPAY */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">GPay/UPI</label>
                  <input
                    type="number"
                    name="retailGpay"
                    value={formData.retailGpay}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  />
                </div>

                {/* RETAIL CARD */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Card Payments</label>
                  <input
                    type="number"
                    name="retailCard"
                    value={formData.retailCard}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Wholesale Transactions */}
            <div className="bg-[#f5f7fa] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-600 p-2 rounded-lg">
                  <FaTruck className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Wholesale Transactions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* W/S CASH BILLING AMOUNT */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cash Billing</label>
                  <input
                    type="number"
                    name="wsCashBillingAmount"
                    value={formData.wsCashBillingAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                  />
                </div>

                {/* W/S CREDIT BILLING AMOUNT */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Credit Billing</label>
                  <input
                    type="number"
                    name="wsCreditBillingAmount"
                    value={formData.wsCreditBillingAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                  />
                </div>

                {/* W/S CREDIT RECEIPT */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Credit Receipt</label>
                  <input
                    type="number"
                    name="wsCreditReceipt"
                    value={formData.wsCreditReceipt}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                  />
                </div>

                {/* W/S Denominations */}
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cash Denominations</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹500</label>
                      <input
                        type="number"
                        name="ws500"
                        value={formData.ws500}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹200</label>
                      <input
                        type="number"
                        name="ws200"
                        value={formData.ws200}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹100</label>
                      <input
                        type="number"
                        name="ws100"
                        value={formData.ws100}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹50</label>
                      <input
                        type="number"
                        name="ws50"
                        value={formData.ws50}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹20</label>
                      <input
                        type="number"
                        name="ws20"
                        value={formData.ws20}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹10</label>
                      <input
                        type="number"
                        name="ws10"
                        value={formData.ws10}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">₹1</label>
                      <input
                        type="number"
                        name="ws1"
                        value={formData.ws1}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-center bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* W/S GPAY/CARD */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">GPay/Card</label>
                  <input
                    type="number"
                    name="wsGpayCard"
                    value={formData.wsGpayCard}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Expenses & Other Transactions */}
            <div className="bg-[#f5f7fa] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-600 p-2 rounded-lg">
                  <FaPlus className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Expenses & Other Transactions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* EXPENSE */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">General Expense</label>
                  <input
                    type="number"
                    name="expense"
                    value={formData.expense}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                  />
                </div>

                {/* HOME DELIVERY */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Home Delivery</label>
                  <input
                    type="number"
                    name="homeDelivery"
                    value={formData.homeDelivery}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                  />
                </div>

                {/* Conditional Rendering for Cash Denominations */}
                {formData.homeDelivery.length > 0 && (
                  <>
                    {/* W/S Denominations */}
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Cash Denominations</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {[
                          { label: "₹500", name: "ws500" },
                          { label: "₹200", name: "ws200" },
                          { label: "₹100", name: "ws100" },
                          { label: "₹50", name: "ws50" },
                          { label: "₹20", name: "ws20" },
                          { label: "₹10", name: "ws10" },
                          { label: "₹1", name: "ws1" },
                        ].map((denomination) => (
                          <div key={denomination.name}>
                            <label className="block text-xs text-gray-600 mb-1">{denomination.label}</label>
                            <input
                              type="number"
                              name={denomination.name}
                              value={formData[denomination.name]}
                              onChange={handleChange}
                              placeholder="0"
                              min="0"
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-center bg-white"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* W/S GPAY/CARD */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">GPay/Card</label>
                      <input
                        type="number"
                        name="wsGpayCard"
                        value={formData.wsGpayCard}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                      />
                    </div>
                  </>
                )}


                {/* VOID SALE */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Void Sale</label>
                  <input
                    type="number"
                    name="voidSale"
                    value={formData.voidSale}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-[#f5f7fa] rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-700">
                Total Amount:
              </span>
              <span className="text-2xl font-bold text-[#2a5298]">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#2a5298] text-white rounded-lg font-semibold hover:bg-[#1e3d70] transition-all"
            >
              Save Entry
            </button>
          </div>
        </form> 
      </div>
    </div>
  );
}
