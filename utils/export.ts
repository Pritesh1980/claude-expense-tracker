import { Expense } from '@/types/expense';
import { format } from 'date-fns';
import { formatCurrency } from './currency';

export const exportToCSV = (expenses: Expense[]): void => {
  if (expenses.length === 0) {
    alert('No expenses to export');
    return;
  }

  // Create CSV header
  const headers = ['Date', 'Category', 'Amount (GBP)', 'Description'];

  // Create CSV rows
  const rows = expenses.map(expense => {
    const date = format(new Date(expense.date), 'dd/MM/yyyy');
    const amount = expense.amount.toFixed(2);
    // Escape description for CSV (handle commas and quotes)
    const description = `"${expense.description.replace(/"/g, '""')}"`;

    return [date, expense.category, amount, description].join(',');
  });

  // Combine header and rows
  const csvContent = [headers.join(','), ...rows].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `expenses_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
