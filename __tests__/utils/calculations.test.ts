import { calculateSpendingSummary } from '@/utils/calculations';
import { Expense } from '@/types/expense';

describe('Calculation Utilities', () => {
  describe('calculateSpendingSummary', () => {
    const mockExpenses: Expense[] = [
      {
        id: '1',
        date: new Date().toISOString(),
        amount: 50,
        category: 'Food',
        description: 'Groceries',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        date: new Date().toISOString(),
        amount: 100,
        category: 'Transportation',
        description: 'Gas',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        date: new Date().toISOString(),
        amount: 75,
        category: 'Food',
        description: 'Restaurant',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        date: '2020-01-01',
        amount: 200,
        category: 'Bills',
        description: 'Old bill',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    it('should calculate total spending correctly', () => {
      const summary = calculateSpendingSummary(mockExpenses);
      expect(summary.totalSpending).toBe(425);
    });

    it('should calculate monthly spending (current month only)', () => {
      const summary = calculateSpendingSummary(mockExpenses);
      // Should exclude the old expense from 2020
      expect(summary.monthlySpending).toBe(225);
    });

    it('should create category breakdown', () => {
      const summary = calculateSpendingSummary(mockExpenses);
      expect(summary.categoryBreakdown.Food).toBe(125);
      expect(summary.categoryBreakdown.Transportation).toBe(100);
      expect(summary.categoryBreakdown.Bills).toBe(200);
      expect(summary.categoryBreakdown.Entertainment).toBe(0);
      expect(summary.categoryBreakdown.Shopping).toBe(0);
      expect(summary.categoryBreakdown.Other).toBe(0);
    });

    it('should identify top spending category', () => {
      const summary = calculateSpendingSummary(mockExpenses);
      expect(summary.topCategory).toEqual({
        category: 'Bills',
        amount: 200,
      });
    });

    it('should handle empty expenses array', () => {
      const summary = calculateSpendingSummary([]);
      expect(summary.totalSpending).toBe(0);
      expect(summary.monthlySpending).toBe(0);
      expect(summary.topCategory).toBeNull();
      expect(Object.values(summary.categoryBreakdown).every(v => v === 0)).toBe(true);
    });

    it('should return null for top category when all categories are zero', () => {
      const summary = calculateSpendingSummary([]);
      expect(summary.topCategory).toBeNull();
    });

    it('should handle single expense', () => {
      const singleExpense: Expense[] = [
        {
          id: '1',
          date: new Date().toISOString(),
          amount: 42,
          category: 'Entertainment',
          description: 'Movie ticket',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const summary = calculateSpendingSummary(singleExpense);
      expect(summary.totalSpending).toBe(42);
      expect(summary.monthlySpending).toBe(42);
      expect(summary.topCategory).toEqual({
        category: 'Entertainment',
        amount: 42,
      });
    });

    it('should handle expenses with same amount in multiple categories', () => {
      const equalExpenses: Expense[] = [
        {
          id: '1',
          date: new Date().toISOString(),
          amount: 50,
          category: 'Food',
          description: 'Lunch',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          date: new Date().toISOString(),
          amount: 50,
          category: 'Transportation',
          description: 'Bus',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const summary = calculateSpendingSummary(equalExpenses);
      // Should pick the first one encountered
      expect(summary.topCategory).toBeTruthy();
      expect(summary.topCategory?.amount).toBe(50);
    });

    it('should correctly sum decimal amounts', () => {
      const decimalExpenses: Expense[] = [
        {
          id: '1',
          date: new Date().toISOString(),
          amount: 10.99,
          category: 'Food',
          description: 'Coffee',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          date: new Date().toISOString(),
          amount: 5.50,
          category: 'Food',
          description: 'Snack',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const summary = calculateSpendingSummary(decimalExpenses);
      expect(summary.totalSpending).toBeCloseTo(16.49, 2);
      expect(summary.categoryBreakdown.Food).toBeCloseTo(16.49, 2);
    });
  });
});
