export type ExpenseCategory = 'Food' | 'Transportation' | 'Entertainment' | 'Shopping' | 'Bills' | 'Other';

export interface Expense {
  id: string;
  date: string; // ISO string format
  amount: number;
  category: ExpenseCategory;
  description: string;
}

export interface ExpenseFormData {
  date: Date;
  amount: number;
  category: ExpenseCategory;
  description: string;
}

export interface ExpenseFilterOptions {
  startDate: Date | null;
  endDate: Date | null;
  category: ExpenseCategory | 'All';
  searchQuery: string;
}

export interface ExpenseSummary {
  totalAmount: number;
  monthlyAmount: number;
  topCategory: {
    category: ExpenseCategory;
    amount: number;
  } | null;
  categoryBreakdown: Record<ExpenseCategory, number>;
}