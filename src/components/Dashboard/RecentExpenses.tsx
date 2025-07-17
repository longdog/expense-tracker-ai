'use client';

import Link from 'next/link';
import { Expense, ExpenseCategory } from '@/types';
import { formatCurrency, formatDate } from '@/utils/expenseUtils';

interface RecentExpensesProps {
  expenses: Expense[];
}

const RecentExpenses: React.FC<RecentExpensesProps> = ({ expenses }) => {
  // Get category badge color
  const getCategoryColor = (category: ExpenseCategory): string => {
    const colors: Record<ExpenseCategory, string> = {
      Food: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      Transportation: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      Entertainment: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      Shopping: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      Bills: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      Other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };

    return colors[category];
  };

  // Sort expenses by date (newest first) and take the 5 most recent
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (recentExpenses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">No recent expenses found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Expenses</h2>
        <Link 
          href="/expenses" 
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
        >
          View All
        </Link>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentExpenses.map((expense) => (
            <li key={expense.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                    {expense.description}
                  </p>
                  <div className="flex items-center mt-1 sm:mt-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                      {formatDate(expense.date)}
                    </span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </span>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(expense.amount)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecentExpenses;