'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { Expense, ExpenseCategory } from '@/types';
import Modal from '@/components/UI/Modal';
import Button from '@/components/UI/Button';
import Select from '@/components/UI/Select';
import { ExportFormat, ExportOptions, filterExpensesForExport } from '@/utils/exportUtils';
import { formatCurrency, formatDate } from '@/utils/expenseUtils';
import { DocumentArrowDownIcon, DocumentTextIcon, TableCellsIcon, DocumentIcon } from '@heroicons/react/24/outline';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
  onExport: (expenses: Expense[], options: ExportOptions) => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, expenses, onExport }) => {
  // State for export options
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<ExpenseCategory[]>([]);
  const [filename, setFilename] = useState(`expenses-${new Date().toISOString().split('T')[0]}`);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filtered expenses based on current filters
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>(expenses);
  
  // Available categories from expenses
  const [availableCategories, setAvailableCategories] = useState<ExpenseCategory[]>([]);

  // Update available categories when expenses change
  useEffect(() => {
    const categories = Array.from(new Set(expenses.map(expense => expense.category)));
    setAvailableCategories(categories as ExpenseCategory[]);
  }, [expenses]);

  // Update filtered expenses when filters change
  useEffect(() => {
    const filtered = filterExpensesForExport(
      expenses,
      startDate,
      endDate,
      selectedCategories.length > 0 ? selectedCategories : null
    );
    setFilteredExpenses(filtered);
  }, [expenses, startDate, endDate, selectedCategories]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormat('csv');
      setStartDate(null);
      setEndDate(null);
      setSelectedCategories([]);
      setFilename(`expenses-${new Date().toISOString().split('T')[0]}`);
      setFilteredExpenses(expenses);
      setIsLoading(false);
    }
  }, [isOpen, expenses]);

  // Handle category toggle
  const handleCategoryToggle = (category: ExpenseCategory) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Handle export button click
  const handleExport = async () => {
    setIsLoading(true);
    
    try {
      // Prepare export options
      const options: ExportOptions = {
        format,
        startDate,
        endDate,
        categories: selectedCategories.length > 0 ? selectedCategories : null,
        filename
      };
      
      // Call the export function
      await onExport(filteredExpenses, options);
      
      // Close the modal after successful export
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format icon based on export format
  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case 'csv':
        return <TableCellsIcon className="w-5 h-5" />;
      case 'json':
        return <DocumentTextIcon className="w-5 h-5" />;
      case 'pdf':
        return <DocumentIcon className="w-5 h-5" />;
      default:
        return <DocumentArrowDownIcon className="w-5 h-5" />;
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Export Expenses"
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-gray-500">
            {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'} selected
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleExport} 
              isLoading={isLoading}
              icon={getFormatIcon(format)}
            >
              Export to {format.toUpperCase()}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Export Format */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Export Format</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Select the file format for your export</p>
          </div>
          <div className="col-span-2">
            <div className="flex flex-wrap gap-3">
              <Button 
                variant={format === 'csv' ? 'primary' : 'outline'}
                onClick={() => setFormat('csv')}
                icon={<TableCellsIcon className="w-5 h-5" />}
              >
                CSV
              </Button>
              <Button 
                variant={format === 'json' ? 'primary' : 'outline'}
                onClick={() => setFormat('json')}
                icon={<DocumentTextIcon className="w-5 h-5" />}
              >
                JSON
              </Button>
              <Button 
                variant={format === 'pdf' ? 'primary' : 'outline'}
                onClick={() => setFormat('pdf')}
                icon={<DocumentIcon className="w-5 h-5" />}
              >
                PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Date Range</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Filter expenses by date range</p>
          </div>
          <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate || new Date()}
                placeholderText="Select start date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={new Date()}
                placeholderText="Select end date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Categories</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Filter expenses by category</p>
          </div>
          <div className="col-span-2">
            <div className="flex flex-wrap gap-2">
              {availableCategories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategories.includes(category) ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryToggle(category)}
                >
                  {category}
                </Button>
              ))}
              {availableCategories.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">No categories available</p>
              )}
            </div>
            {selectedCategories.length > 0 && (
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="xs" 
                  onClick={() => setSelectedCategories([])}
                >
                  Clear Selection
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Filename */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Filename</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Customize the export filename</p>
          </div>
          <div className="col-span-2">
            <input
              type="text"
              value={filename}
              onChange={e => setFilename(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter filename"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              File extension will be added automatically based on the selected format
            </p>
          </div>
        </div>

        {/* Preview */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Preview</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.slice(0, 5).map(expense => (
                    <tr key={expense.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatDate(expense.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatCurrency(expense.amount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{expense.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white truncate max-w-xs">{expense.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No expenses match your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {filteredExpenses.length > 5 && (
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm text-gray-500 dark:text-gray-400 text-center border-t border-gray-200 dark:border-gray-700">
              Showing 5 of {filteredExpenses.length} expenses
            </div>
          )}
        </div>

        {/* Export Summary */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
          <h3 className="text-lg font-medium text-indigo-800 dark:text-indigo-300 mb-2">Export Summary</h3>
          <ul className="space-y-1 text-sm text-indigo-700 dark:text-indigo-300">
            <li>Format: {format.toUpperCase()}</li>
            <li>Date Range: {startDate ? formatDate(startDate.toISOString()) : 'All'} to {endDate ? formatDate(endDate.toISOString()) : 'All'}</li>
            <li>Categories: {selectedCategories.length > 0 ? selectedCategories.join(', ') : 'All'}</li>
            <li>Records: {filteredExpenses.length}</li>
            <li>Total Amount: {formatCurrency(filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0))}</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;