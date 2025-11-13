import { useState, useEffect } from "react";
import {
  FaTimes,
  FaWallet,
  FaCoffee,
  FaTools,
  FaGasPump,
  FaShoppingBag,
  FaCreditCard,
} from "react-icons/fa";

interface CategoryAmounts {
  id?: string;
  openingQty: string;
  teaNasta: string;
  waterJar: string;
  lightBill: string;
  recharge: string;
  postOffice: string;
  customerDiscount: string;
  repairMaintenance: string;
  stationary: string;
  incentive: string;
  breakage: string;
  breakageName: string;
  petrol: string;
  advance: string;
  advanceName: string;
  excisePolice: string;
  desiBhada: string;
  otherPurchaseVoucherNo: string;
  otherVendorPayment: string;
  differenceAmount: string;
  patilPetrol: string;
  roomExpense: string;
  officeExpense: string;
  personalExpense: string;
  miscExpense: string;
  closing: string;
  creditCardCharges: string;
  date: string;
}

interface PettyCashModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CategoryAmounts) => void;
  initialData?: CategoryAmounts;
}

export default function PettyCashModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: PettyCashModalProps) {
  const [formData, setFormData] = useState<CategoryAmounts>({
    id: "",
    openingQty: "",
    teaNasta: "",
    waterJar: "",
    lightBill: "",
    recharge: "",
    postOffice: "",
    customerDiscount: "",
    repairMaintenance: "",
    stationary: "",
    incentive: "",
    breakage: "",
    breakageName: "",
    petrol: "",
    advance: "",
    advanceName: "",
    excisePolice: "",
    desiBhada: "",
    otherPurchaseVoucherNo: "",
    otherVendorPayment: "",
    differenceAmount: "",
    patilPetrol: "",
    roomExpense: "",
    officeExpense: "",
    personalExpense: "",
    miscExpense: "",
    closing: "",
    creditCardCharges: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const sum = [
      parseFloat(formData.openingQty) || 0,
      parseFloat(formData.teaNasta) || 0,
      parseFloat(formData.waterJar) || 0,
      parseFloat(formData.lightBill) || 0,
      parseFloat(formData.recharge) || 0,
      parseFloat(formData.postOffice) || 0,
      parseFloat(formData.customerDiscount) || 0,
      parseFloat(formData.repairMaintenance) || 0,
      parseFloat(formData.stationary) || 0,
      parseFloat(formData.incentive) || 0,
      parseFloat(formData.breakage) || 0,
      parseFloat(formData.petrol) || 0,
      parseFloat(formData.advance) || 0,
      parseFloat(formData.excisePolice) || 0,
      parseFloat(formData.desiBhada) || 0,
      parseFloat(formData.otherVendorPayment) || 0,
      parseFloat(formData.differenceAmount) || 0,
      parseFloat(formData.patilPetrol) || 0,
      parseFloat(formData.roomExpense) || 0,
      parseFloat(formData.officeExpense) || 0,
      parseFloat(formData.personalExpense) || 0,
      parseFloat(formData.miscExpense) || 0,
      parseFloat(formData.closing) || 0,
      parseFloat(formData.creditCardCharges) || 0,
    ].reduce((acc, val) => acc + val, 0);
    setTotalAmount(sum);
  }, [formData]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          id: "",
          openingQty: "",
          teaNasta: "",
          waterJar: "",
          lightBill: "",
          recharge: "",
          postOffice: "",
          customerDiscount: "",
          repairMaintenance: "",
          stationary: "",
          incentive: "",
          breakage: "",
          breakageName: "",
          petrol: "",
          advance: "",
          advanceName: "",
          excisePolice: "",
          desiBhada: "",
          otherPurchaseVoucherNo: "",
          otherVendorPayment: "",
          differenceAmount: "",
          patilPetrol: "",
          roomExpense: "",
          officeExpense: "",
          personalExpense: "",
          miscExpense: "",
          closing: "",
          creditCardCharges: "",
          date: new Date().toISOString().split("T")[0],
        });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-[#f5f7fa] rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#f5f7fa] border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            Petty Cash Entry{initialData?.id ? ` - ID: ${initialData.id}` : ""}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-gray-100"
          >
            <FaTimes className="text-xl text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-8">
            {/* Opening/Closing Section */}
            <div className="bg-[#f5f7fa] rounded-lg p-6">
              <div className="flex gap-3 items-center mb-4">
                <div className="bg-[#2a5298] p-2 rounded-lg">
                  <FaWallet className="text-lg text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Opening & Closing Balance
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* DATE */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
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

                {/* Opening Qty */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Opening Balance <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="openingQty"
                    value={formData.openingQty}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent transition-all bg-white"
                  />
                </div>

                {/* Closing */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Closing Balance <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="closing"
                    value={formData.closing}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2a5298] focus:border-transparent transition-all bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Daily Expenses Section */}
            <div className="bg-[#f5f7fa] rounded-lg p-6">
              <div className="flex gap-3 items-center mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <FaCoffee className="text-lg text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Daily Expenses
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Tea + Nasta */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Tea & Snacks
                  </label>
                  <input
                    type="number"
                    name="teaNasta"
                    value={formData.teaNasta}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Water Jar */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Water Jar
                  </label>
                  <input
                    type="number"
                    name="waterJar"
                    value={formData.waterJar}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Light Bill */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Electricity Bill
                  </label>
                  <input
                    type="number"
                    name="lightBill"
                    value={formData.lightBill}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Recharge */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Recharge
                  </label>
                  <input
                    type="number"
                    name="recharge"
                    value={formData.recharge}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Post Office */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Post Office
                  </label>
                  <input
                    type="number"
                    name="postOffice"
                    value={formData.postOffice}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Customer Discount */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Customer Discount
                  </label>
                  <input
                    type="number"
                    name="customerDiscount"
                    value={formData.customerDiscount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Maintenance & Repairs Section */}
            <div className="bg-[#f5f7fa] rounded-lg p-6">
              <div className="flex gap-3 items-center mb-4">
                <div className="p-2 bg-green-600 rounded-lg">
                  <FaTools className="text-lg text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Maintenance & Repairs
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Repair/Maintenance */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Repair & Maintenance
                  </label>
                  <input
                    type="number"
                    name="repairMaintenance"
                    value={formData.repairMaintenance}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Stationary */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Stationary
                  </label>
                  <input
                    type="number"
                    name="stationary"
                    value={formData.stationary}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Fuel & Transport Section */}
            <div className="bg-[#f5f7fa] rounded-lg p-6">
              <div className="flex gap-3 items-center mb-4">
                <div className="p-2 bg-orange-600 rounded-lg">
                  <FaGasPump className="text-lg text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Fuel & Transport
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Petrol */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Petrol
                  </label>
                  <input
                    type="number"
                    name="petrol"
                    value={formData.petrol}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Patil Petrol */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Patil Petrol
                  </label>
                  <input
                    type="number"
                    name="patilPetrol"
                    value={formData.patilPetrol}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Other Expenses Section */}
            <div className="bg-[#f5f7fa] rounded-lg p-6">
              <div className="flex gap-3 items-center mb-4">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <FaShoppingBag className="text-lg text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Other Expenses
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Incentive */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Incentive
                  </label>
                  <input
                    type="number"
                    name="incentive"
                    value={formData.incentive}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Advance */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Advance
                  </label>
                  <input
                    type="number"
                    name="advance"
                    value={formData.advance}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Advance Name */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Advance Name
                  </label>
                  <input
                    type="text"
                    name="advanceName"
                    value={formData.advanceName}
                    onChange={handleNameChange}
                    placeholder="Enter advance name"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Breakage */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Breakage
                  </label>
                  <input
                    type="number"
                    name="breakage"
                    value={formData.breakage}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Breakage Name */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Breakage Name
                  </label>
                  <input
                    type="text"
                    name="breakageName"
                    value={formData.breakageName}
                    onChange={handleNameChange}
                    placeholder="Enter breakage name"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Excise/Police */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Excise/Police
                  </label>
                  <input
                    type="number"
                    name="excisePolice"
                    value={formData.excisePolice}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Desi Bhada */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Desi Bhada
                  </label>
                  <input
                    type="number"
                    name="desiBhada"
                    value={formData.desiBhada}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Room Expense */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Room Expense
                  </label>
                  <input
                    type="number"
                    name="roomExpense"
                    value={formData.roomExpense}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Office Expense */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Office Expense
                  </label>
                  <input
                    type="number"
                    name="officeExpense"
                    value={formData.officeExpense}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Personal Expense */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Personal Expense
                  </label>
                  <input
                    type="number"
                    name="personalExpense"
                    value={formData.personalExpense}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Misc. Expense */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Miscellaneous
                  </label>
                  <input
                    type="number"
                    name="miscExpense"
                    value={formData.miscExpense}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Payments & Vendors Section */}
            <div className="bg-[#f5f7fa] rounded-lg p-6">
              <div className="flex gap-3 items-center mb-4">
                <div className="p-2 bg-red-600 rounded-lg">
                  <FaCreditCard className="text-lg text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Payments & Vendors
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Other Purchase Voucher No. */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Purchase Voucher No.
                  </label>
                  <input
                    type="text"
                    name="otherPurchaseVoucherNo"
                    value={formData.otherPurchaseVoucherNo}
                    onChange={handleChange}
                    placeholder="Enter voucher number"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Other Vendor Payment */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Vendor Payment
                  </label>
                  <input
                    type="number"
                    name="otherVendorPayment"
                    value={formData.otherVendorPayment}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Difference Amount */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Difference Amount
                  </label>
                  <input
                    type="number"
                    name="differenceAmount"
                    value={formData.differenceAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Credit Card Charges */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Credit Card Charges
                  </label>
                  <input
                    type="number"
                    name="creditCardCharges"
                    value={formData.creditCardCharges}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 transition-all focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-[#f5f7fa] rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">
                Total Amount:
              </span>
              <span className="text-2xl font-bold text-[#2a5298]">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-6 mt-6 border-t border-gray-200 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 font-semibold text-gray-700 rounded-lg border border-gray-300 transition-all hover:bg-gray-50"
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
