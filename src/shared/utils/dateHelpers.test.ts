import { describe, it, expect } from 'vitest';
import { formatDate, formatDateTime, formatRelativeTime } from './dateHelpers';

describe('dateHelpers', () => {
  const testDate = new Date('2024-01-15T10:30:00Z');
  const testDateString = '2024-01-15T10:30:00Z';

  describe('formatDate', () => {
    it('should format date from Date object', () => {
      const result = formatDate(testDate);
      expect(result).toContain('2024');
    });

    it('should format date from string', () => {
      const result = formatDate(testDateString);
      expect(result).toContain('2024');
    });

    it('should use custom format string', () => {
      const result = formatDate(testDate, 'yyyy-MM-dd');
      expect(result).toBe('2024-01-15');
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time', () => {
      const result = formatDateTime(testDate);
      expect(result).toContain('2024');
      expect(result).toContain(':');
    });

    it('should format date and time from string', () => {
      const result = formatDateTime(testDateString);
      expect(result).toContain('2024');
    });
  });

  describe('formatRelativeTime', () => {
    it('should format relative time from Date object', () => {
      const pastDate = new Date(Date.now() - 86400000); // 1 day ago
      const result = formatRelativeTime(pastDate);
      expect(result).toContain('ago');
    });

    it('should format relative time from string', () => {
      const pastDateString = new Date(Date.now() - 86400000).toISOString();
      const result = formatRelativeTime(pastDateString);
      expect(result).toContain('ago');
    });
  });
});


