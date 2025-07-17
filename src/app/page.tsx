'use client';

import { useState, useEffect } from 'react';
import SummaryCards from '@/components/Dashboard/SummaryCards';
import ExpenseChart from '@/components/Dashboard/ExpenseChart';
import RecentExpenses from '@/components/Dashboard/RecentExpenses';
import { useExpenses } from '@/hooks/useExpenses';

export default function Home() {
  const { 
    expenses, 
    isLoading,
    getExpenseSummary
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

  const summary = getExpenseSummary();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Overview of your expenses</p>
      </div>

      <SummaryCards summary={summary} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ExpenseChart expenses={expenses} />
        <RecentExpenses expenses={expenses} />
      </div>
    </div>
  );
}
