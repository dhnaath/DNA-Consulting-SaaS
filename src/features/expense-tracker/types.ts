export type ExpenseCategoryKey =
  | 'food_beverage'
  | 'transportation'
  | 'office_supplies'
  | 'software_tech'
  | 'marketing'
  | 'utilities'
  | 'entertainment'
  | 'travel'
  | 'medical'
  | 'taxes_fees'
  | 'other';

export type ExpenseStatus = 'cleared' | 'pending' | 'reconciled';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  category: ExpenseCategoryKey;
  date: string; // YYYY-MM-DD
  time?: string;
  paymentAccount: string;
  merchant: string;
  hasReceipt: boolean;
  receiptNote?: string;
  isTaxDeductible: boolean;
  status: ExpenseStatus;
  tags: string[];
  notes?: string;
  createdAt: string;
}

export type ExpenseViewMode =
  | 'all'
  | 'by_category'
  | 'merchants'
  | 'tax_deductible'
  | 'analytics';
