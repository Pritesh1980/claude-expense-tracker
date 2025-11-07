import { validateExpenseForm, hasErrors } from '@/utils/validation';
import { ExpenseFormData } from '@/types/expense';

describe('Validation Utilities', () => {
  describe('validateExpenseForm', () => {
    const validFormData: ExpenseFormData = {
      date: '2025-01-01',
      amount: '50.00',
      category: 'Food',
      description: 'Test expense',
    };

    it('should return no errors for valid data', () => {
      const errors = validateExpenseForm(validFormData);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    describe('date validation', () => {
      it('should require date', () => {
        const errors = validateExpenseForm({
          ...validFormData,
          date: '',
        });
        expect(errors.date).toBe('Date is required');
      });

      it('should reject future dates', () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        const errors = validateExpenseForm({
          ...validFormData,
          date: futureDate.toISOString().split('T')[0],
        });
        expect(errors.date).toBe('Date cannot be in the future');
      });

      it('should accept today\'s date', () => {
        const today = new Date().toISOString().split('T')[0];
        const errors = validateExpenseForm({
          ...validFormData,
          date: today,
        });
        expect(errors.date).toBeUndefined();
      });

      it('should accept past dates', () => {
        const errors = validateExpenseForm({
          ...validFormData,
          date: '2020-01-01',
        });
        expect(errors.date).toBeUndefined();
      });
    });

    describe('amount validation', () => {
      it('should require amount', () => {
        const errors = validateExpenseForm({
          ...validFormData,
          amount: '',
        });
        expect(errors.amount).toBe('Amount is required');
      });

      it('should reject zero amount', () => {
        const errors = validateExpenseForm({
          ...validFormData,
          amount: '0',
        });
        expect(errors.amount).toBe('Amount must be a positive number');
      });

      it('should reject negative amounts', () => {
        const errors = validateExpenseForm({
          ...validFormData,
          amount: '-10',
        });
        expect(errors.amount).toBe('Amount must be a positive number');
      });

      it('should reject non-numeric amounts', () => {
        const errors = validateExpenseForm({
          ...validFormData,
          amount: 'abc',
        });
        expect(errors.amount).toBe('Amount must be a positive number');
      });

      it('should reject unreasonably large amounts', () => {
        const errors = validateExpenseForm({
          ...validFormData,
          amount: '1000001',
        });
        expect(errors.amount).toBe('Amount seems unreasonably large');
      });

      it('should accept valid decimal amounts', () => {
        const errors = validateExpenseForm({
          ...validFormData,
          amount: '99.99',
        });
        expect(errors.amount).toBeUndefined();
      });

      it('should accept amounts up to 1 million', () => {
        const errors = validateExpenseForm({
          ...validFormData,
          amount: '1000000',
        });
        expect(errors.amount).toBeUndefined();
      });
    });

    describe('category validation', () => {
      it('should require category', () => {
        const errors = validateExpenseForm({
          ...validFormData,
          category: '' as any,
        });
        expect(errors.category).toBe('Category is required');
      });

      it('should accept valid categories', () => {
        const categories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Other'];
        categories.forEach(category => {
          const errors = validateExpenseForm({
            ...validFormData,
            category: category as any,
          });
          expect(errors.category).toBeUndefined();
        });
      });
    });

    describe('description validation', () => {
      it('should require description', () => {
        const errors = validateExpenseForm({
          ...validFormData,
          description: '',
        });
        expect(errors.description).toBe('Description is required');
      });

      it('should reject whitespace-only description', () => {
        const errors = validateExpenseForm({
          ...validFormData,
          description: '   ',
        });
        expect(errors.description).toBe('Description is required');
      });

      it('should reject descriptions over 200 characters', () => {
        const longDescription = 'a'.repeat(201);
        const errors = validateExpenseForm({
          ...validFormData,
          description: longDescription,
        });
        expect(errors.description).toBe('Description must be less than 200 characters');
      });

      it('should accept descriptions exactly 200 characters', () => {
        const maxDescription = 'a'.repeat(200);
        const errors = validateExpenseForm({
          ...validFormData,
          description: maxDescription,
        });
        expect(errors.description).toBeUndefined();
      });

      it('should accept valid descriptions', () => {
        const errors = validateExpenseForm({
          ...validFormData,
          description: 'Valid description with spaces and numbers 123',
        });
        expect(errors.description).toBeUndefined();
      });
    });

    it('should return multiple errors for multiple invalid fields', () => {
      const errors = validateExpenseForm({
        date: '',
        amount: '',
        category: '' as any,
        description: '',
      });
      expect(errors.date).toBeTruthy();
      expect(errors.amount).toBeTruthy();
      expect(errors.category).toBeTruthy();
      expect(errors.description).toBeTruthy();
    });
  });

  describe('hasErrors', () => {
    it('should return true when there are errors', () => {
      const errors = { date: 'Date is required' };
      expect(hasErrors(errors)).toBe(true);
    });

    it('should return false when there are no errors', () => {
      const errors = {};
      expect(hasErrors(errors)).toBe(false);
    });

    it('should return true for multiple errors', () => {
      const errors = {
        date: 'Date is required',
        amount: 'Amount is required',
      };
      expect(hasErrors(errors)).toBe(true);
    });
  });
});
