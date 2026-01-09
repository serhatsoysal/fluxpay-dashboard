export const formatCurrency = (
    amount: number,
    currency = 'USD',
    locale = 'en-US'
): string => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(amount / 100);
};

export const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount / 100);
};
