'use client';

import React, { useState } from 'react';
import { Expense } from '@/types/expense';
import { calculateSpendingSummary } from '@/utils/calculations';
import { formatCurrency } from '@/utils/currency';
import { Card } from './ui/Card';
import { ExportHub } from './ExportHub';

interface DashboardProps {
  expenses: Expense[];
}

export const Dashboard: React.FC<DashboardProps> = ({ expenses }) => {
  const summary = calculateSpendingSummary(expenses);
  const [isExportHubOpen, setIsExportHubOpen] = useState(false);

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
      {/* Cloud Export Hub Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsExportHubOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl flex items-center font-semibold group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          Open Export Hub
          <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">Cloud</span>
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

      {/* Export Hub Modal */}
      <ExportHub
        expenses={expenses}
        isOpen={isExportHubOpen}
        onClose={() => setIsExportHubOpen(false)}
      />
    </div>
  );
};
