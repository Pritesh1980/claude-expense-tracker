'use client';

import React, { useState, useMemo } from 'react';
import { Expense, ExpenseCategory } from '@/types/expense';
import { formatCurrency } from '@/utils/currency';
import jsPDF from 'jspdf';

interface ExportModalProps {
  expenses: Expense[];
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = 'csv' | 'json' | 'pdf';

const CATEGORIES: ExpenseCategory[] = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Other'];

export const ExportModal: React.FC<ExportModalProps> = ({ expenses, isOpen, onClose }) => {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<ExpenseCategory>>(new Set(CATEGORIES));
  const [filename, setFilename] = useState('expenses-export');
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Filter expenses based on date range and categories
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const dateMatch = (!start || expenseDate >= start) && (!end || expenseDate <= end);
      const categoryMatch = selectedCategories.has(expense.category);

      return dateMatch && categoryMatch;
    });
  }, [expenses, startDate, endDate, selectedCategories]);

  const exportSummary = useMemo(() => {
    const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return {
      count: filteredExpenses.length,
      total,
      dateRange: startDate && endDate
        ? `${startDate} to ${endDate}`
        : startDate
        ? `From ${startDate}`
        : endDate
        ? `Until ${endDate}`
        : 'All dates'
    };
  }, [filteredExpenses, startDate, endDate]);

  const toggleCategory = (category: ExpenseCategory) => {
    const newCategories = new Set(selectedCategories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setSelectedCategories(newCategories);
  };

  const selectAllCategories = () => setSelectedCategories(new Set(CATEGORIES));
  const deselectAllCategories = () => setSelectedCategories(new Set());

  const generateCSV = (data: Expense[]): string => {
    const headers = ['Date', 'Category', 'Amount', 'Description'];
    const rows = data.map(expense => [
      expense.date,
      expense.category,
      expense.amount.toString(),
      `"${expense.description.replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };

  const generateJSON = (data: Expense[]): string => {
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      summary: exportSummary,
      expenses: data.map(exp => ({
        date: exp.date,
        category: exp.category,
        amount: exp.amount,
        description: exp.description
      }))
    }, null, 2);
  };

  const generatePDF = (data: Expense[]): void => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Title
    doc.setFontSize(20);
    doc.text('Expense Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Export info
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Date Range: ${exportSummary.dateRange}`, 20, yPosition);
    yPosition += 10;

    // Summary
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Expenses: ${exportSummary.count}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Total Amount: ${formatCurrency(exportSummary.total)}`, 20, yPosition);
    yPosition += 15;

    // Table header
    doc.setFillColor(59, 130, 246);
    doc.rect(20, yPosition - 6, pageWidth - 40, 8, 'F');
    doc.setTextColor(255);
    doc.setFontSize(10);
    doc.text('Date', 25, yPosition);
    doc.text('Category', 65, yPosition);
    doc.text('Amount', 120, yPosition);
    doc.text('Description', 155, yPosition);
    yPosition += 10;

    // Table rows
    doc.setTextColor(0);
    doc.setFontSize(9);
    data.forEach((expense, index) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }

      // Alternating row colors
      if (index % 2 === 0) {
        doc.setFillColor(240, 240, 240);
        doc.rect(20, yPosition - 5, pageWidth - 40, 7, 'F');
      }

      doc.text(expense.date, 25, yPosition);
      doc.text(expense.category, 65, yPosition);
      doc.text(formatCurrency(expense.amount), 120, yPosition);

      // Truncate long descriptions
      const desc = expense.description.length > 30
        ? expense.description.substring(0, 27) + '...'
        : expense.description;
      doc.text(desc, 155, yPosition);

      yPosition += 7;
    });

    doc.save(`${filename}.pdf`);
  };

  const handleExport = async () => {
    if (filteredExpenses.length === 0) return;

    setIsExporting(true);

    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      switch (format) {
        case 'csv': {
          const csvContent = generateCSV(filteredExpenses);
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', `${filename}.csv`);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          break;
        }
        case 'json': {
          const jsonContent = generateJSON(filteredExpenses);
          const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
          const link = document.createElement('a');
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', `${filename}.json`);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          break;
        }
        case 'pdf': {
          generatePDF(filteredExpenses);
          break;
        }
      }

      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 300);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Export Expenses</h2>
              <p className="text-blue-100 mt-1">Customize and export your expense data</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-800 rounded-lg p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Export Format Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              {(['csv', 'json', 'pdf'] as ExportFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    format === fmt
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">
                      {fmt === 'csv' && '📊'}
                      {fmt === 'json' && '{ }'}
                      {fmt === 'pdf' && '📄'}
                    </div>
                    <div className="font-semibold text-gray-800 uppercase">{fmt}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {fmt === 'csv' && 'Spreadsheet'}
                      {fmt === 'json' && 'Data Format'}
                      {fmt === 'pdf' && 'Document'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Date Range</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-700">Categories</label>
              <div className="space-x-2">
                <button
                  onClick={selectAllCategories}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Select All
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={deselectAllCategories}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Deselect All
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                    selectedCategories.has(category)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{category}</span>
                    {selectedCategories.has(category) && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Filename */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filename</label>
            <div className="flex items-center">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter filename"
              />
              <div className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600 font-mono text-sm">
                .{format}
              </div>
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-100">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Summary
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Records</div>
                <div className="text-xl font-bold text-gray-800">{exportSummary.count}</div>
              </div>
              <div>
                <div className="text-gray-600">Total Amount</div>
                <div className="text-xl font-bold text-gray-800">{formatCurrency(exportSummary.total)}</div>
              </div>
              <div>
                <div className="text-gray-600">Date Range</div>
                <div className="text-sm font-medium text-gray-800">{exportSummary.dateRange}</div>
              </div>
            </div>
          </div>

          {/* Preview Toggle */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="w-full mb-4 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>

          {/* Data Preview */}
          {showPreview && (
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
                <h4 className="font-semibold text-gray-700 text-sm">Data Preview</h4>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Date</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Category</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700">Amount</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.slice(0, 10).map((expense, index) => (
                      <tr key={expense.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 text-gray-700">{expense.date}</td>
                        <td className="px-4 py-2 text-gray-700">{expense.category}</td>
                        <td className="px-4 py-2 text-right text-gray-700">{formatCurrency(expense.amount)}</td>
                        <td className="px-4 py-2 text-gray-700 truncate max-w-xs">{expense.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredExpenses.length > 10 && (
                  <div className="px-4 py-2 bg-gray-50 text-center text-xs text-gray-500 border-t">
                    Showing 10 of {filteredExpenses.length} records
                  </div>
                )}
                {filteredExpenses.length === 0 && (
                  <div className="px-4 py-8 text-center text-gray-500">
                    No expenses match the selected filters
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={filteredExpenses.length === 0 || isExporting || !filename}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
          >
            {isExporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export {filteredExpenses.length} {filteredExpenses.length === 1 ? 'Record' : 'Records'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
