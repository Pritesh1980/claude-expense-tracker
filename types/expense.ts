export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other';

export interface Expense {
  id: string;
  date: string; // ISO date string
  amount: number;
  category: ExpenseCategory;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFormData {
  date: string;
  amount: string;
  category: ExpenseCategory;
  description: string;
}

export interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  category?: ExpenseCategory | 'All';
  searchQuery?: string;
}

export interface SpendingSummary {
  totalSpending: number;
  monthlySpending: number;
  categoryBreakdown: Record<ExpenseCategory, number>;
  topCategory: {
    category: ExpenseCategory;
    amount: number;
  } | null;
}
