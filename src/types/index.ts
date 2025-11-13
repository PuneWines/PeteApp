export interface Transaction {
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
  petrol: string;
  advance: string;
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
  user?: string; // Optional for mock data
}

export interface TransactionFormData {
  date: string;
  category: string;
  description: string;
  amount: string;
  remarks: string;
}
