import { describe, it, expect } from 'vitest';
import { formatCurrency, formatAmount } from './currencyHelpers';

describe('currencyHelpers', () => {
  describe('formatCurrency', () => {
    it('should format currency in cents to USD', () => {
      expect(formatCurrency(10000)).toBe('$100.00');
    });

    it('should format currency with custom currency', () => {
      expect(formatCurrency(10000, 'EUR')).toContain('100');
    });

    it('should handle zero amount', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should handle negative amounts', () => {
      expect(formatCurrency(-10000)).toBe('-$100.00');
    });
  });

  describe('formatAmount', () => {
    it('should format amount in cents', () => {
      expect(formatAmount(10000)).toBe('100.00');
    });

    it('should format amount with decimals', () => {
      expect(formatAmount(12345)).toBe('123.45');
    });

    it('should handle zero amount', () => {
      expect(formatAmount(0)).toBe('0.00');
    });
  });
});


