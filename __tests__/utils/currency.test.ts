import { formatCurrency, parseCurrency } from '@/utils/currency';

describe('Currency Utilities', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers as GBP currency', () => {
      expect(formatCurrency(100)).toBe('£100.00');
      expect(formatCurrency(1234.56)).toBe('£1,234.56');
      expect(formatCurrency(0.99)).toBe('£0.99');
    });

    it('should handle zero correctly', () => {
      expect(formatCurrency(0)).toBe('£0.00');
    });

    it('should format negative numbers', () => {
      expect(formatCurrency(-50)).toBe('-£50.00');
      expect(formatCurrency(-1234.56)).toBe('-£1,234.56');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1000000)).toBe('£1,000,000.00');
      expect(formatCurrency(9999999.99)).toBe('£9,999,999.99');
    });

    it('should round to 2 decimal places', () => {
      expect(formatCurrency(10.999)).toBe('£11.00');
      expect(formatCurrency(10.1)).toBe('£10.10');
    });
  });

  describe('parseCurrency', () => {
    it('should parse currency strings to numbers', () => {
      expect(parseCurrency('£100.00')).toBe(100);
      expect(parseCurrency('£1,234.56')).toBe(1234.56);
      expect(parseCurrency('$99.99')).toBe(99.99);
    });

    it('should handle plain number strings', () => {
      expect(parseCurrency('42')).toBe(42);
      expect(parseCurrency('123.45')).toBe(123.45);
    });

    it('should remove non-numeric characters except decimal point', () => {
      expect(parseCurrency('£1,234.56')).toBe(1234.56);
      expect(parseCurrency('GBP 500')).toBe(500);
      expect(parseCurrency('£-50.00')).toBe(50);
    });

    it('should return 0 for invalid input', () => {
      expect(parseCurrency('')).toBe(0);
      expect(parseCurrency('abc')).toBe(0);
      expect(parseCurrency('---')).toBe(0);
    });

    it('should handle strings with only decimal points', () => {
      expect(parseCurrency('.')).toBe(0);
      expect(parseCurrency('..')).toBe(0);
    });

    it('should parse decimal numbers correctly', () => {
      expect(parseCurrency('0.5')).toBe(0.5);
      expect(parseCurrency('.99')).toBe(0.99);
    });
  });
});
