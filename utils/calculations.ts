import { Expense, ExpenseCategory, SpendingSummary } from '@/types/expense';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export const calculateSpendingSummary = (expenses: Expense[]): SpendingSummary => {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // Calculate total spending
  const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate monthly spending
  const monthlySpending = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate category breakdown
  const categoryBreakdown: Record<ExpenseCategory, number> = {
    Food: 0,
    Transportation: 0,
    Entertainment: 0,
    Shopping: 0,
    Bills: 0,
    Other: 0,
  };

  expenses.forEach(expense => {
    categoryBreakdown[expense.category] += expense.amount;
  });

  // Find top category
  let topCategory: SpendingSummary['topCategory'] = null;
  let maxAmount = 0;

  (Object.keys(categoryBreakdown) as ExpenseCategory[]).forEach(category => {
    if (categoryBreakdown[category] > maxAmount) {
      maxAmount = categoryBreakdown[category];
      topCategory = { category, amount: maxAmount };
    }
  });

  return {
    totalSpending,
    monthlySpending,
    categoryBreakdown,
    topCategory,
  };
};
