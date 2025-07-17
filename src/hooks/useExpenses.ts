import { useState, useEffect } from 'react';
import { Expense, ExpenseFormData, ExpenseFilterOptions } from '@/types';
import { 
  loadExpenses, 
  saveExpenses, 
  generateId, 
  filterExpenses as filterExpensesUtil,
  calculateExpenseSummary,
  exportToCSV,
  downloadCSV
} from '@/utils/expenseUtils';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [filterOptions, setFilterOptions] = useState<ExpenseFilterOptions>({
    startDate: null,
    endDate: null,
    category: 'All',
    searchQuery: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load expenses from localStorage on initial render
  useEffect(() => {
    const loadedExpenses = loadExpenses();
    setExpenses(loadedExpenses);
    setFilteredExpenses(loadedExpenses);
    setIsLoading(false);
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveExpenses(expenses);
      applyFilters();
    }
  }, [expenses, filterOptions, isLoading]);

  // Apply filters to expenses
  const applyFilters = () => {
    const filtered = filterExpensesUtil(
      expenses,
      filterOptions.startDate,
      filterOptions.endDate,
      filterOptions.category,
      filterOptions.searchQuery
    );
    setFilteredExpenses(filtered);
  };

  // Add a new expense
  const addExpense = (expenseData: ExpenseFormData) => {
    const newExpense: Expense = {
      id: generateId(),
      date: expenseData.date.toISOString(),
      amount: expenseData.amount,
      category: expenseData.category,
      description: expenseData.description
    };

    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
  };

  // Update an existing expense
  const updateExpense = (id: string, expenseData: ExpenseFormData) => {
    setExpenses(prevExpenses =>
      prevExpenses.map(expense =>
        expense.id === id
          ? {
              ...expense,
              date: expenseData.date.toISOString(),
              amount: expenseData.amount,
              category: expenseData.category,
              description: expenseData.description
            }
          : expense
      )
    );
  };

  // Delete an expense
  const deleteExpense = (id: string) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
  };

  // Update filter options
  const updateFilterOptions = (newOptions: Partial<ExpenseFilterOptions>) => {
    setFilterOptions(prevOptions => ({
      ...prevOptions,
      ...newOptions
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilterOptions({
      startDate: null,
      endDate: null,
      category: 'All',
      searchQuery: ''
    });
  };

  // Get expense summary
  const getExpenseSummary = () => {
    return calculateExpenseSummary(expenses);
  };

  // Export expenses to CSV
  const exportExpenses = () => {
    const csvContent = exportToCSV(filteredExpenses.length > 0 ? filteredExpenses : expenses);
    downloadCSV(csvContent, `expenses-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return {
    expenses,
    filteredExpenses,
    filterOptions,
    isLoading,
    addExpense,
    updateExpense,
    deleteExpense,
    updateFilterOptions,
    resetFilters,
    getExpenseSummary,
    exportExpenses
  };
};