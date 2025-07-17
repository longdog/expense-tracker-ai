'use client';

import { useState } from 'react';
import { Expense, ExpenseCategory } from '@/types';
import { formatCurrency, formatDate } from '@/utils/expenseUtils';
import ExpenseForm from './ExpenseForm';

interface ExpenseListProps {
  expenses: Expense[];
  onUpdateExpense: (id: string, data: any) => void;
  onDeleteExpense: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onUpdateExpense,
  onDeleteExpense
}) => {
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  // Get the expense being edited
  const editingExpense = editingExpenseId
    ? expenses.find(expense => expense.id === editingExpenseId)
    : undefined;

  // Handle edit button click
  const handleEdit = (id: string) => {
    setEditingExpenseId(id);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingExpenseId(null);
  };

  // Handle update expense
  const handleUpdateExpense = (data: any) => {
    if (editingExpenseId) {
      onUpdateExpense(editingExpenseId, data);
      setEditingExpenseId(null);
    }
  };

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

  if (expenses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">No expenses found. Add some expenses to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      {editingExpenseId && editingExpense && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <ExpenseForm
            onSubmit={handleUpdateExpense}
            initialData={editingExpense}
            onCancel={handleCancelEdit}
            isEditing={true}
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {expenses.map(expense => (
              <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(expense.date)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                  {expense.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(expense.category)}`}>
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(expense.id)}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;