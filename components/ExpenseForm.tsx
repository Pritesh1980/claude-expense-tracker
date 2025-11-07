'use client';

import React, { useState, useEffect } from 'react';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { ExpenseFormData, ExpenseCategory, Expense } from '@/types/expense';
import { validateExpenseForm, hasErrors } from '@/utils/validation';
import { format } from 'date-fns';

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  onCancel: () => void;
  initialData?: Expense;
}

const categoryOptions = [
  { value: 'Food', label: 'Food' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Bills', label: 'Bills' },
  { value: 'Other', label: 'Other' },
];

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState<ExpenseFormData>({
    date: initialData ? format(new Date(initialData.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    amount: initialData ? initialData.amount.toString() : '',
    category: initialData?.category || 'Food',
    description: initialData?.description || '',
  });

  const [errors, setErrors] = useState<ReturnType<typeof validateExpenseForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateExpenseForm(formData);

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    onSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Date"
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        error={errors.date}
        max={format(new Date(), 'yyyy-MM-dd')}
        required
      />

      <Input
        label="Amount (£)"
        type="number"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        error={errors.amount}
        placeholder="0.00"
        step="0.01"
        min="0"
        required
      />

      <Select
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        error={errors.category}
        options={categoryOptions}
        required
      />

      <div className="w-full">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange as any}
          className={`w-full px-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          rows={3}
          placeholder="Enter expense description..."
          maxLength={200}
          required
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.description.length}/200 characters
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Expense' : 'Add Expense'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
