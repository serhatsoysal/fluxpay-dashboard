import { format, parseISO, formatDistance } from 'date-fns';

export const formatDate = (date: string | Date, formatStr = 'MMM d, yyyy'): string => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
};

export const formatDateTime = (date: string | Date): string => {
    return formatDate(date, 'MMM d, yyyy HH:mm');
};

export const formatRelativeTime = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(dateObj, new Date(), { addSuffix: true });
};
