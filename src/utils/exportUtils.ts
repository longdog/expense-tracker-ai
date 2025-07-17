import { Expense, ExpenseCategory } from '@/types';
import { formatCurrency, formatDate } from './expenseUtils';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export type ExportFormat = 'csv' | 'json' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  startDate: Date | null;
  endDate: Date | null;
  categories: ExpenseCategory[] | null;
  filename: string;
}

// Helper function to escape CSV fields
const escapeCSVField = (field: string): string => {
  // If the field contains quotes, commas, or newlines, wrap it in quotes and escape inner quotes
  if (/["\n,]/.test(field)) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
};

// Export to CSV format
export const exportToCSV = (expenses: Expense[]): string => {
  const headers = ['Date', 'Amount', 'Category', 'Description'];
  const rows = expenses.map(expense => [
    escapeCSVField(formatDate(expense.date)),
    escapeCSVField(formatCurrency(expense.amount)),
    escapeCSVField(expense.category),
    escapeCSVField(expense.description)
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
};

// Export to JSON format
export const exportToJSON = (expenses: Expense[]): string => {
  // Format the data for better readability
  const formattedExpenses = expenses.map(expense => ({
    id: expense.id,
    date: formatDate(expense.date),
    amount: formatCurrency(expense.amount),
    rawAmount: expense.amount,
    category: expense.category,
    description: expense.description
  }));
  
  return JSON.stringify(formattedExpenses, null, 2);
};

// Export to PDF format
export const exportToPDF = (expenses: Expense[]): ArrayBuffer => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Expense Report', 14, 22);
  
  // Add generation date
  doc.setFontSize(11);
  doc.text(`Generated on: ${formatDate(new Date().toISOString())}`, 14, 30);
  
  // Prepare data for table
  const tableColumn = ['Date', 'Amount', 'Category', 'Description'];
  const tableRows = expenses.map(expense => [
    formatDate(expense.date),
    formatCurrency(expense.amount),
    expense.category,
    expense.description
  ]);
  
  // Add summary information
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  doc.setFontSize(12);
  doc.text(`Total Expenses: ${formatCurrency(totalAmount)}`, 14, 40);
  doc.text(`Number of Expenses: ${expenses.length}`, 14, 46);
  
  // Add the table
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 55,
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [66, 66, 66] },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });
  
  // Return the PDF as an ArrayBuffer
  return doc.output('arraybuffer');
};

// Download file with appropriate format
export const downloadFile = (data: string | ArrayBuffer, filename: string, format: ExportFormat): void => {
  let blob: Blob;
  let fileExtension: string;
  let mimeType: string;
  
  switch (format) {
    case 'csv':
      blob = new Blob([data as string], { type: 'text/csv;charset=utf-8;' });
      fileExtension = 'csv';
      mimeType = 'text/csv';
      break;
    case 'json':
      blob = new Blob([data as string], { type: 'application/json;charset=utf-8;' });
      fileExtension = 'json';
      mimeType = 'application/json';
      break;
    case 'pdf':
      blob = new Blob([data as ArrayBuffer], { type: 'application/pdf' });
      fileExtension = 'pdf';
      mimeType = 'application/pdf';
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
  
  // Ensure filename has the correct extension
  if (!filename.endsWith(`.${fileExtension}`)) {
    filename = `${filename}.${fileExtension}`;
  }
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.setAttribute('type', mimeType);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Main export function that handles all formats
export const exportExpenses = (expenses: Expense[], options: ExportOptions): void => {
  let data: string | ArrayBuffer;
  
  // Generate data based on format
  switch (options.format) {
    case 'csv':
      data = exportToCSV(expenses);
      break;
    case 'json':
      data = exportToJSON(expenses);
      break;
    case 'pdf':
      data = exportToPDF(expenses);
      break;
    default:
      throw new Error(`Unsupported format: ${options.format}`);
  }
  
  // Download the file
  downloadFile(data, options.filename, options.format);
};

// Filter expenses based on export options
export const filterExpensesForExport = (
  expenses: Expense[],
  startDate: Date | null,
  endDate: Date | null,
  categories: ExpenseCategory[] | null
): Expense[] => {
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    
    // Filter by date range
    if (startDate && expenseDate < startDate) return false;
    if (endDate) {
      // Set endDate to end of the day
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (expenseDate > endOfDay) return false;
    }
    
    // Filter by categories
    if (categories && categories.length > 0 && !categories.includes(expense.category)) {
      return false;
    }
    
    return true;
  });
};