'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ExpenseFormData, ExpenseCategory, Expense } from '@/types';

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  initialData?: Expense;
  onCancel?: () => void;
  isEditing?: boolean;
}

const categories: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other'
];

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<ExpenseFormData>({
    date: new Date(),
    amount: 0,
    category: 'Food',
    description: ''
  });

  const [errors, setErrors] = useState({
    amount: '',
    description: ''
  });

  // Initialize form with initial data if provided (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        date: new Date(initialData.date),
        amount: initialData.amount,
        category: initialData.category,
        description: initialData.description
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      const amount = parseFloat(value);
      setFormData(prev => ({ ...prev, [name]: amount }));
      
      // Validate amount
      if (isNaN(amount) || amount <= 0) {
        setErrors(prev => ({ ...prev, amount: 'Please enter a valid amount greater than 0' }));
      } else {
        setErrors(prev => ({ ...prev, amount: '' }));
      }
    } else if (name === 'description') {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Validate description
      if (value.trim() === '') {
        setErrors(prev => ({ ...prev, description: 'Description is required' }));
      } else {
        setErrors(prev => ({ ...prev, description: '' }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({ ...prev, date }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    let isValid = true;
    const newErrors = { amount: '', description: '' };
    
    if (isNaN(formData.amount) || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
      isValid = false;
    }
    
    if (formData.description.trim() === '') {
      newErrors.description = 'Description is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    
    if (isValid) {
      onSubmit(formData);
      
      // Reset form if not editing
      if (!isEditing) {
        setFormData({
          date: new Date(),
          amount: 0,
          category: 'Food',
          description: ''
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        {isEditing ? 'Edit Expense' : 'Add New Expense'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date
          </label>
          <DatePicker
            selected={formData.date}
            onChange={handleDateChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            dateFormat="MMMM d, yyyy"
            id="date"
          />
        </div>
        
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount || ''}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
          {errors.amount && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>}
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
        />
        {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
      </div>
      
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isEditing ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;