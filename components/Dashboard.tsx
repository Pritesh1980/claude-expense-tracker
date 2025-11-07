'use client';

import React from 'react';
import { Expense } from '@/types/expense';
import { calculateSpendingSummary } from '@/utils/calculations';
import { formatCurrency } from '@/utils/currency';
import { Card } from './ui/Card';

interface DashboardProps {
  expenses: Expense[];
}

export const Dashboard: React.FC<DashboardProps> = ({ expenses }) => {
  const summary = calculateSpendingSummary(expenses);

  const handleExportCSV = () => {
    // Create CSV header
    const headers = ['Date', 'Category', 'Amount', 'Description'];

    // Create CSV rows
    const rows = expenses.map(expense => [
      expense.date,
      expense.category,
      expense.amount.toString(),
      `"${expense.description.replace(/"/g, '""')}"` // Escape quotes in description
    ]);

    // Combine header and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const summaryCards = [
    {
      title: 'Total Spending',
      value: formatCurrency(summary.totalSpending),
      icon: '💰',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      title: 'This Month',
      value: formatCurrency(summary.monthlySpending),
      icon: '📅',
      color: 'bg-green-50 border-green-200',
    },
    {
      title: 'Top Category',
      value: summary.topCategory
        ? `${summary.topCategory.category} (${formatCurrency(summary.topCategory.amount)})`
        : 'No expenses yet',
      icon: '🏆',
      color: 'bg-purple-50 border-purple-200',
    },
    {
      title: 'Total Expenses',
      value: expenses.length.toString(),
      icon: '📊',
      color: 'bg-orange-50 border-orange-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={handleExportCSV}
          disabled={expenses.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Export Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} border rounded-lg p-6 transition-transform hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
              <span className="text-2xl">{card.icon}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 break-words">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      <Card title="Spending by Category">
        <div className="space-y-3">
          {Object.entries(summary.categoryBreakdown)
            .sort(([, a], [, b]) => b - a)
            .map(([category, amount]) => {
              const percentage =
                summary.totalSpending > 0
                  ? (amount / summary.totalSpending) * 100
                  : 0;

              return (
                <div key={category} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{category}</span>
                    <span className="text-gray-900 font-semibold">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{percentage.toFixed(1)}% of total</p>
                </div>
              );
            })}
        </div>
        {expenses.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No spending data available yet. Add your first expense to see analytics.
          </p>
        )}
      </Card>
    </div>
  );
};
