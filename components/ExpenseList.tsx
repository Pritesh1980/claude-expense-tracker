'use client';

import React, { useState } from 'react';
import { Expense, ExpenseCategory } from '@/types/expense';
import { formatCurrency } from '@/utils/currency';
import { format } from 'date-fns';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const categoryFilterOptions = [
  { value: 'All', label: 'All Categories' },
  { value: 'Food', label: 'Food' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Bills', label: 'Bills' },
  { value: 'Other', label: 'Other' },
];

const getCategoryColor = (category: ExpenseCategory): string => {
  const colors: Record<ExpenseCategory, string> = {
    Food: 'bg-green-100 text-green-800',
    Transportation: 'bg-blue-100 text-blue-800',
    Entertainment: 'bg-purple-100 text-purple-800',
    Shopping: 'bg-pink-100 text-pink-800',
    Bills: 'bg-orange-100 text-orange-800',
    Other: 'bg-gray-100 text-gray-800',
  };
  return colors[category];
};

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onEdit,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredExpenses = expenses.filter(expense => {
    // Search filter
    const matchesSearch = expense.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory =
      categoryFilter === 'All' || expense.category === categoryFilter;

    // Date range filter
    const expenseDate = new Date(expense.date);
    const matchesStartDate = !startDate || expenseDate >= new Date(startDate);
    const matchesEndDate = !endDate || expenseDate <= new Date(endDate);

    return matchesSearch && matchesCategory && matchesStartDate && matchesEndDate;
  });

  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Input
          placeholder="Search expenses..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <Select
          options={categoryFilterOptions}
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        />

        <Input
          type="date"
          placeholder="Start date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />

        <Input
          type="date"
          placeholder="End date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
      </div>

      {/* Expense List */}
      {sortedExpenses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No expenses found</p>
          <p className="text-gray-400 text-sm mt-2">
            {expenses.length === 0
              ? 'Start by adding your first expense'
              : 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedExpenses.map(expense => (
            <div
              key={expense.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        expense.category
                      )}`}
                    >
                      {expense.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(expense.date), 'dd MMM yyyy')}
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium mb-1">
                    {expense.description}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(expense)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this expense?')) {
                        onDelete(expense.id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results count */}
      {expenses.length > 0 && (
        <p className="text-sm text-gray-500 text-center">
          Showing {sortedExpenses.length} of {expenses.length} expenses
        </p>
      )}
    </div>
  );
};
