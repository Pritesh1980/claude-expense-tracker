'use client';

import React, { useState, useEffect } from 'react';
import { Expense, ExpenseFormData } from '@/types/expense';
import { storageUtils } from '@/lib/storage';
import { exportToCSV } from '@/utils/export';
import { Dashboard } from '@/components/Dashboard';
import { ExpenseList } from '@/components/ExpenseList';
import { ExpenseForm } from '@/components/ExpenseForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

type ViewMode = 'dashboard' | 'expenses';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const loadedExpenses = storageUtils.getExpenses();
    setExpenses(loadedExpenses);
    setIsLoaded(true);
  }, []);

  const handleAddExpense = (formData: ExpenseFormData) => {
    const newExpense = storageUtils.addExpense({
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
    });

    setExpenses(prev => [...prev, newExpense]);
    setIsModalOpen(false);
  };

  const handleEditExpense = (formData: ExpenseFormData) => {
    if (!editingExpense) return;

    const updatedExpense = storageUtils.updateExpense(editingExpense.id, {
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
    });

    if (updatedExpense) {
      setExpenses(prev =>
        prev.map(exp => (exp.id === updatedExpense.id ? updatedExpense : exp))
      );
    }

    setEditingExpense(null);
    setIsModalOpen(false);
  };

  const handleDeleteExpense = (id: string) => {
    const success = storageUtils.deleteExpense(id);
    if (success) {
      setExpenses(prev => prev.filter(exp => exp.id !== id));
    }
  };

  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleExport = () => {
    exportToCSV(expenses);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">💼 Expense Tracker</h1>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleExport}
                disabled={expenses.length === 0}
              >
                Export CSV
              </Button>
              <Button variant="primary" onClick={handleOpenAddModal}>
                + Add Expense
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setViewMode('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                viewMode === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setViewMode('expenses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                viewMode === 'expenses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Expenses
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'dashboard' ? (
          <Dashboard expenses={expenses} />
        ) : (
          <ExpenseList
            expenses={expenses}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteExpense}
          />
        )}
      </main>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
      >
        <ExpenseForm
          onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
          onCancel={handleCloseModal}
          initialData={editingExpense || undefined}
        />
      </Modal>
    </div>
  );
}
