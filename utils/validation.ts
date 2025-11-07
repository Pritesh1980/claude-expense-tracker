import { ExpenseFormData } from '@/types/expense';

export interface ValidationErrors {
  date?: string;
  amount?: string;
  category?: string;
  description?: string;
}

export const validateExpenseForm = (formData: ExpenseFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validate date
  if (!formData.date) {
    errors.date = 'Date is required';
  } else {
    const date = new Date(formData.date);
    const now = new Date();
    if (date > now) {
      errors.date = 'Date cannot be in the future';
    }
  }

  // Validate amount
  if (!formData.amount) {
    errors.amount = 'Amount is required';
  } else {
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      errors.amount = 'Amount must be a positive number';
    } else if (amount > 1000000) {
      errors.amount = 'Amount seems unreasonably large';
    }
  }

  // Validate category
  if (!formData.category) {
    errors.category = 'Category is required';
  }

  // Validate description
  if (!formData.description.trim()) {
    errors.description = 'Description is required';
  } else if (formData.description.length > 200) {
    errors.description = 'Description must be less than 200 characters';
  }

  return errors;
};

export const hasErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};
