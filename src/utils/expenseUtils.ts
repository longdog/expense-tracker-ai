import { Expense, ExpenseCategory, ExpenseSummary } from '@/types';
import { format, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';

const STORAGE_KEY = 'expense-tracker-expenses';

// Save expenses to localStorage
export const saveExpenses = (expenses: Expense[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }
};

// Load expenses from localStorage
export const loadExpenses = (): Expense[] => {
  if (typeof window !== 'undefined') {
    const storedExpenses = localStorage.getItem(STORAGE_KEY);
    return storedExpenses ? JSON.parse(storedExpenses) : [];
  }
  return [];
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Format date
export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM d, yyyy');
};

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Filter expenses by date range and category
export const filterExpenses = (
  expenses: Expense[],
  startDate: Date | null,
  endDate: Date | null,
  category: ExpenseCategory | 'All',
  searchQuery: string
): Expense[] => {
  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const matchesDateRange = !startDate || !endDate || isWithinInterval(expenseDate, { start: startDate, end: endDate });
    const matchesCategory = category === 'All' || expense.category === category;
    const matchesSearch = !searchQuery || 
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesDateRange && matchesCategory && matchesSearch;
  });
};

// Calculate expense summary
export const calculateExpenseSummary = (expenses: Expense[]): ExpenseSummary => {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate monthly amount (current month)
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
  });
  
  const monthlyAmount = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate category breakdown
  const categoryBreakdown = expenses.reduce((breakdown, expense) => {
    const category = expense.category;
    breakdown[category] = (breakdown[category] || 0) + expense.amount;
    return breakdown;
  }, {} as Record<ExpenseCategory, number>);
  
  // Find top category
  let topCategory: { category: ExpenseCategory; amount: number } | null = null;
  
  Object.entries(categoryBreakdown).forEach(([category, amount]) => {
    if (!topCategory || amount > topCategory.amount) {
      topCategory = {
        category: category as ExpenseCategory,
        amount
      };
    }
  });
  
  return {
    totalAmount,
    monthlyAmount,
    topCategory,
    categoryBreakdown
  };
};

// Get expense data for charts
export const getExpenseChartData = (expenses: Expense[]) => {
  // Category data for pie chart
  const categoryData = {
    labels: [] as string[],
    values: [] as number[],
    colors: [
      '#FF6384', // Food
      '#36A2EB', // Transportation
      '#FFCE56', // Entertainment
      '#4BC0C0', // Shopping
      '#9966FF', // Bills
      '#C9CBCF'  // Other
    ]
  };
  
  const categoryBreakdown: Record<string, number> = {};
  
  expenses.forEach(expense => {
    if (!categoryBreakdown[expense.category]) {
      categoryBreakdown[expense.category] = 0;
    }
    categoryBreakdown[expense.category] += expense.amount;
  });
  
  Object.entries(categoryBreakdown).forEach(([category, amount]) => {
    categoryData.labels.push(category);
    categoryData.values.push(amount);
  });
  
  return {
    categoryData
  };
};

// Export expenses to CSV
export const exportToCSV = (expenses: Expense[]): string => {
  const headers = ['Date', 'Amount', 'Category', 'Description'];
  
  // Helper function to properly quote and escape CSV fields
  const escapeField = (field: string): string => {
    // Replace any double quotes with two double quotes (CSV standard for escaping quotes)
    const escaped = field.replace(/"/g, '""');
    // Wrap in quotes to handle commas and other special characters
    return `"${escaped}"`;
  };
  
  const rows = expenses.map(expense => [
    escapeField(formatDate(expense.date)),
    escapeField(expense.amount.toString()),
    escapeField(expense.category),
    escapeField(expense.description)
  ]);
  
  const csvContent = [
    headers.map(escapeField).join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
};

// Download CSV file
export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};