'use client';

import { useState, useEffect } from 'react';
import ExpenseForm from '@/components/Expenses/ExpenseForm';
import ExpenseList from '@/components/Expenses/ExpenseList';
import ExpenseFilter from '@/components/Expenses/ExpenseFilter';
import ExportButton from '@/components/Export/ExportButton';
import { useExpenses } from '@/hooks/useExpenses';

export default function ExpensesPage() {
  const {
    filteredExpenses,
    filterOptions,
    isLoading,
    addExpense,
    updateExpense,
    deleteExpense,
    updateFilterOptions,
    resetFilters,
    exportExpenses
  } = useExpenses();

  const [isClient, setIsClient] = useState(false);

  // This effect ensures we only render client-side components after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent hydration errors by not rendering anything on the server
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expenses</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your expenses</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <ExportButton 
            expenses={filteredExpenses} 
            variant="outline" 
            label="Advanced Export"
          />
        </div>
      </div>

      <ExpenseForm onSubmit={addExpense} />

      <ExpenseFilter
        filterOptions={filterOptions}
        onFilterChange={updateFilterOptions}
        onResetFilters={resetFilters}
      />

      <ExpenseList
        expenses={filteredExpenses}
        onUpdateExpense={updateExpense}
        onDeleteExpense={deleteExpense}
      />
    </div>
  );
}